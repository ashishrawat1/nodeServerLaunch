const { Client } = require("pg");
const client = new Client({
  user: "postgres",
  password: "Ashsaclp@890",
  database: "postgres",
  port: 5432,
  host: "db.owpnlsvnbbbswqctzcqk.supabase.co",
  ssl: { rejectUnauthorized: false },
});

client.connect(function (res, err) {
  console.log("Connected !!!");
});

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
app.get("/users", function (req, res, next) {
  const query = `SELECT * FROM users`;
  client.query(query, function (err, result) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(result.rows);
    }
  });
});
app.post("/user", function (req, res) {
  let values = Object.values(req.body); // Assuming the request body contains username and email fields
  console.log(values);
  const query = `
      INSERT INTO users (email,firstname,lastname,age)
      VALUES ($1, $2,$3,$4)
    `;

  client.query(query, values, function (err, result) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(result);
    }
  });
});
app.put("/user/:id", function (req, res, next) {
  const userId = req.params.id;
  const newAge = req.body.age;
  let values = [newAge, userId];
  const query = `
        UPDATE users
        SET age = $1
        WHERE id = $2
      `;

  client.query(query, values, function (err, result) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(result);
    }
  });
});
