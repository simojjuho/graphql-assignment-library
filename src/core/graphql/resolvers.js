const authors = require('../entities/authors')
const books = require('../entities/books')
const Book = require('../models/Book')
const Author = require('../models/Author')

const resolvers = {
  Author: {
    bookCount: async (root, args) => {
      const books = await Book.find({}).populate('author')
      console.log(root)
      return books.filter(b => b.author.name === root.name).length
    }
  },
  Query: {
    bookCount: async () => {
      const books = await Book.find({})
      return books.length
    },
    authorCount: async () => {
      const authors = await Author.find({})
      return authors.length
    },
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
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if(!author) {
        return null
      }
      author.born = args.born
      console.log(author)
      return await author.save()
    }
  }
}

module.exports = resolvers