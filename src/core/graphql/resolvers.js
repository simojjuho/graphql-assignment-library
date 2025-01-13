const {  v4: uuidv4 } = require('uuid')
const authors = require('../entities/authors')
const books = require('../entities/books')
const Book = require('../models/Book')
const Author = require('../models/Author')

const resolvers = {
  Author: {
    bookCount: (root, args) => {
      return books.filter(b => b.author === root.name).length
    }
  },
  Query: {
    bookCount: () => Book.find({}).length,
    authorCount: () => Author.find({}).length,
    allBooks: (root, args) => {
      if(!args.author && !args.genre)
        return Book.find({})
      let filteredBooks
      if(args.author)
        filteredBooks = Book.filter(b => b.author === args.author)
      if(args.genre)
        filteredBooks = Book.filter(b => b.genres.includes(args.genre))
      return filteredBooks
    },
    allAuthors: () => {
        return Author.find({})
    }
  },

  Mutation: {
    addBook: async (root, args) => {
      const newBook = new Book({ ...args, author: {} })
      const author = await Author.findOne({ name: args.author })
      if(!author) {
        const newAuthor = new Author({ name: args.author })
        newAuthor.save()        
      }
      newBook.author = author
      return newBook.save()
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