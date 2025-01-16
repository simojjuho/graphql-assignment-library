const uniqueValidator = require('mongoose-unique-validator')
const mongoose = require('../../infrastucture/mongodb')

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
module.exports = mongoose.model('User', schema)