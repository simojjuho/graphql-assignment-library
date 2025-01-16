require('dotenv').config()

const CONNECTION_STRING = process.env.MONGODB_URI_DEV
const TOKEN = process.env.JWT_SECRET

module.exports = {
  CONNECTION_STRING,
  TOKEN
}