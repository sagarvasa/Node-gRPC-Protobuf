var grpc = require("grpc");

// hard coded customer records
const customers = [
    {
        id: 1,
        name: "Joe",
        gender: "Male",
        mobileNo: "9999999999",
        isActive: true
    },
    {
        id: 2,
        name: "Jim",
        gender: "Male",
        mobileNo: "9999999988",
        isActive: true
    },
    {
        id: 3,
        name: "Jeel",
        gender: "Female",
        mobileNo: "8899999988",
        isActive: true
    }
]

// Based on id, return a customer record. req/res format should be same as specified in proto
function GetCustomer(call, callback) {
    let cust = customers.find(cust => cust.id == call.request.id);
    if (!cust) {
        return callback({
            code: grpc.status.NOT_FOUND,
            details: "No Customer Found",
        })
    }
    callback(null, { customer: cust })
}

// Add new customer in hard coded list. req/res format should be same as specified in proto
function addCust(call, callback) {
    let newCustomer = call.request;
    if (!newCustomer || !newCustomer.name) {
        return callback({
            code: grpc.status.INVALID_ARGUMENT,
            details: "Improper details"
        })
    }
    let newCustomerId = customers[customers.length - 1].id + 1;
    newCustomer.id = newCustomerId
    customers.push(newCustomer)
    callback(null, { customer: newCustomer })
}

// update existing customer from hard coded list. req/res format should be same as specified in proto
function updateCustomer(call, callback) {
    let existingCust = customers.find(cust => cust.id == call.request.id);
    if (!existingCust) {
        return callback({
            code: grpc.status.NOT_FOUND,
            details: "Invalid Id"
        })
    } else {
        let { name, mobileNo } = call.request;
        existingCust.name = name;
        existingCust.mobileNo = mobileNo;
        callback(null, { customer: existingCust })
    }
}

// get list of customer of specified gender. req/res format should be same as specified in proto
function GetCustomerByGender(call, callback) {
    let filterByGenderCustomers = customers.filter(cust => cust.gender == call.request.gender);
    callback(null, { customers: filterByGenderCustomers })
}

// get all customers. req/res format should be same as specified in proto
function GetAllCustomer(call, callback) {
    return callback(null, { customers: customers })
}

// all exported functions should follow rpc service name
module.exports = {
    GetCustomer,
    AddCustomer: addCust,
    updateCustomer,
    GetCustomerByGender,
    GetAllCustomer
}