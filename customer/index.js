var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");
var customerRpcsImpl = require("./controller/customer");

const server = new grpc.Server();

// Proto file path for all services
const CUSTOMER_PROTO = "../proto/customer.proto";

const CUSTOMER_SERVER_URL = "localhost:3001";

// configuring and starting customer gRPC server
let loaderOptions = {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
}

let customerPackageDefinition = protoLoader.loadSync(CUSTOMER_PROTO, loaderOptions);

const CustomerService = grpc.loadPackageDefinition(customerPackageDefinition).CustomerService;

// all methods defined in proto should be implemented in customerRpcsImpl
server.addService(CustomerService.service, customerRpcsImpl)

server.bind(CUSTOMER_SERVER_URL, grpc.ServerCredentials.createInsecure());

console.log(`Customer Server running at ${CUSTOMER_SERVER_URL}`);

server.start();