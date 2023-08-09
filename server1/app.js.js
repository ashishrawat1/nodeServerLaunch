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
const port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));
let { AData } = require("./Data");
let fs = require("fs");
let fname = "data.json";

app.get("/resetData", function (req, res) {
  let data = JSON.stringify(AData);
  fs.writeFile(fname, data, function (err) {
    if (err) res.status(404).send(err);
    else res.send("Data in file is reset");
  });
});
app.get("/shops", function (req, res) {
  fs.readFile(fname, "utf-8", function (err, data) {
    if (err) res.status(404).send(err);
    else {
      let rData = JSON.parse(data);
      let r1 = rData.shops.map((curr) => ({
        shopid: curr.shopId,
        shopname: curr.name,
        rent: curr.rent,
      }));

      res.send(r1);
    }
  });
});
app.get("/products", function (req, res) {
  fs.readFile(fname, "utf-8", function (err, data) {
    if (err) res.status(404).send(err);
    else {
      let rData = JSON.parse(data);
      let r1 = rData.products.map((curr) => ({
        productid: curr.productId,
        productname: curr.productName,
        category: curr.category,
        description: curr.description,
      }));
      res.send(r1);
    }
  });
});
app.get("/products/:id", function (req, res) {
  let id = +req.params.id;
  fs.readFile(fname, "utf-8", function (err, data) {
    if (err) res.status(404).send(err);
    else {
      let rData = JSON.parse(data);
      let index = rData.products.findIndex((ct) => ct.productId == id);
      if (index >= 0) {
        r1 = {
          productid: rData.products[index].productId,
          productname: rData.products[index].productName,
          category: rData.products[index].category,
          description: rData.products[index].description,
        };
        res.send(r1);
      } else {
        res.status(404).send("Not found");
      }
    }
  });
});
app.get("/purchases", function (req, res) {
  let shop = req.query.shop;
  let product = req.query.product;
  let sort = req.query.sort;
  fs.readFile(fname, "utf-8", function (err, data) {
    if (err) res.status(404).send(err);
    else {
      let rData = JSON.parse(data);
      let { purchases, shops, products } = rData;
      let purchasesArr = [...purchases];
      if (shop) {
        shop = shop.substring(2);

        purchasesArr = purchasesArr.filter((pr) => pr.shopId == shop);
      }
      if (product) {
        let productArr = product.split(",");
        productArr = productArr.map((curr) => curr.substring(2));
        purchasesArr = purchasesArr.filter((pr) =>
          productArr.find((p) => p == pr.productid)
        );
      }
      if (sort == "QtyAsc")
        purchasesArr.sort((p1, p2) => p1.quantity - p2.quantity);
      if (sort == "QtyDesc")
        purchasesArr.sort((p1, p2) => p2.quantity - p1.quantity);
      if (sort == "ValueAsc")
        purchasesArr.sort(
          (p1, p2) => p1.quantity * p1.price - p2.quantity * p2.price
        );
      if (sort == "ValueDesc")
        purchasesArr.sort(
          (p1, p2) => p2.quantity * p2.price - p1.quantity * p1.price
        );
      let r1 = purchasesArr.map((curr) => ({
        purchaseid: curr.purchaseId,
        shopid: curr.shopId,
        productid: curr.productid,
        quantity: curr.quantity,
        price: curr.price,
      }));
      res.send(r1);
    }
  });
});
app.get("/purchases/shops/:id", function (req, res) {
  let id = +req.params.id;
  fs.readFile(fname, "utf-8", function (err, data) {
    if (err) res.status(404).send(err);
    else {
      let rData = JSON.parse(data);
      let { purchases } = rData;
      let p1 = purchases.filter((ct) => ct.shopId == id);

      let p2 = p1.map((curr) => ({
        purchaseid: curr.purchaseId,
        shopid: curr.shopId,
        productid: curr.productid,
        quantity: curr.quantity,
        price: curr.price,
      }));
      res.send(p2);
    }
  });
});
app.get("/purchases/products/:id", function (req, res) {
  let id = req.params.id;
  fs.readFile(fname, "utf-8", function (err, data) {
    if (err) res.status(404).send(err);
    else {
      let rData = JSON.parse(data);
      let { purchases } = rData;
      let p1 = purchases.filter((ct) => ct.productid == id);
      let p2 = p1.map((curr) => ({
        purchaseid: curr.purchaseId,
        shopid: curr.shopId,
        productid: curr.productid,
        quantity: curr.quantity,
        price: curr.price,
      }));
      res.send(p2);
    }
  });
});
app.get("/totalpurchase/shop/:id", function (req, res) {
  let id = +req.params.id;
  fs.readFile(fname, "utf-8", function (err, data) {
    if (err) res.status(404).send(err);
    else {
      let rData = JSON.parse(data);
      let { products, purchases } = rData;

      let p1 = products.map((pr) => {
        let prQ = purchases.reduce(
          (acc, curr) =>
            curr.productid == pr.productId && curr.shopId == id
              ? +curr.quantity + acc
              : acc,
          0
        );
        console.log(prQ);
        let prA = purchases.reduce(
          (acc, curr) =>
            curr.productid == pr.productId && curr.shopId == id
              ? +curr.quantity * +curr.price + acc
              : acc,
          0
        );
        let newJson = {
          productname: pr.productName,
          totalquantity: prQ,
          totalamount: prA,
        };
        return newJson;
      });
      //   console.log(p1);
      res.send(p1);
    }
  });
});
app.get("/totalpurchase/product/:id", function (req, res) {
  let id = +req.params.id;
  fs.readFile(fname, "utf-8", function (err, data) {
    if (err) res.status(404).send(err);
    else {
      let rData = JSON.parse(data);
      let { shops, purchases } = rData;
      let p1 = shops.map((pr) => {
        let prQ = purchases.reduce(
          (acc, curr) =>
            curr.shopId == pr.shopId && curr.productid == id
              ? +curr.quantity + acc
              : acc,
          0
        );
        let prA = purchases.reduce(
          (acc, curr) =>
            curr.shopId == pr.shopId && curr.productid == id
              ? +curr.quantity * +curr.price + acc
              : acc,
          0
        );
        let newJson = {
          shopname: pr.name,
          totalquantity: prQ,
          totalamount: prA,
        };
        return newJson;
      });
      res.send(p1);
    }
  });
});

app.post("/shops", function (req, res) {
  let body = req.body;
  fs.readFile(fname, "utf-8", function (err, data) {
    if (err) res.status(404).send(err);
    else {
      let rData = JSON.parse(data);
      let maxId = rData.shops.reduce((acc, curr) =>
        curr.shopId > acc.shopId ? curr : acc
      ).shopId;
      let b1 = { shopId: +maxId + 1, name: body.shopname, rent: body.rent };
      rData.shops.push(b1);
      let newData = JSON.stringify(rData);
      fs.writeFile(fname, newData, function (err) {
        if (err) res.status(404).send(err);
        else res.send(body);
      });
    }
  });
});
app.post("/products", function (req, res) {
  let body = req.body;
  fs.readFile(fname, "utf-8", function (err, data) {
    if (err) res.status(404).send(err);
    else {
      let rData = JSON.parse(data);
      let maxId = rData.products.reduce((acc, curr) =>
        curr.productId > acc.productId ? curr : acc
      ).productId;
      let b1 = {
        productId: +maxId + 1,
        productName: body.productname,
        category: body.category,
        description: body.description,
      };
      rData.products.push(b1);
      let newData = JSON.stringify(rData);
      fs.writeFile(fname, newData, function (err) {
        if (err) res.status(404).send(err);
        else res.send(body);
      });
    }
  });
});
app.put("/products/:id", function (req, res) {
  let id = +req.params.id;
  let body = req.body;
  fs.readFile(fname, "utf-8", function (err, data) {
    if (err) res.status(404).send(err);
    else {
      let rData = JSON.parse(data);
      let index = rData.products.findIndex((ct) => ct.productId == id);
      if (index >= 0) {
        let b1 = {
          productId: id,
          productName: body.productname,
          category: body.category,
          description: body.description,
        };
        rData.products[index] = b1;
        let newData = JSON.stringify(rData);
        fs.writeFile(fname, newData, function (err) {
          if (err) res.status(404).send(err);
          else res.send(body);
        });
      } else {
        res.status(404).send("Not found");
      }
    }
  });
});
