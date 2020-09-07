const grpcClient = require("../grpc_client");
const { orderClient } = grpcClient;

const getOrder = (req, res) => { 
    try {
        console.log("get order request params ", req.params);
        let orderId = req.params.id;

        if(!orderId) {
            return res.status(400).send({message: "Please pass valid params"})
        }
        orderClient.GetOrder({id: orderId}, (err, data) => {
            if (err) {
                console.log("get order by id : ", err)
                return res.status(500).send({ details: err.details, grpcCode: err.code, message: err.message })
            }
            return res.status(200).jsonp(data)
        })
    } catch(err) {
        console.log("get order: ", err);
        return res.status(500).send({ message: err.message })
    }
}

const insertOrder = (req, res) => {
    try {
        console.log("insert order request body ", req.body);

        let { amount, customerId, tax } = req.body;
        let newOrder = {
            amount,
            customerId,
            tax,
        };

        let orderReq = {
            orders: newOrder
        }
        // Input to InsertOrder should be in same format as specified in proto
        orderClient.InsertOrder(orderReq, (err, data) => {
            // data is of format specified in proto & err details are of grpc error standards
            if (err) {
                console.error("insert order ", err)
                return res.status(500).send({ message: err.message, grpcCode: err.code, details: err.details })
            }
            res.status(200).send(data)
        })
    } catch (err) {
        console.log("insert order: ", err);
        return res.status(500).send({ message: err.message })
    }
}

const getCustomerOrder = (req, res) => {
    try {
        console.log("get customer order request params ", req.params);
        let customerId = req.params.id;

        if(!customerId) {
            return res.status(400).send({message: "Please pass valid params"})
        }
        orderClient.GetCustomerOrder({customerId: customerId}, (err, data) => {
            if (err) {
                console.log("get order by customer id : ", err)
                return res.status(500).send({ details: err.details, grpcCode: err.code, message: err.message })
            }
            return res.status(200).jsonp(data)
        })
    } catch(err) {
        console.log("get customer order: ", err);
        return res.status(500).send({ message: err.message })
    }
}

module.exports = {
    getCustomerOrder,
    getOrder,
    insertOrder
}