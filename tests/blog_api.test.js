const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
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

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('identity is in form id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('new blog can be added', async () => {
  const newBlog = {
    title: 'Something totally else',
    author: 'Liisa Liisanen',
    url: 'something.else',
    likes:3
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const contents = response.body.map(b => b.title)
  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(contents).toContain('Something totally else')
})

test('if likes is not defined, it is zero', async () => {
  const newBlog = {
    title: 'Above all zeros',
    author: 'Zelda Männikkö',
    url: 'zero.zep'
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  //console.log(response.body)
  const likes = response.body.map(b => b.likes)
  expect(likes[initialBlogs.length]) === 0
})

test('new blog without title is not accepted', async () => {
  const newBlog = {
    author: 'Ilkka Lehti',
    url: 'lehti.ocm'
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')
  expect(response.status) === 400

})

test('new blog without url is not accepted', async () => {
  const newBlog = {
    title: 'Javascript-stuff',
    author: 'Markku Aro'
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')
  expect(response.status) === 400

})

afterAll(() => {
  mongoose.connection.close()
})
