const customerController = require("../controller/customer");
const orderController = require("../controller/order");
const paymentController = require("../controller/payment");

const router = (app) => {

    app.route("/ping")
        .get((req, res) => {
            res.status(200).send({ message: "Server is up and running" })
        })
    
    app.route("/api/customers")
        .post(customerController.addCustomer)
        .get(customerController.getCustomerByQuery)

    app.route("/api/customers/:id")
        .put(customerController.updateCustomer)
        .get(customerController.GetCustomerById)
    
    app.route("/api/orders")
        .post(orderController.insertOrder)

    app.route("/api/orders/customer/:id")
        .get(orderController.getCustomerOrder)

    app.route("/api/orders/:id")
        .get(orderController.getOrder)
    
    app.route("/api/payments")
        .post(paymentController.addPayment)

    app.route("/api/payments/query")
        .get(paymentController.getPaymentByMode)

    app.route("/api/payments/:tid")
        .get(paymentController.getPaymentByTransactionId)

}


module.exports = router;