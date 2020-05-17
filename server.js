const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

const PROTO_PATH = 'chat.proto'
const SERVER_URI = '0.0.0.0:50051'

let usersInChat = []

const packageDefinition = protoLoader.loadSync(PROTO_PATH)
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)

const joinChat = call => {
  console.log(`User ${call.request.user} has joined`)

  call.on('cancelled', () => {
    usersInChat = usersInChat.filter(user => user !== call)
  })

  usersInChat.push(call)
}

const sendMessage = (call, callback) => {
  const { message } = call.request

  if (!message) {
    return callback(new Error('You must provide a non-empty message.'))
  }

  const messageToSend = {
    ...call.request,
    timestampe: Math.floor(new Date().getTime() / 1000),
  }

  usersInChat.forEach(user => user.write(messageToSend))

  callback(null, {})
}

const server = new grpc.Server()
server.addService(protoDescriptor.ChatService.service, {
  joinChat,
  sendMessage,
})
server.bind(SERVER_URI, grpc.ServerCredentials.createInsecure())

server.start()
console.log('The server is running on ' + SERVER_URI)