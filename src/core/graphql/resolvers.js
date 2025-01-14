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
      if(!args.author || !args.genre) {
        return await Book.find({}).populate('author')
      }

      return await Book.find({author: { name: args.author }})

    },
    allAuthors: async () => {
      return await Author.find({})
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