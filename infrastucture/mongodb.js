const mongoose = require('mongoose')
const Book = require('../core/models/book')
const Author = require('../core/models/Author')

const CONNECTION_STRING = process.env.MONGODB_URI_DEV
mongoose.set('strictQuery', false)

console.log('Connecting to the database...')

mongoose.connect(CONNECTION_STRING)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB')
  })