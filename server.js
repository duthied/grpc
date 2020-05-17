const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

const PROTO_PATH = 'chat.proto'
const SERVER_URI = '0.0.0.0:50051'

const usersInChat = []

const packageDefinition = protoLoader.loadSync(PROTO_PATH)
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)

// handlers will go here

const server = new grpc.Server()
server.addService(protoDescriptor.ChatService.service, {})
server.bind(SERVER_URI, grpc.ServerCredentials.createInsecure())

server.start()
console.log('The server is running on ' + SERVER_URI)