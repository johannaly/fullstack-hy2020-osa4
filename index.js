const app = require('./app')
const http = require('http')
const morgan = require('morgan')
const config = require('./utils/config')
const logger = require('./utils/logger')
const server = http.createServer(app)


server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})


morgan.token('body', function (request, response) {
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

