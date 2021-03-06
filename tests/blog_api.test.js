const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
//const bcrypt = require('bcryptjs')



beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

beforeEach(async () => {
  await User.deleteMany({})
  const user = new User({ _id: '5f7450dc9e209b21589abbc0', username: 'root', name: 'root', password: 'sekret' })
  await user.save()
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
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
    likes:3,
    userId: '5f7450dc9e209b21589abbc0'
  }

  await api
    .post('/api/blogs')
    .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjVmNzQ1MGRjOWUyMDliMjE1ODlhYmJjMCIsImlhdCI6MTYwMTQ2MDY0OX0.k_czMgXwYspFcMx6uNT83cL61NeRMUtpSJl9fYHNAn4')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const contents = response.body.map(b => b.title)
  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(contents).toContain('Something totally else')
})

test('new blog cannot be added without token', async () => {

  const newBlog = {
    title: 'Something totally else',
    author: 'Liisa Liisanen',
    url: 'something.else',
    likes:3,
    userId: '5f7450dc9e209b21589abbc0'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const response = await api.get('/api/blogs')
  expect(response.status) === 400
  expect(response.body.error) === 'Unauthorized'
})

test('if likes is not defined, it is zero', async () => {
  const newBlog = {
    title: 'Above all zeros',
    author: 'Zelda Männikkö',
    url: 'zero.zep',
    userId: '5f7450dc9e209b21589abbc0'
  }

  await api
    .post('/api/blogs')
    .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjVmNzQ1MGRjOWUyMDliMjE1ODlhYmJjMCIsImlhdCI6MTYwMTQ2MDY0OX0.k_czMgXwYspFcMx6uNT83cL61NeRMUtpSJl9fYHNAn4')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const likes = response.body.map(b => b.likes)
  expect(likes[helper.initialBlogs.length]) === 0
})

test('new blog without title is not accepted', async () => {
  const newBlog = {
    author: 'Ilkka Lehti',
    url: 'lehti.ocm',
    userId: '5f7450dc9e209b21589abbc0'
  }

  await api
    .post('/api/blogs')
    .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjVmNzQ1MGRjOWUyMDliMjE1ODlhYmJjMCIsImlhdCI6MTYwMTQ2MDY0OX0.k_czMgXwYspFcMx6uNT83cL61NeRMUtpSJl9fYHNAn4')
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')
  expect(response.status) === 400
})

test('new blog without url is not accepted', async () => {
  const newBlog = {
    title: 'Javascript-stuff',
    author: 'Markku Aro',
    userId: '5f7450dc9e209b21589abbc0'
  }
  await api
    .post('/api/blogs')
    .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjVmNzQ1MGRjOWUyMDliMjE1ODlhYmJjMCIsImlhdCI6MTYwMTQ2MDY0OX0.k_czMgXwYspFcMx6uNT83cL61NeRMUtpSJl9fYHNAn4')
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')
  expect(response.status) === 400
})

test('blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  //console.log(blogsAtStart)
  const blogToDelete = blogsAtStart[0]
  //console.log(blogToDelete.id)

  if(blogToDelete.user.id.toString() === '5f7450dc9e209b21589abbc0') {
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjVmNzQ1MGRjOWUyMDliMjE1ODlhYmJjMCIsImlhdCI6MTYwMTQ2MDY0OX0.k_czMgXwYspFcMx6uNT83cL61NeRMUtpSJl9fYHNAn4')
      .expect(204)
  }
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

  const contents = blogsAtEnd.map(b => b.title)
  expect(contents).not.toContain(blogToDelete.title)
})

test('blog can be modified', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToModified = blogsAtStart[0]
  //console.log(blogToModified)

  const newBlog = {
    title: blogToModified.title,
    author: blogToModified.author,
    url: blogToModified.url,
    id: blogToModified.id,
    likes: blogToModified.likes + 3
  }

  await api
    .put(`/api/blogs/${blogToModified.id}`)
    .send(newBlog)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  //console.log(blogsAtEnd)
  expect(blogsAtEnd[0].id).toContain(blogToModified.id)
  expect(blogsAtEnd[0].likes).not.toContain(30)
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    //const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', password: 'sekret' })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'jlyyti',
      name: 'Johanna Lyytinen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })


  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error) === 'Username must be unique'

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails if password is not defined', async () => {

    const newUser = {
      username: 'joolyy',
      name: 'Johanna Lyytinen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error) === 'Password missing'
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).not.toContain(newUser)
  })

  test('creation fails if password is too short', async () => {
    const newUser = {
      username: 'joolyy',
      name: 'Johanna Lyytinen',
      password: 'jk'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error) === 'Password too short'
    const usersAtEnd = await helper.usersInDb()
    expect (usersAtEnd).not.toContain(newUser)
  })

  test('creation fails if username is not defined', async () => {
    const newUser = {
      name: 'Johanna Lyytinen',
      password: 'sekret'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error) === 'Username missing'
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).not.toContain(newUser)
  })

  test('creation fails if username is too short', async () => {
    const newUser = {
      username: 'jo',
      name: 'Johanna Lyytinen',
      password: 'sekret'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error) === 'Username too short'
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).not.toContain(newUser)

  })

})
afterAll(() => {
  mongoose.connection.close()
})
