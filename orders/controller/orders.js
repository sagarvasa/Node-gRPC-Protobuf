var grpc = require("grpc");
var grpcClient = require("../grpc_client");
var { customerClient } = grpcClient;

// hard coded orders records
const orders = [
    {
        id: 1,
        amount: 150.00,
        trasactionId: "txn01",
        customerId: 1,
        tax: 30.0,
        paymentStatus: "SUCCESS"
    },
    {
        id: 2,
        amount: 180.00,
        trasactionId: "txn02",
        customerId: 1,
        tax: 40.0,
        paymentStatus: "SUCCESS"
    },
    {
        id: 3,
        amount: 500.00,
        trasactionId: "",
        customerId: 3,
        tax: 130.0,
        paymentStatus: "SUCCESS"
    },
    {
        id: 4,
        amount: 150.00,
        trasactionId: "txn04",
        customerId: 2,
        tax: 30.0,
        paymentStatus: "FAILURE"
    },

]

function InsertOrder(call, callback) {

    let newOrder = call.request.orders;
    if (!newOrder || !newOrder.amount || !newOrder.customerId) {
        return callback({
            code: grpc.status.INVALID_ARGUMENT,
            details: "Improper details"
        })
    }
    let newOrderId = lastOrderId() + 1;
    newOrder.id = newOrderId;
    newOrder.paymentStatus = "PENDING";
    orders.push(newOrder)
    callback(null, { statusCode: 201, message: "Order Created Successfully", id: newOrderId })
}

function UpdateOrder(call, callback) {
    let existingOrder = orders.find(order => order.id == call.request.orders.id);
    if (!existingOrder) {
        return callback({
            code: grpc.status.NOT_FOUND,
            details: "Invalid Order Id"
        })
    } else {
        let { trasactionId, paymentStatus } = call.request.orders;
        existingOrder.trasactionId = trasactionId;
        existingOrder.paymentStatus = paymentStatus;
        callback(null, { orders: existingOrder })
    }
}

function GetCustomerOrder(call, callback) {
    let custId = call.request.customerId;
    if (!custId) {
        return callback({
            code: grpc.status.INVALID_ARGUMENT,
            details: "Missing order's customer id"
        })
    }
    let filterOrders = orders.filter(order => order.customerId === custId);

    getCustomerDetails(filterOrders[0].customerId, (err, data) => {
        if (!err) {
            filterOrders.forEach((order) => {
                order.customer = data.customer
            })
        }
        callback(null, { orders: filterOrders })
    })

}

function GetOrder(call, callback) {
    let id = call.request.id;
    if (!id) {
        return callback({
            code: grpc.status.INVALID_ARGUMENT,
            details: "Missing order id"
        })
    }
    let order = orders.find(order => order.id === id);
    callback(null, { orders: order })
}

function lastOrderId() {
    return orders[orders.length - 1].id
};

function getCustomerDetails(custId, callback) {
    customerClient.GetCustomer({ id: parseInt(custId) }, (err, data) => {
        if (err) {
            console.log("get customer by id : ", err)
            callback(err)
        }
        callback(null, data)
    })
}

module.exports = {
    InsertOrder,
    UpdateOrder,
    GetCustomerOrder,
    GetOrder
}
