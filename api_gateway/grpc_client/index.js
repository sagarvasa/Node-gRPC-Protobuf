var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");

// Proto file path for all services
const CUSTOMER_PROTO = "./../proto/customer.proto";
const ORDER_PROTO = "./../proto/orders.proto";
const PAYMENT_PROTO = "./../proto/payments.proto";

const CUSTOMER_SERVER_URL = "localhost:3001";
const ORDERS_SERVER_URL = "localhost:3002";
const PAYMENTS_SERVER_URL = "localhost:3003";

// configuring gRPC clients. Gateway will call customer, order, payments service hence acting as a client to them
let loaderOptions = {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
}

let customerPackageDefinition = protoLoader.loadSync(CUSTOMER_PROTO, loaderOptions);
let orderPackageDefinition = protoLoader.loadSync(ORDER_PROTO, loaderOptions);
let paymentPackageDefinition = protoLoader.loadSync(PAYMENT_PROTO, loaderOptions);

const CustomerService = grpc.loadPackageDefinition(customerPackageDefinition).CustomerService;
const OrderService = grpc.loadPackageDefinition(orderPackageDefinition).OrdersService;
const PaymentService = grpc.loadPackageDefinition(paymentPackageDefinition).PaymentService;

const customerClient = new CustomerService(
    CUSTOMER_SERVER_URL,
    grpc.credentials.createInsecure()
);

const paymentClient = new PaymentService(
    PAYMENTS_SERVER_URL,
    grpc.credentials.createInsecure()
);

const orderClient = new OrderService(
    ORDERS_SERVER_URL,
    grpc.credentials.createInsecure()
);

module.exports = { customerClient, paymentClient, orderClient };
