const { Client } = require("pg");
const express = require("express");

const client = new Client({
  user: "postgres",
  password: "Ashsaclp@890",
  database: "postgres",
  port: 5432,
  host: "db.owpnlsvnbbbswqctzcqk.supabase.co",
  ssl: { rejectUnauthorized: false },
});

client.connect(function (err) {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database!");
  }
});

const app = express();
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

app.get("/shops", function (req, res) {
  let sql = "SELECT * FROM shops";
  client.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in fetching Data");
    } else {
      res.send(result.rows);
    }
  });
});
app.get("/purchases/shops/:id", function (req, res) {
  let id = req.params.id;
  let sql = "SELECT * FROM purchases WHERE shopId=$1";
  client.query(sql, [id], function (err, result) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in fetching Data");
    } else {
      res.send(result.rows);
    }
  });
});
app.get("/purchases/products/:id", function (req, res) {
  let id = req.params.id;
  let sql = "SELECT * FROM purchases WHERE productId=$1";
  client.query(sql, [id], function (err, result) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in fetching Data");
    } else {
      res.send(result.rows);
    }
  });
});
app.get("/totalpurchase/shop/:id", function (req, res) {
  let id = req.params.id;
  let sql = `SELECT p.productName, 
  COALESCE(SUM(pr.quantity),0) AS totalQuantity,
  COALESCE(SUM(pr.quantity * pr.price),0) AS totalAmount
 FROM
  Purchases pr
 RIGHT JOIN
  Products p ON pr.productid = p.productId
 AND
  pr.shopId = $1 GROUP BY p.productId,p.productName `;
  client.query(sql, [id], function (err, result) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in fetching Data");
    } else {
      res.send(result.rows);
    }
  });
});
app.get("/totalpurchase/product/:id", function (req, res) {
  let id = req.params.id;
  let sql = `SELECT
  s.shopName,
  COALESCE(SUM(pr.quantity),0) AS totalQuantity,
  COALESCE(SUM(pr.quantity * pr.price),0) AS totalAmount
FROM
  Purchases pr
RIGHT JOIN
  Shops s ON pr.shopId = s.shopId
AND
  pr.productid = $1
GROUP BY
  s.shopId, s.shopName `;
  client.query(sql, [id], function (err, result) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in fetching Data");
    } else {
      res.send(result.rows);
    }
  });
});

app.get("/products", function (req, res) {
  let brand = req.params.brand;
  let sql = "SELECT * FROM products";
  client.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in fetching Data");
    } else {
      res.send(result.rows);
    }
  });
});
app.get("/products/:id", function (req, res) {
  let id = req.params.id;
  let sql = "SELECT * FROM products WHERE productid=$1";
  client.query(sql, [id], function (err, result) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in fetching Data");
    } else if (result.rows.length === 0) {
      res.status(404).send("No mobile found");
    } else {
      res.send(result.rows[0]);
    }
  });
});
app.get("/purchases", function (req, res) {
  let shop = req.query.shop;
  let product = req.query.product;
  let sort = req.query.sort;
  let option = "";
  let optionArr = [];
  if (shop) {
    option = option
      ? `${option} AND shopId=$${optionArr.length + 1}`
      : ` WHERE shopId=$${optionArr.length + 1} `;
    optionArr.push(shop);
  }
  if (product) {
    let productArr = product.split(",");
    option = option
      ? `${option} AND productId IN (${productArr
          .map((pr, index) => `$${index + optionArr.length + 1}`)
          .join(", ")}) `
      : ` WHERE productId IN (${productArr
          .map((pr, index) => `$${index + 1}`)
          .join(", ")})`;
    productArr.map((pr) => optionArr.push(pr));
  }

  let sql = `SELECT * FROM purchases ${option}`;
  if (sort == "QtyAsc") sql += " ORDER BY quantity ASC";
  if (sort == "QtyDesc") sql += " ORDER BY quantity DESC";
  if (sort == "ValueAsc") sql += " ORDER BY quantity * price ASC";
  if (sort == "ValueDesc") sql += " ORDER BY quantity * price DESC";
  client.query(sql, optionArr, function (err, result) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in fetching Data");
    } else {
      res.send(result.rows);
    }
  });
});

app.post("/shops", function (req, res) {
  let body = req.body;
  let sql = `INSERT INTO shops(shopname, rent) VALUES ($1, $2)`;
  client.query(sql, [body.shopname, body.rent], function (err, result) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in inserting Data");
    } else {
      res.send(result);
    }
  });
});
app.post("/products", function (req, res) {
  let body = req.body;
  let sql = `INSERT INTO products(productName, category,description) VALUES ($1, $2,$3)`;
  client.query(
    sql,
    [body.productname, body.category, body.description],
    function (err, result) {
      if (err) {
        console.log(err);
        res.status(404).send("Error in inserting Data");
      } else {
        res.send(result);
      }
    }
  );
});
app.post("/purchases", function (req, res) {
  let body = req.body;
  let sql = `INSERT INTO purchases(shopId,productId,quantity,price) VALUES ($1, $2, $3,$4)`;
  client.query(
    sql,
    [body.shopId, body.productId, quantity, price],
    function (err, result) {
      if (err) {
        console.log(err);
        res.status(404).send("Error in inserting Data");
      } else {
        res.send(result);
      }
    }
  );
});

app.put("/products/:id", function (req, res) {
  let id = req.params.id;
  let body = req.body;
  let sql = `UPDATE products SET productname=$1, category=$2, description=$3 WHERE productid=$4`;
  client.query(
    sql,
    [body.productname, body.category, body.description, id],
    function (err, result) {
      if (err) {
        console.log(err);
        res.status(404).send("Error in updating Data");
      } else {
        res.send(result);
      }
    }
  );
});

// ...
