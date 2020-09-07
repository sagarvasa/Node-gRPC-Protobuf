# Node-gRPC-Protobuf
gRPC with Protobufs Integration for Node.js Microservices

# Project Structure
- api gateway (Single point contact for entire microservice)
    - controller
    - grpc client
    - routes
    - index.js
    - package.json
- customer (Customer service)
    - controller
    - index.js
    - package.json
- orders (Orders service)
    - controller
    - grpc client
    - index.js
    - package.json
- payments (Payments service)
    - controller
    - grpc client
    - index.js
    - package.json
- proto (all proto file goes under proto)

* Internal communication between all the services is through rpc calls. Only APIs of gateway are exposed to outside.
* gateway is also gRPC client for all micro service here (configuration is in grpc_client folder & implementation is in controller folder of gateway). 
* order service also has grpc client folder since it is client for customer service. Same goes for payment service. After successul payment, transaction id & payment status needs to be updated hence payment service also needs to call orders API. (one service can call other service, it has to meet rpc guidlines mentioned in proto file)

# project setup
1. Clone/Fork the Repo in your workspace.
2. run `cd api_gateway` & then install all the dependancy using `npm i`. After successful installation, run server using `node index`
3. run `cd customer` & then install all the dependancy using `npm i`. After successful installation, run server using `node index`
4. run `cd orders` & then install all the dependancy using `npm i`. After successful installation, run server using `node index`
5. run `cd payments` & then install all the dependancy using `npm i`. After successful installation, run server using `node index`
6. Check api_gateway status using Heartbeat API: curl --location --request GET 'http://localhost:3000/ping'

# APIs
1. Get all customers: curl --location --request GET 'http://localhost:3000/api/customers'
2. Add new customer: curl --location --request POST 'http://localhost:3000/api/customers' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Jack",
    "gender": "Male",
    "mobileNo": "8899889988"
}'
3. Update the customer: curl --location --request PUT 'http://localhost:3000/api/customers/4' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Jack",
    "mobileNo": "8899889999"
}'
4. Get customer by id: curl --location --request GET 'http://localhost:3000/api/customers/4'
5. Get customer by gender: curl --location --request GET 'http://localhost:3000/api/customers?gender=Male'

6. Get All Customer Orders : curl --location --request GET 'http://localhost:3000/api/orders/customer/1'
7. Create an order: curl --location --request POST 'http://localhost:3000/api/orders' \
--header 'Content-Type: application/json' \
--data-raw '{
    "amount": 300.00,
    "customerId": 1,
    "tax": 30
}'
8. To check successful order creation, retrieve order by id: curl --location --request GET 'http://localhost:3000/api/orders/5'

9. After successful insertion of order, pay using API: curl --location --request POST 'http://localhost:3000/api/payments' \
--header 'Content-Type: application/json' \
--data-raw '{
    "orderId": 5,
    "paymentMode": "paytm",
    "paymentAmount": 300.00
}'
10. Above API should change payment status of order and update transaction id if applicable. verify again using API: curl --location --request GET 'http://localhost:3000/api/orders/5'
11. Get payments detail using transaction id: curl --location --request GET 'http://localhost:3000/api/payments/txnpaytm1'
12. Get payment details using payment mode: curl --location --request GET 'http://localhost:3000/api/payments/query?paymentMode=paytm'


