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


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}