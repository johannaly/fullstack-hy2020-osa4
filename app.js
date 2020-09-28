const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const loginRouter = require('./controllers/login')
const cors = require('cors')
const usersRouter = require('./controllers/users')

const logger = require('./utils/logger')
const mongoose = require('mongoose')
const { MONGODB_URI } = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')



logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch((error => {
    logger.error('error connecting to MongoDB:', error.message)
  }))


app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app