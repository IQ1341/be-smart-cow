import express from "express";
import admin from "firebase-admin";
import fs from "fs";
import cors from "cors";

// ======================================
// EXPRESS
// ======================================
const app = express();

app.use(cors());
app.use(express.json());

// ======================================
// FIREBASE
// ======================================
const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccount.json", "utf8")
);

if (!admin.apps.length) {

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),

    databaseURL:
      "https://smartcollar-60894-default-rtdb.firebaseio.com"
  });
}

const db = admin.database();

// ======================================
// START POSITION
// ======================================
let latitude = -7.676679;

let longitude = 114.034973;

// ======================================
// GPS REALTIME LOOP
// ======================================
setInterval(async () => {

  try {

    // GERAK RANDOM
    latitude +=
      (Math.random() - 0.5) * 0.0001;

    longitude +=
      (Math.random() - 0.5) * 0.0001;

    // UPDATE FIREBASE
    await db.ref(
      "monitoring/latest"
    ).update({

      latitude,

      longitude,

      link_maps:
        `https://www.google.com/maps?q=${latitude},${longitude}`,


      timestamp: Date.now()
    });

  } catch (error) {

    console.error(error);
  }

}, 3000);

// ======================================
// API GPS
// ======================================
app.get("/gps", (req, res) => {

  res.json({
    latitude,
    longitude
  });
});

// ======================================
// START SERVER
// ======================================
const PORT = 4000;

app.listen(PORT, () => {

  console.log(
    `GPS SIMULATOR RUNNING ON PORT ${PORT}`
  );
});