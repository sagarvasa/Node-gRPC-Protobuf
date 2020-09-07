var grpc = require("grpc");
var grpcClient = require("../grpc_client");
var { orderClient } = grpcClient;

// hard coded payment records
const payments = [
    {
        id: "1",
        transactionId: "txnpaytm1",
        paymentMode: "paytm",
        paymentAmount: 150.00,
        orderId: 1
    },
    {
        id: "2",
        transactionId: "txnphonepe2",
        paymentMode: "phonepe",
        paymentAmount: 180.00,
        orderId: 2
    },
    {
        id: "3",
        transactionId: "",
        paymentMode: "cod",
        paymentAmount: 500.00,
        orderId: 3
    },
    {
        id: "4",
        transactionId: "txnphonepe4",
        paymentMode: "phonepe",
        paymentAmount: 150.00,
        orderId: 4
    }

]

function addPayment(call, callback) {
    let payment = call.request.payment;
    if(!payment || !payment.paymentMode || !payment.paymentAmount || !payment.orderId) {
        return callback({
            code: grpc.status.INVALID_ARGUMENT,
            details: "Improper data"
        })
    }
    let newPaymentId = Number(lastPaymentId()) + 1;
    payment.id = String(newPaymentId);
    if(payment.paymentMode != "cod") {
        payment.transactionId = "txn" + payment.paymentMode + newPaymentId
    }
    payments.push(payment);
    let updateOrderReq = {
        trasactionId: payment.transactionId,
        paymentStatus: "SUCCESS",
        id: payment.orderId,
    }
    orderClient.UpdateOrder({orders: updateOrderReq}, (err, data) => {
        console.log(`Updated Order details for transaction id ${payment.transactionId}`)
    })
    callback(null, {payment: payment})
}

function getPaymentByMode(call, callback) {
    let paymentMode = call.request.paymentMode;
    if(! paymentMode) {
        return callback({
            code: grpc.status.INVALID_ARGUMENT,
            details: "Missing payment mode"
        })
    }
    let filteredPaymentsByMode = payments.filter(payment => {
        return payment.paymentMode.toLowerCase() == paymentMode.toLowerCase()
    })
    callback(null, {payments : filteredPaymentsByMode})
}

function getPaymentByTransactionId(call, callback) {
    let transactionId = call.request.transactionId;
    if(! transactionId) {
        return callback({
            code: grpc.status.INVALID_ARGUMENT,
            details: "Missing transaction id"
        })
    }
    let filteredPaymentsByTID = payments.find(payment => payment.transactionId == transactionId);
    if(! filteredPaymentsByTID) {
        return callback({
            code: grpc.status.NOT_FOUND,
            details: "Transaction id didn't found"
        })
    }
    callback(null, {payment : filteredPaymentsByTID})
}

function lastPaymentId() {
    return payments[payments.length - 1].id
};

module.exports = {
    AddPayment: addPayment,
    GetPaymentByMode: getPaymentByMode,
    GetPaymentByTID: getPaymentByTransactionId
}