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
let { carMasterData, carsData } = require("./carData");

app.get("/cars", function (req, res) {
  let arr1 = carsData;
  let arr2 = carMasterData;
  let minprice = req.query.minprice;
  let maxprice = req.query.maxprice;
  let fuel = req.query.fuel;
  let type = req.query.type;
  let sort = req.query.sort;
  if (fuel) {
    arr1 = arr1.filter(
      (car) => arr2.find((curr) => curr.model == car.model).fuel == fuel
    );
  }

  if (type) {
    arr1 = arr1.filter(
      (car) => arr2.find((curr) => curr.model == car.model).type == type
    );
  }
  if (minprice) {
    arr1 = arr1.filter((curr) => curr.price > +minprice);
  }
  if (maxprice) {
    arr1 = arr1.filter((curr) => curr.price < +maxprice);
  }
  if (sort == "kms") {
    arr1.sort((car1, car2) => +car1.kms - +car2.kms);
  }
  if (sort == "price") {
    arr1.sort((car1, car2) => +car1.price - +car2.price);
  }
  if (sort == "year") {
    arr1.sort((car1, car2) => +car1.year - +car2.year);
  }
  res.send(arr1);
});
app.get("/carmaster", function (req, res) {
  res.send(carMasterData);
});
app.get("/cars/:id", function (req, res) {
  let id = req.params.id;
  let index = carsData.findIndex((car) => car.id == id);
  if (index >= 0) {
    res.send(carsData[index]);
  } else {
    res.status(404).send("No car found");
  }
});
app.post("/cars", function (req, res) {
  let body = req.body;
  console.log(body);
  carsData.push(body);
  res.send(body);
});
app.put("/cars/:id", function (req, res) {
  let id = req.params.id;
  let body = req.body;
  let index = carsData.findIndex((car) => car.id == id);
  if (index >= 0) {
    carsData[index] = body;
    res.send(body);
  } else {
    res.status(404).send("No car found");
  }
});
app.delete("/cars/:id", function (req, res) {
  let id = req.params.id;
  let index = carsData.findIndex((car) => car.id == id);
  if (index >= 0) {
    let deleteCar = carsData.splice(index, 1);
    res.send(deleteCar);
  } else {
    res.status(404).send("No car found");
  }
});
