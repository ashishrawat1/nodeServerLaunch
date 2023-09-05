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
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

const port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

app.post("/api/callApi", async (req, res) => {
  const { method, fetchURL, data } = req.body;

  let token = req.header("authorization");
  console.log(token);
  try {
    let response;
    if (method === "GET") {
      response = await axios.get(fetchURL, {
        headers: { authorization: token },
      });
    } else if (method === "POST") {
      response = await axios.post(fetchURL, JSON.parse(data), {
        headers: { authorization: token },
      });
    } else if (method === "PUT") {
      response = await axios.put(fetchURL, JSON.parse(data), {
        headers: { authorization: token },
      });
    } else if (method === "DELETE") {
      response = await axios.delete(fetchURL, {
        headers: { authorization: token },
      });
    } else {
      return res.status(401).json({ error: "Invalid method" });
    }

    res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response) {
      let { status, statusText } = err.response;
      res.status(status).send(err);
    } else res.status(404).send(err);
  }
});
