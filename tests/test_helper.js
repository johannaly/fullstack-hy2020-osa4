const Blog = require('../models/blog')
const User = require('../models/user')


const initialBlogs = [
  {
    title: 'Help with JS',
    author: 'Johanna L',
    url: 'http://google.fi',
    likes: 30,
    user: '5f7450dc9e209b21589abbc0'
  },
  {
    title: 'CSS for beginners',
    author: 'Mark Spencer',
    url: 'http://marks.fi',
    likes: 45,
    user: '5f7450dc9e209b21589abbc0'
  }
]


const usersInDb = async () => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, id: 1 })
  return users.map(u => u.toJSON())
}

const blogsInDb = async () => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb
}