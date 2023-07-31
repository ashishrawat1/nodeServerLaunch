var express = require("express");
var app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
var port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));
let { customersData } = require("./customerData");

app.get("/customers", function (req, res) {
  let arr1 = customersData;
  let gender = req.query.gender;
  let sortBy = req.query.sortBy;
  let payment = req.query.payment;
  let city = req.query.city;

  if (gender) {
    arr1 = arr1.filter((ct) => ct.gender == gender);
  }
  if (payment) {
    arr1 = arr1.filter((ct) => ct.payment == payment);
  }
  if (city) {
    arr1 = arr1.filter((ct) => ct.city == city);
  }
  if (sortBy == "city") {
    arr1.sort((ct1, ct2) => ct1.city.localeCompare(ct2.city));
  }
  if (sortBy == "age") {
    arr1.sort((ct1, ct2) => ct1.age - ct2.age);
  }
  if (sortBy == "payment") {
    arr1.sort((ct1, ct2) => ct1.payment.localeCompare(ct2.payment));
  }
  res.send(arr1);
});
app.get("/customers/:id", function (req, res) {
  let id = req.params.id;
  let index = customersData.findIndex((ct) => ct.id == id);
  if (index >= 0) {
    res.send(customersData[index]);
  } else {
    res.status(404).send("No customer found");
  }
});
app.post("/customers", function (req, res) {
  let body = req.body;
  let id = body.name;
  console.log(body);
  customersData.push({ id, ...body });
  res.send(body);
});
app.put("/customers/:id", function (req, res) {
  let id = req.params.id;
  let body = req.body;
  let index = customersData.findIndex((ct) => ct.id == id);
  if (index >= 0) {
    customersData[index] = body;
    res.send(body);
  } else {
    res.status(404).send("No customer found");
  }
});
app.delete("/customers/:id", function (req, res) {
  let id = req.params.id;
  let index = customersData.findIndex((ct) => ct.id == id);
  if (index >= 0) {
    let deletedCustomner = customersData.splice(index, 1);
    res.send(deletedCustomner);
  } else {
    res.status(404).send("No customer found");
  }
});
