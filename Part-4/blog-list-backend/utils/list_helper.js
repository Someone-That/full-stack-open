const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
  const reducer = (fav, blog) => {
    if (blog.likes > fav.likes) {
      return blog
    }
    return fav
  }

  return blogs.reduce(reducer)
}

const mostBlogs = (blogs) => {
  const reducer = (most, blogg) => {
    if (blogs.filter((blog) => blog.author === blogg.author).length > blogs.filter((blog) => blog.author === most.author).length) {
      return blogg
    }
    return most
  }

  const blogWithAuthor = blogs.reduce(reducer)
  const author = blogWithAuthor.author
  const output = {
    author: author,
    blogs: blogs.filter((blog) => blog.author === author).length
  }

  return output
}

const blogsByAuthor = (author, blogs) => {
  return blogs.filter((blog) => blog.author === author)
}

const totalLikesByAuthor = (author, blogs) => {
  blogs = blogsByAuthor(author, blogs)
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.reduce(reducer, 0)
}

const mostLikes = (blogs) => {
  const reducer = (favAuthor, blog) => {
    if (totalLikesByAuthor(blog.author, blogs) > totalLikesByAuthor(favAuthor.author, blogs)) {
      return blog
    }
    return favAuthor
  }
  bauthor = blogs.reduce(reducer).author
  return {
    author: bauthor,
    likes: totalLikesByAuthor(bauthor, blogs)
  }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}
