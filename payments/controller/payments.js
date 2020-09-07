var grpc = require("grpc");

// hard coded payment records
const payments = [
    {
        id: "1",
        transactionId: "txn01",
        paymentMode: "paytm",
        paymentAmount: 150.00,
        orderId: 1
    },
    {
        id: "2",
        transactionId: "txn02",
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
        transactionId: "txn04",
        paymentMode: "phonepe",
        paymentAmount: 150.00,
        orderId: 4
    }

]

function addPayment(call, callback) {
    let payment = call.request.payment;
    if(!payment || !payment.paymentMode || !payment.paymentAmount) {
        return callback({
            code: grpc.status.INVALID_ARGUMENT,
            details: "Improper data"
        })
    }
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
    let filteredPaymentsByTID = payments.find(payment => payment.transactionId == transactionId)
    callback(null, {payment : filteredPaymentsByTID})
}

module.exports = {
    AddPayment: addPayment,
    GetPaymentByMode: getPaymentByMode,
    GetPaymentByTID: getPaymentByTransactionId
}