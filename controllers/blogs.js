const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { request, response } = require('../app')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if(blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end()
  }
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

blogsRouter.put('/:id', async (request, response, next) => {
  const blog = new Blog(request.body)

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog.toJSON())
    })
    .catch(error => next(error))
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter