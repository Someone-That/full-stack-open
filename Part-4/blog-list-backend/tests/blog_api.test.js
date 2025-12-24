const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await User.deleteMany({})
  const newUser = {
    username: 'test',
    name: 'Superuser',
    password: 'test'
  }

  await api
    .post('/api/users')
    .send(newUser)
})

test('verifies that the unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')

  const blogs = response.body
  assert(blogs[0].id !== undefined)
})

test('all blogs are returned and in json format', async () => {
  const response = await api.get('/api/blogs')

  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test.only('verify that if the title or url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request', async () => {
  const newBlog = {
    author: "testn",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10
}
  const login = await api.post('/api/login').send({
  "username": "test",
  "password": "test"
})
  const testToken = login.body.token
  const result1 = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${testToken}`)
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
	const newerBlog = {
    title: "test",
    author: "testn",
    likes: 10
}
	const result2 = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${testToken}`)
    .send(newerBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert(result2.body.error.includes('title or url missing'))
  assert(result1.body.error.includes('title or url missing'))
})

test.only('a valid blog can be added ', async () => {
  const newBlog = {
    title: "test",
    author: "testn",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10
}
  const login = await api.post('/api/login').send({
  "username": "test",
  "password": "test"
})
  const testToken = login.body.token
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${testToken}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map((n) => n.title)
  assert(contents.includes('test'))
})

test.only('verifies that if the likes property is missing from the request, it will default to the value 0', async () => {
  const newBlog = {
    title: "test",
    author: "testn",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll"
}

  const login = await api.post('/api/login').send({
  "username": "test",
  "password": "test"
})
  const testToken = login.body.token
  const sentBlog = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${testToken}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const savedBlog = sentBlog.body

  assert.strictEqual(savedBlog.likes, 0)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const contents = blogsAtEnd.map((n) => n.title)
  assert(!contents.includes(blogToDelete.title))

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})

test('blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

	const newBlog = {...blogToUpdate, likes: blogToUpdate.likes + 1}

  const response = await api
	.put(`/api/blogs/${blogToUpdate.id}`)
	.send(newBlog)
	.expect(200)
	.expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
  assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1)
})

test('creation fails with proper statuscode and message if username already taken', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'root',
    name: 'Superuser',
    password: 'salainen'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  assert(result.body.error.includes('expected `username` to be unique'))

  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('verify that if the username or password is below 3 long, fail correctly', async () => {
  const usersAtStart = await helper.usersInDb()
  const newUser = {
    "username": "ot",
    "name": "Superuser",
    "password": "sun"
}
  const result1 = await api.post('/api/users').send(newUser).expect(401).expect('Content-Type', /application\/json/)
  assert(result1.body.error.includes('username and password need to be at least 3 long'))
	const newerUser = {
    "username": "rot",
    "name": "Superuser",
    "password": "un"
}
	const result2 = await api.post('/api/users').send(newerUser).expect(401).expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  assert(result2.body.error.includes('username and password need to be at least 3 long'))

  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test.only('make sure blog cant be added with no token', async () => {
  const newBlog = {
    title: "test",
    author: "testn",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10
}
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)
})

after(async () => {
  await mongoose.connection.close()
})
