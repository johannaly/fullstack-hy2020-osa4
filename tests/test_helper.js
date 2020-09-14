const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Help with JS',
    author: 'Johanna L',
    url: 'http://google.fi',
    likes: 30
  },
  {
    title: 'CSS for beginners',
    author: 'Mark Spencer',
    url: 'http://marks.fi',
    likes: 45,
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb
}