const mongoose = require('mongoose')

const { CONNECTION_STRING } = require('../utils/config')
mongoose.set('strictQuery', false)

console.log('Connecting to the database...')
mongoose.connect(CONNECTION_STRING)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB')
  })

  module.exports = mongoose