import mongoose from '../../infrastucture/mongodb.js'
import uniqueValidator from 'mongoose-unique-validator'

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
})

schema.plugin(uniqueValidator)

export const Author = mongoose.model('Author', schema)