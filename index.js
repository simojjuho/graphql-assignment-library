const { ApolloServer } = require('@apollo/server')
const { GraphQLError } = require('graphql')
const { startStandaloneServer } = require('@apollo/server/standalone')
const jwt = require('jsonwebtoken')
const typeDefs = require('./src/core/graphql/schema')
const resolvers = require('./src/core/graphql/resolvers')
const { TOKEN } = require('./src/utils/config')
const User = require('./src/core/models/User')

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), TOKEN
      )
      const currentUser = await User.findById(decodedToken.id)
      return currentUser
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
