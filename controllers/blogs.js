const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)
  if(typeof blog.likes === 'undefined') {
    blog.likes = 0
  }
  if(typeof blog.title === 'undefined') {
    response.status(400).send('Bad request')
    return
  }
  if(typeof blog.url === 'undefined') {
    response.status(400).send('Bad request')
    return
  }

  try {
    const savedBlog = await blog.save()
    response.json(savedBlog.toJSON())
  } catch(exception) {
    next(exception)
  }
})


module.exports = blogsRouter