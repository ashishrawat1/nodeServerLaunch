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
const port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));
app.get("/employees", function (req, res) {
  let option = "";
  let optionArr = [];
  let department = req.query.department;
  let designation = req.query.designation;
  let gender = req.query.gender;
  if (department) {
    option = "WHERE department=$1";
    optionArr.push(department);
  }
  if (designation) {
    option = option
      ? `${option} AND designation=$${optionArr.length + 1}`
      : "WHERE designation=$1";
    optionArr.push(designation);
  }
  if (gender) {
    option = option
      ? `${option} AND gender=$${optionArr.length + 1}`
      : "WHERE gender=$1";
    optionArr.push(gender);
  }
  let sql = `SELECT * from employees ${option}`;
  client.query(sql, optionArr, function (err, result) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in fetching Data");
    } else {
      res.send(result.rows);
    }
  });
});

app.get("/employees/:empCode", function (req, res) {
  let empCode = +req.params.empCode;

  let sql = "SELECT * FROM employees WHERE empCode=$1";
  client.query(sql, [empCode], function (err, result) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in fetching Data");
    } else if (result.length == 0) {
      res.status(404).send("No employee found");
    } else {
      res.send(result.rows[0]);
    }
  });
});
app.get("/employees/department/:dept", function (req, res) {
  let dept = req.params.dept;

  let sql = "SELECT * from employees where department=$1";
  client.query(sql, [dept], function (err, result) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in fetching Data");
    } else if (result.length == 0) {
      res.status(404).send("No employee found");
    } else {
      res.send(result.rows);
    }
  });
});
app.get("/employees/designation/:des", function (req, res) {
  let des = req.params.des;

  let sql = "SELECT * from employees where designation=$1";
  client.query(sql, [des], function (err, result) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in fetching Data");
    } else if (result.length == 0) {
      res.status(404).send("No employee found");
    } else {
      res.send(result.rows);
    }
  });
});

app.post("/employees", function (req, res) {
  let body = req.body;

  let sql =
    "INSERT INTO employees(empCode, name, department, designation, salary, gender) VALUES ($1, $2, $3, $4, $5, $6)";
  client.query(
    sql,
    [
      body.empcode,
      body.name,
      body.department,
      body.designation,
      body.salary,
      body.gender,
    ],
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

app.put("/employees/:empCode", function (req, res) {
  let empCode = req.params.empCode;
  let body = req.body;
  let sql =
    "UPDATE employees SET empCode=$1,name=$2, department=$3, designation=$4, salary=$5, gender=$6 WHERE empCode=$7";
  client.query(
    sql,
    [
      body.empcode,
      body.name,
      body.department,
      body.designation,
      body.salary,
      body.gender,
      empCode,
    ],
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

app.delete("/employees/:empCode", function (req, res) {
  let empCode = +req.params.empCode;

  let sql = "DELETE FROM employees WHERE empCode=$1";
  client.query(sql, [empCode], function (err, result) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in deleting Data");
    } else {
      res.send(result);
    }
  });
});

app.get("/resetData", function (req, res) {
  let sql = "TRUNCATE TABLE employees";
  client.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in deleting Data");
    } else {
      let { employeesData } = require("./employeeData");
      let employeesArr = employeesData.map((emp) => [
        emp.empCode,
        emp.name,
        emp.department,
        emp.designation,
        emp.salary,
        emp.gender,
      ]);
      let placeholders = employeesArr
        .map(
          (emp, index) =>
            `($${index * 6 + 1}, $${index * 6 + 2}, $${index * 6 + 3}, $${
              index * 6 + 4
            }, $${index * 6 + 5}, $${index * 6 + 6})`
        )
        .join(", ");
      let values = employeesArr.flat();
      let sql2 = `INSERT INTO employees(empCode, name, department, designation, salary, gender) VALUES ${placeholders}`;
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
