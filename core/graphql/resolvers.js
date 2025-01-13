const authors = require('../entities/authors')
const books = require('../entities/books')

const resolvers = {
  Author: {
    bookCount: (root, args) => {
      return books.filter(b => b.author === root.name).length
    }
  },
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      if(!args.author && !args.genre)
        return books
      let filteredBooks = books
      if(args.author)
        filteredBooks = filteredBooks.filter(b => b.author === args.author)
      if(args.genre)
        filteredBooks = filteredBooks.filter(b => b.genres.includes(args.genre))
      return filteredBooks
    },
    allAuthors: () => {
        return authors
    }
  },

  Mutation: {
    addBook: (root, args) => {
      const newBook = { ...args, id: uuidv4() }
      const author = authors.find(a => a.name === newBook.author)
      if(!author) {
        const newAuthor = { name: args.author, id: uuidv4() }
        authors = authors.concat(newAuthor)
      }
      books = books.concat(newBook)
      return newBook
    },
    editAuthor: (root, args) => {
      const author = authors.find(a => a.name === args.name)
      if(!author) {
        return null
      }
      author.born = args.born
      authors = authors.map(a => a.name === author.name ? author : a)
      return author
    }
  }
}

module.exports = resolvers