import 'dotenv/config'

export const CONNECTION_STRING = process.env.MONGODB_URI_DEV
export const TOKEN = process.env.JWT_SECRET