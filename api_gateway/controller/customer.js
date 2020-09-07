const grpcClient = require("../grpc_client");
const { customerClient } = grpcClient

const getCustomerByQuery = (req, res) => {
    try {
        console.log("get customer request query ", req.query);
        let query = {};
        let isQueryByGender = false;
        // Query has gender, filter customers only by gender
        if (req.query.gender) {
            query.gender = req.query.gender;
            isQueryByGender = true;
        }

        switch (isQueryByGender) {
            case true:
                customerClient.GetCustomerByGender(query, (err, data) => {
                    // data is of format specified in proto & err details are of grpc error standards
                    if (err) {
                        return res.status(500).send({ message: err.message, grpcCode: err.code, details: err.details })
                    }
                    return res.status(200).jsonp(data)
                })
                break;
            case false:
            default:
                customerClient.GetAllCustomer(query, (err, data) => {
                    // data is of format specified in proto & err details are of grpc error standards
                    if (err) {
                        return res.status(500).send({ message: err.message, grpcCode: err.code, details: err.details })
                    }
                    return res.status(200).jsonp(data)
                })
        }
    } catch (err) {
        console.error("get customer ", err);
        return res.status(500).send({ message: err.message })
    }
}

const addCustomer = (req, res) => {
    console.log("add customer request body ", req.body);

    let { name, gender, mobileNo } = req.body;
    let newCustomer = {
        name,
        gender,
        mobileNo,
        isActive: true, // making by default active customer
    };

    // Input to AddCustomer should be in same format as specified in proto
    customerClient.AddCustomer(newCustomer, (err, data) => {
        // data is of format specified in proto & err details are of grpc error standards
        if (err) {
            console.error("add customer ", err)
            return res.status(500).send({ message: err.message, grpcCode: err.code, details: err.details })
        }
        res.status(200).send(data)
    })
};

const GetCustomerById = (req, res) => {
    try {
        console.log("get customer request params ", req.params);
        let customerId = req.params.id;
        if (!customerId) {
            return res.status(400).send({ message: "Please pass valid params" })
        }
        let custReq = {
            id: parseInt(customerId)
        }
        // Input to GetCustomer should be in same format as specified in proto
        customerClient.GetCustomer(custReq, (err, data) => {
            if (err) {
                console.log("get customer by id : ", err)
                return res.status(500).send({ details: err.details, grpcCode: err.code, message: err.message })
            }
            return res.status(200).jsonp(data)
        })
    } catch (err) {
        console.log("get customer by id ", err);
        return res.status(500).send({ message: err.message })
    }
};

const updateCustomer = (req, res) => {
    try {
        console.log("update customer request body ", req.body);
        let id = req.params.id;
        let { name, mobileNo } = req.body;
        let updateCustomer = {
            id,
            name,
            mobileNo
        };
        // Input to updateCustomer should be in same format as specified in proto
        customerClient.updateCustomer(updateCustomer, (err, data) => {
            if (err) {
                return res.status(500).send({ message: err.message, grpcCode: err.code, details: err.details })
            }
            return res.status(200).jsonp(data)
        })

    } catch (err) {
        console.error("update customer ", err);
        return res.status(500).send({ message: err.message })
    }
};

module.exports = {
    addCustomer,
    getCustomerByQuery,
    updateCustomer,
    GetCustomerById
}