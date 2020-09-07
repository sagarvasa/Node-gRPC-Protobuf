var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");

// Proto file path for all services
const ORDER_PROTO = "./../proto/orders.proto";

const ORDER_SERVER_URL = "localhost:3002";

let loaderOptions = {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
}

let orderPackageDefinition = protoLoader.loadSync(ORDER_PROTO, loaderOptions);

const OrderService = grpc.loadPackageDefinition(orderPackageDefinition).OrdersService;

const orderClient = new OrderService(
    ORDER_SERVER_URL,
    grpc.credentials.createInsecure()
);

module.exports = { orderClient };
