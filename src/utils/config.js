require('dotenv').config()

const CONNECTION_STRING = process.env.MONGODB_URI_DEV

module.exports = {
  CONNECTION_STRING
}