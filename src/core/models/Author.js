import mongoose from '../../infrastucture/mongodb.js'
import uniqueValidator from 'mongoose-unique-validator'
import { Book } from './Book.js'

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4
  },
  born: {
    type: Number
  },
  books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }]
})

schema.plugin(uniqueValidator)

export const Author = mongoose.model('Author', schema)