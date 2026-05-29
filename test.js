import express from "express";

const app = express();

app.use(express.json());

// ======================================
// GET
// ======================================
app.get("/", (req, res) => {

  res.status(200).json({
    success: true,
    message: "SERVER ACTIVE"
  });
});

// ======================================
// GET SENSOR
// ======================================
app.get("/sensor", (req, res) => {

  res.status(200).json({
    success: true,
    message: "GET SENSOR SUCCESS"
  });
});

// ======================================
// POST SENSOR
// ======================================
app.post("/sensor", (req, res) => {

  console.log("================================");
  console.log("DATA RECEIVED");
  console.log("================================");

  console.log(req.body);

  res.status(200).json({
    success: true,
    message: "DATA RECEIVED",
    data: req.body
  });
});

// ======================================
// SERVER
// ======================================
app.listen(3000, "0.0.0.0", () => {

  console.log("================================");
  console.log("SERVER RUNNING");
  console.log("PORT : 3000");
  console.log("================================");
});