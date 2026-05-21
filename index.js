import express from "express";
import admin from "firebase-admin";
import cors from "cors";
import fs from "fs";

// INIT EXPRESS
const app = express();

app.use(cors());
app.use(express.json());

// FIREBASE SERVICE ACCOUNT
const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccount.json", "utf8")
);


// FIREBASE INIT
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),

  // TANPA "/" DI BELAKANG
  databaseURL:
    "https://smartcollar-60894-default-rtdb.firebaseio.com"
});

const db = admin.database();


// DEBUG PROJECT
console.log("FIREBASE PROJECT:");
console.log(serviceAccount.project_id);


// ROOT
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// FIREBASE TEST
app.get("/firebase-test", async (req, res) => {

  try {

    const testData = {
      status: "success",
      message: "Firebase Connected",
      timestamp: Date.now()
    };

    await db.ref("test").set(testData);

  
    console.log("FIREBASE TEST SUCCESS");
    console.log(testData);

    res.json({
      success: true,
      data: testData
    });

  } catch (error) {

    console.error("FIREBASE TEST FAILED");
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


// API FROM ESP32
app.post("/api/monitoring", async (req, res) => {

  try {

    const data = req.body;

    // AUTO TIMESTAMP
    data.timestamp = Date.now();

    console.log("DATA FROM ESP32:");
    console.log(data);

    // SAVE TO FIREBASE
    await db.ref("monitoring/latest").set(data);

    console.log("SEND TO FIREBASE SUCCESS");

    res.json({
      success: true,
      message: "Data saved successfully",
      data
    });

  } catch (error) {

    console.error("SEND TO FIREBASE FAILED");
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// SERVER START
const PORT = 3000;

app.listen(PORT, () => {

  console.log("");
  console.log(`BACKEND RUNNING ON PORT ${PORT}`);
  console.log("");
});