const grpcClient = require("../grpc_client");
const { paymentClient } = grpcClient

const getPaymentByTransactionId = (req, res) => {
    try {
        console.log("get payment request params ", req.params);
        let transactionId = req.params.tid;
        if (!transactionId) {
            return res.status(400).send({ message: "Please pass valid params" })
        }
        // Input to GetPaymentByTID should be in same format as specified in proto
        paymentClient.GetPaymentByTID({transactionId: transactionId}, (err, data) => {
            if (err) {
                console.log("get payment by transaction id : ", err)
                return res.status(500).send({ details: err.details, grpcCode: err.code, message: err.message })
            }
            return res.status(200).jsonp(data)
        })
    } catch (err) {
        console.log("get payment by transaction id ", err);
        return res.status(500).send({ message: err.message })
    }
}

const getPaymentByMode = (req, res) => {
    try {
        console.log("get payment by mode request query ", req.query);
        if (! req.query.paymentMode) {
            return res.status(400).send({message: "Missing query parameters"})
        }
        paymentClient.GetPaymentByMode({paymentMode: req.query.paymentMode}, (err, data) => {
            if (err) {
                console.log("get payment by payment mode : ", err)
                return res.status(500).send({ details: err.details, grpcCode: err.code, message: err.message })
            }
            return res.status(200).jsonp(data)
        })

    } catch (err) {
        console.error("get payment by mode ", err);
        return res.status(500).send({ message: err.message })
    }
}

module.exports = {
    getPaymentByTransactionId,
    getPaymentByMode
}