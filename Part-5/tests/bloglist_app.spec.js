const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'tester',
        username: 'test',
        password: 'test'  
      }
    })

    await page.goto('/')
  })

  test('ensure that the application displays the login form by default', async ({ page }) => {
    const locator = page.getByLabel('username')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'test', 'test')
      await expect(page.getByText('blogs')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'test', 'tester')
      await expect(page.getByText('blogs')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'test', 'test')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'title test', 'author test', 'url test')
      await expect(page.getByText('title test author test')).toBeVisible()
    })

    test('the blog can be liked', async ({ page }) => {
      await createBlog(page, 'title test', 'author test', 'url test')
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('likes: 0')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes: 1')).toBeVisible()
    })

    test('the blog can be deleted and only by the user who created it', async ({ page, request }) => {
      await createBlog(page, 'title test', 'author test', 'url test')
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'delete' })).toBeVisible()
      page.once('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'delete' }).click()
      await expect(page.getByRole('button', { name: 'delete' })).not.toBeVisible()
      await createBlog(page, 'title test', 'author test', 'url test')
      // switch to diff user
      await request.post('/api/users', {
        data: {
          name: 'tester2',
          username: 'test2',
          password: 'test'  
        }
      })
      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'test2', 'test')
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'delete' })).not.toBeVisible()
    })

    test('blog order correct', async ({ page }) => {
      await createBlog(page, 'blog1', 'author', 'url')
      await createBlog(page, 'blog2', 'author', 'url')
      await createBlog(page, 'blog3', 'author', 'url')

      const blog1 = page.locator('.blog', { hasText: 'blog1 author' })
      const blog2 = page.locator('.blog', { hasText: 'blog2 author' })
      const blog3 = page.locator('.blog', { hasText: 'blog3 author' })

      await blog1.getByRole('button', { name: 'view' }).click()
      await blog2.getByRole('button', { name: 'view' }).click()
      await blog3.getByRole('button', { name: 'view' }).click()

      // add 3 likes to blog2, 2 likes to blog3, 1 like to blog1
      // therefore the order should be blog2, blog3, blog1
      await blog2.getByRole('button', { name: 'like' }).click()
      await blog2.getByRole('button', { name: 'like' }).click()
      await blog2.getByRole('button', { name: 'like' }).click()

      await blog3.getByRole('button', { name: 'like' }).click()
      await blog3.getByRole('button', { name: 'like' }).click()

      await blog1.getByRole('button', { name: 'like' }).click()

      await blog1.locator('#likes', { hasText: 'likes: 1' }).waitFor()

      // check dom order of blogs
      const blogs = await page.locator('.blog').allTextContents()
      expect(blogs[0]).toContain('blog2')
      expect(blogs[1]).toContain('blog3')
      expect(blogs[2]).toContain('blog1')
    })
  })
})
