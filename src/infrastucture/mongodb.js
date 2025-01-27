import mongoose from 'mongoose'
import { CONNECTION_STRING } from '../utils/config.js'

mongoose.set('strictQuery', false)

console.log('Connecting to the database...')
mongoose.connect(CONNECTION_STRING)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB')
  })

  export default mongoose