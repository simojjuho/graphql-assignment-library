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
    allBooks: async (root, args) => {
      if(!args.author && !args.genre) {
        return await Book.find({}).populate('author')
      }
      let books = await Book.find({}).populate('author')
      if(args.genre) {
        books = books.filter(b => b.genres.includes(args.genre))
      }
      if(args.author) {
        books = books.filter(b => b.author.name === args.author)
      }
      return books
    },
    allAuthors: async () => {
      return await Author.find({})
    }
  },

  Mutation: {
    addBook: async (root, args) => {
      const newBook = new Book({ ...args, author: {} })
      let author = await Author.findOne({ name: args.author })
      if(!author) {
        author = new Author({ name: args.author })
        await author.save()
      }
      newBook.author = author
      return await newBook.save()
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