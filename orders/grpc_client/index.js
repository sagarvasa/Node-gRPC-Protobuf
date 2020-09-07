var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");

// Proto file path for all services
const CUSTOMER_PROTO = "./../proto/customer.proto";

const CUSTOMER_SERVER_URL = "localhost:3001";

let loaderOptions = {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
}

let customerPackageDefinition = protoLoader.loadSync(CUSTOMER_PROTO, loaderOptions);

const CustomerService = grpc.loadPackageDefinition(customerPackageDefinition).CustomerService;

const customerClient = new CustomerService(
    CUSTOMER_SERVER_URL,
    grpc.credentials.createInsecure()
);

module.exports = { customerClient };
