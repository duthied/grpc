const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

const PROTO_PATH = 'chat.proto'
const SERVER_URI = '0.0.0.0:50051'

const packageDefinition = protoLoader.loadSync(PROTO_PATH)
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)

const client = new protoDescriptor.ChatService(SERVER_URI, grpc.credentials.createInsecure())

const user = 'Devlon'
const sendMessageIntervalInMS = 2000

const chatStream = client.joinChat({ user })

chatStream.on('data', data => {
  const { message, user } = data

  console.log(`New message from ${user}: ${message}`)
}).on('error', error => {
  console.log(`Error: ${error}`)
  if (error.code === 14) {
    console.log(`There is no server listening on ${SERVER_URI}`)
    process.exit()
  }
})

let messageNumber = 0

setInterval(() => {
  client.sendMessage({ message: `New message no. ${messageNumber++}`, user }, (error, response) => {
    if (error) {
      console.log(error)
    }
  })
}, sendMessageIntervalInMS)