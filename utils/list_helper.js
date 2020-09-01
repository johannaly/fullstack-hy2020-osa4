const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {

  const mostLiked = blogs.reduce((mostLikedBlog, b) =>
    b.likes > mostLikedBlog ? b: mostLikedBlog, blogs[0].likes
  )
  const mostLikedBlog = {
    'title': mostLiked.title,
    'author': mostLiked.author,
    'likes': mostLiked.likes
  }
  return mostLikedBlog
}

const mostBlogs = (blogs) => {
  const blogsInOrder = _(blogs)
    .groupBy(b => b.author)
    .map((author, blogs) => ({ author, blogs }))
    .value()

  const winner = _.last(blogsInOrder)
  return {
    'author': winner.blogs,
    'blogs': winner.author.length
  }
}

const mostLikes = (blogs) => {
  const blogsInOrder = _(blogs)
    .groupBy(b => b.author)
    .value()

  const likesSum = _.map(blogsInOrder, (values, key) => { return { name: key, likes: _.sumBy(values, b => b.likes) }})
  const mostLikedWriter = _.maxBy(likesSum, 'likes')
  return {
    'author': mostLikedWriter.name,
    'likes':mostLikedWriter.likes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}