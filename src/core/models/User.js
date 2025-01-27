import mongoose from '../../infrastucture/mongodb.js'
import uniqueValidator from 'mongoose-unique-validator'

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  favoriteGenre: {
    type: String,
    required: true
  }
})

schema.plugin(uniqueValidator)
export const User = mongoose.model('User', schema)