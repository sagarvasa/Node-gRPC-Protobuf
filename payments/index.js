var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");
var paymentsRpcsImpl = require("./controller/payments");

const server = new grpc.Server();

// Proto file path for all services
const PAYMENT_PROTO = "../proto/payments.proto";

const PAYMENT_SERVER_URL = "localhost:3003";

let loaderOptions = {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
}

let paymentPackageDefinition = protoLoader.loadSync(PAYMENT_PROTO, loaderOptions);

const PaymentService = grpc.loadPackageDefinition(paymentPackageDefinition).PaymentService;

server.addService(PaymentService.service, paymentsRpcsImpl)

server.bind(PAYMENT_SERVER_URL, grpc.ServerCredentials.createInsecure());

console.log(`Payments Server running at ${PAYMENT_SERVER_URL}`);

server.start();