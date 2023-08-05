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

app.get("/mobiles", function (req, res) {
  let RAM = req.query.RAM;
  let ROM = req.query.ROM;
  let OS = req.query.OS;
  let brand = req.query.brand;
  let option = "";
  let optionArr = [];
  if (brand) {
    let brandArr = brand.split(",");
    option = option
      ? `${option} AND brand IN (${brandArr
          .map((brand, index) => `$${index + optionArr.length + 1}`)
          .join(", ")})`
      : `WHERE brand IN (${brandArr
          .map((br, index) => `$${index + 1}`)
          .join(", ")})`;
    brandArr.map((brand) => optionArr.push(brand));
  }
  if (RAM) {
    let RAMArr = RAM.split(",");
    option = option
      ? `${option} AND "RAM" IN (${RAMArr.map(
          (ram, index) => `$${index + optionArr.length + 1}`
        ).join(", ")})`
      : `WHERE "RAM" IN (${RAMArr.map((ram, index) => `$${index + 1}`).join(
          ", "
        )})`;
    RAMArr.map((ram) => optionArr.push(ram));
  }
  if (ROM) {
    let ROMArr = ROM.split(",");
    option = option
      ? `${option} AND "ROM" IN (${ROMArr.map(
          (rom, index) => `$${index + optionArr.length + 1}`
        ).join(", ")})`
      : `WHERE "ROM" IN (${ROMArr.map((rom, index) => `$${index + 1}`).join(
          ", "
        )})`;
    ROMArr.map((rom) => optionArr.push(rom));
  }
  if (OS) {
    let OSArr = OS.split(",");
    option = option
      ? `${option} AND "OS" IN (${OSArr.map(
          (os, index) => `$${index + optionArr.length + 1}`
        ).join(", ")})`
      : `WHERE "OS" IN (${OSArr.map((os, index) => `$${index + 1}`).join(
          ", "
        )})`;
    OSArr.map((os) => optionArr.push(os));
  }
  let sql = `SELECT * FROM mobiles ${option} `;
  client.query(sql, optionArr, function (err, result) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in fetching Data");
    } else {
      res.send(result.rows);
    }
  });
});

app.get("/mobiles/:id", function (req, res) {
  let id = +req.params.id;
  let sql = "SELECT * FROM mobiles WHERE id=$1";
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
app.get("/mobiles/brand/:brand", function (req, res) {
  let brand = req.params.brand;
  let sql = "SELECT * FROM mobiles WHERE brand=$1";
  client.query(sql, [brand], function (err, result) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in fetching Data");
    } else if (result.rows.length === 0) {
      res.status(404).send("No mobile found");
    } else {
      res.send(result.rows);
    }
  });
});
app.get("/mobiles/RAM/:RAM", function (req, res) {
  let RAM = req.params.RAM;
  let sql = `SELECT * FROM mobiles WHERE "RAM"=$1`;
  client.query(sql, [RAM], function (err, result) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in fetching Data");
    } else if (result.rows.length === 0) {
      res.status(404).send("No mobile found");
    } else {
      res.send(result.rows);
    }
  });
});
app.get("/mobiles/ROM/:ROM", function (req, res) {
  let ROM = req.params.ROM;
  let sql = `SELECT * FROM mobiles WHERE "ROM"=$1`;
  client.query(sql, [ROM], function (err, result) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in fetching Data");
    } else if (result.rows.length === 0) {
      res.status(404).send("No mobile found");
    } else {
      res.send(result.rows);
    }
  });
});
app.get("/mobiles/OS/:OS", function (req, res) {
  let OS = req.params.OS;
  let sql = `SELECT * FROM mobiles WHERE "OS"=$1`;
  client.query(sql, [OS], function (err, result) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in fetching Data");
    } else if (result.rows.length === 0) {
      res.status(404).send("No mobile found");
    } else {
      res.send(result.rows);
    }
  });
});

app.post("/mobiles", function (req, res) {
  let body = req.body;
  let sql = `INSERT INTO mobiles(name, price, brand, "RAM", "ROM", "OS") VALUES ($1, $2, $3, $4, $5, $6)`;
  client.query(
    sql,
    [body.name, body.price, body.brand, body.RAM, body.ROM, body.OS],
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

app.put("/mobiles/:id", function (req, res) {
  let id = req.params.id;
  let body = req.body;
  let sql = `UPDATE mobiles SET name=$1, price=$2, brand=$3, "RAM"=$4, "ROM"=$5, "OS"=$6 WHERE id=$7`;
  client.query(
    sql,
    [body.name, body.price, body.brand, body.RAM, body.ROM, body.OS, id],
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

app.delete("/mobiles/:id", function (req, res) {
  let id = +req.params.id;
  let sql = "DELETE FROM mobiles WHERE id=$1";
  client.query(sql, [id], function (err, result) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in deleting Data");
    } else {
      res.send(result);
    }
  });
});

app.get("/resetMobileData", function (req, res) {
  let sql = "TRUNCATE TABLE mobiles RESTART IDENTITY";
  client.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in deleting Data");
    } else {
      let { mobilesData } = require("./mobilesData");
      let mobilesArr = mobilesData.map((mobile) => [
        mobile.name,
        mobile.price,
        mobile.brand,
        mobile.RAM,
        mobile.ROM,
        mobile.OS,
      ]);
      let placeholders = mobilesArr
        .map(
          (mobile, index) =>
            `($${index * 6 + 1}, $${index * 6 + 2}, $${index * 6 + 3}, $${
              index * 6 + 4
            }, $${index * 6 + 5}, $${index * 6 + 6})`
        )
        .join(", ");
      let values = mobilesArr.flat();
      let sql2 =
        `INSERT INTO mobiles(name, price, brand, "RAM", "ROM", "OS") VALUES ` +
        placeholders;
      client.query(sql2, values, function (err, result) {
        if (err) {
          console.log(err);
          res.status(404).send("Error in inserting Data");
        } else {
          res.send(result);
        }
      });
    }
  });
});
