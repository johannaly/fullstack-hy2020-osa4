const Blog = require('../models/blog')
const User = require('../models/user')

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



const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb
}