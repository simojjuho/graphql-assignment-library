const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  published: {
    type: number
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  genres: [
    { type: String }
  ]
})

schema.plugin(uniqueValidator)
module.exports = mongoose.model('Book', schema)