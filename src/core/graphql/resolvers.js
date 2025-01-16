const jwt = require('jsonwebtoken')
const { GraphQLError } = require('graphql')
const authors = require('../entities/authors')
const books = require('../entities/books')
const Book = require('../models/Book')
const Author = require('../models/Author')
const User = require('../models/User')
const { TOKEN } = require('../../utils/config')

const resolvers = {
  Author: {
    bookCount: async (root, args) => {
      const books = await Book.find({}).populate('author')
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
    },
    me: async (root, args, context) => {
      return context
    }
  },

  Mutation: {
    addBook: async (root, args, context) => {
      if(!context.username) {
        throw new GraphQLError('User must be logged in', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
      if(args.title.length < 6 ||args.author.length < 5)
        throw new GraphQLError('Book title or author name too short', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: [args.title, args.author.name]
          }
        })
      const newBook = new Book({ ...args, author: {} })
      let author = await Author.findOne({ name: args.author })
      if(!author) {
        author = new Author({ name: args.author })
        await author.save()
      }
      newBook.author = author
      return await newBook.save()
    },
    editAuthor: async (root, args, context) => {
      if(!context.username) {
        throw new GraphQLError('User must be logged in', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
      const author = await Author.findOne({ name: args.name })
      if(!author) {
        return null
      }
      author.born = args.born
      return await author.save()
    },
    createUser: async (root, args) => {
      const newUser = await new User({ username: args.username, favoriteGenre: args.favoriteGenre })
      return newUser.save()
        .catch(error => {
          throw new GraphQLError('Failed creating user', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({username: args.username})

      if( !user || args.password !== 'secret' ) {
        throw new GraphQLError('Wrong username or password', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }
      return { value: jwt.sign( userForToken, TOKEN)  }
    },
  }
}

module.exports = resolvers