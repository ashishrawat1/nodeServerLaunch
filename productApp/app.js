const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

// CORS middleware to allow requests from any origin
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, authorization"
  );
  next();
});

let { data } = require("./data");
let orders = [];
app.get("/products/:category?", (req, res) => {
  const { category } = req.params;

  if (category) {
    const filteredProducts = data.filter(
      (product) => product.category === category
    );
    res.json(filteredProducts);
  } else {
    res.json(data);
  }
});

app.post("/login", function (req, res) {
  if (req.body.email == "email@test.com" && req.body.password == "email")
    res.send({ email: "email@test.com", password: "email" });
  else {
    res.status(401).send("Login Failed!!");
  }
});

app.get("/product/:id?", (req, res) => {
  const { id } = req.params;

  const product = data.find((p) => p.id == id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

app.post("/products", (req, res) => {
  const newProduct = req.body;
  const newId = data.length + 1;
  newProduct.id = newId;
  console.log(newProduct);
  data.push(newProduct);

  res.status(201).json(newProduct);
});

app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const updatedProduct = req.body;
  const index = data.findIndex((p) => p.id == id);

  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  data[index] = { ...data[index], ...updatedProduct };

  res.json(data[index]);
});

app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  const index = data.findIndex((p) => p.id == id);

  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const deletedProduct = data.splice(index, 1)[0];
  console.log(deletedProduct);
  res.json(deletedProduct);
});

app.get("/orders", (req, res) => {
  console.log(orders);
  res.json(orders);
});

app.post("/orders", (req, res) => {
  const newOrder = req.body;
  console.log(newOrder);
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// Your existing login and register routes go here

const port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));
