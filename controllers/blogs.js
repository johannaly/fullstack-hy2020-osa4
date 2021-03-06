const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name:1, id: 1 })
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

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  console.log(body)
  const decodedToken = response.locals.token
  if(decodedToken !== null) {
    const user = await User.findById(decodedToken.id)

    if(typeof body.likes === 'undefined') {
      body.likes = 0
    }
    if(typeof body.title === 'undefined' || body.title === '') {
      response.status(400).send('Bad request')
      return
    }
    if(typeof body.url === 'undefined' || body.url === '') {
      response.status(400).send('Bad request')
      return
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.json(savedBlog.toJSON())
  } else {
    response.status(401).send('Unauthorized')
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body


  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    id: request.params.id
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const decodedToken = response.locals.token
  const user = await User.findById(decodedToken.id)

  if(blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(blog)
    response.status(204).end()
  } else {
    response.status(400).send('You are not authorized to delete this blog')
  }
})

module.exports = blogsRouter