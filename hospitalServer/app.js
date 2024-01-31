const { Client } = require("pg");
const express = require("express");

const client = new Client({
  user: "postgres.owpnlsvnbbbswqctzcqk",
  password: "Ashsaclp@890",
  database: "postgres",
  port: 6543,
  host: "aws-0-ap-south-1.pooler.supabase.com",
  ssl: { rejectUnauthorized: false },
});

client.connect(function (err) {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database!");
  }
});

const { Vonage } = require("@vonage/server-sdk");

const vonage = new Vonage({
  apiKey: "e09964ce",
  apiSecret: "PDmyFE4VgHN6zQFD",
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

app.post("/appointments", function (req, res) {
  let body = req.body;
  let sql = `INSERT INTO appointments(patientName, appointmentTime, doctor, department, phoneNumber) VALUES ($1, $2, $3, $4, $5)`;
  client.query(
    sql,
    [
      body.patientName,
      body.appointmentTime,
      body.doctor,
      body.department,
      body.phoneNumber,
    ],
    function (err, result) {
      if (err) {
        console.log(err);
        res.status(404).send("Error in inserting Appointment Data");
      } else {
        res.send(result);

        const from = "Vonage APIs";
        const to = req.body.phoneNumber;
        const text = `Hello ${req.body.patientName}. Your appointment is confirmed.Visit ${req.body.doctor} at ${req.body.department} department`;

        async function sendSMS() {
          await vonage.sms
            .send({ to, from, text })
            .then((resp) => {
              console.log("Message sent successfully");
              console.log(resp);
            })
            .catch((err) => {
              console.log("There was an error sending the messages.");
              console.error(err);
            });
        }

        sendSMS();
      }
    }
  );
});

app.put("/appointments/:id", function (req, res) {
  let appointmentId = req.params.id;
  let body = req.body;

  let sql = `UPDATE appointments 
             SET patientName = $1, appointmentTime = $2, doctor = $3, department = $4, phoneNumber = $5 
             WHERE id = $6`;

  client.query(
    sql,
    [
      body.patientName,
      body.appointmentTime,
      body.doctor,
      body.department,
      body.phoneNumber,
      appointmentId,
    ],
    function (err, result) {
      if (err) {
        console.log(err);
        res.status(404).send("Error in updating Appointment Data");
      } else {
        res.send(result);

        const from = "Vonage APIs";
        const to = req.body.phoneNumber;
        const text = `Hello ${req.body.patientName}. Your appointment has been updated.Visit ${req.body.doctor} at ${req.body.department} department`;

        async function sendSMS() {
          await vonage.sms
            .send({ to, from, text })
            .then((resp) => {
              console.log("Message sent successfully");
              console.log(resp);
            })
            .catch((err) => {
              console.log("There was an error sending the messages.");
              console.error(err);
            });
        }

        sendSMS();
      }
    }
  );
});

app.delete("/delete/:id", function (req, res) {
  let appointmentId = req.params.id;

  let sql = `DELETE FROM appointments WHERE id = $1`;

  client.query(sql, [appointmentId], function (err, result) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in deleting Appointment Data");
    } else {
      res.send(result);
    }
  });
});

app.get("/appointments", function (req, res) {
  let sql = "SELECT * FROM appointments";
  client.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in fetching Appointment Data");
    } else {
      res.send(result.rows);
    }
  });
});

app.get("/appointments/:id", function (req, res) {
  const appointmentId = req.params.id;
  let sql = "SELECT * FROM appointments WHERE id = $1";
  client.query(sql, [appointmentId], function (err, result) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in fetching Appointment Data");
    } else {
      res.send(result.rows[0]);
    }
  });
});
