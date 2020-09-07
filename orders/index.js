var path = require("path");
var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");
var ordersRpcsImpl = require("./controller/orders");

const server = new grpc.Server();

// Proto file path for all services
const ORDERS_PROTO = path.join(__dirname, '../proto/orders.proto')

const ORDERS_SERVER_URL = "localhost:3002";

let loaderOptions = {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
}

let orderPackageDefinition = protoLoader.loadSync(ORDERS_PROTO, loaderOptions);

const OrderService = grpc.loadPackageDefinition(orderPackageDefinition).OrdersService;

server.addService(OrderService.service, ordersRpcsImpl)

server.bind(ORDERS_SERVER_URL, grpc.ServerCredentials.createInsecure());

console.log(`Orders Server running at ${ORDERS_SERVER_URL}`);

server.start();