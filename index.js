import { ApolloServer } from '@apollo/server'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/use/ws';
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { makeExecutableSchema } from '@graphql-tools/schema'
import express from 'express'
import cors from 'cors'
import http from 'http'
import jwt from 'jsonwebtoken'
import {typeDefs} from './src/core/graphql/schema.js'
import {resolvers} from './src/core/graphql/resolvers.js'
import { TOKEN } from './src/utils/config.js'
import { User } from './src/core/models/User.js'

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/'
  })
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({httpServer}),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            }
          }
        }
      }
    ]
  })
  await server.start()
  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
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
    }),
  )
  const PORT = 4000
  httpServer.listen(PORT, () => console.log(`Server now running on http://localhost:${PORT}`))
}

start()