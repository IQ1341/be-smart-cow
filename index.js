
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import admin from "firebase-admin";
import cors from "cors";

const app = express();

// ======================================================
// MIDDLEWARE
// ======================================================
app.set("strict routing", true);

app.use(cors());

app.use(express.json());

// ======================================================
// FIREBASE INIT
// ======================================================
if (!admin.apps.length) {

  admin.initializeApp({

    credential: admin.credential.cert({

      projectId: process.env.FIREBASE_PROJECT_ID,

      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,

      privateKey: process.env
        .FIREBASE_PRIVATE_KEY
        ?.replace(/\\n/g, "\n")

    }),

    databaseURL:
      "https://smartcollar-60894-default-rtdb.firebaseio.com"

  });

}

const db = admin.database();

// ======================================================
// ROOT
// ======================================================
app.get("/", (req, res) => {

  res.status(200).json({

    success: true,
    message: "Backend Running 🚀"

  });

});

// ======================================================
// FIREBASE TEST
// ======================================================
app.get("/firebase-test", async (req, res) => {

  try {

    const testData = {

      status: "success",
      message: "Firebase Connected",
      timestamp: Date.now()

    };

    await db.ref("test").set(testData);

    console.log("================================");
    console.log("FIREBASE CONNECTED");
    console.log("================================");

    res.status(200).json({

      success: true,
      data: testData

    });

  } catch (error) {

    console.error("================================");
    console.error("FIREBASE ERROR");
    console.error("================================");

    console.error(error);

    res.status(500).json({

      success: false,
      error: error.message

    });

  }

});

// ======================================================
// POST MONITORING
// ======================================================
app.post("/api/monitoring", async (req, res) => {

  try {

    const data = req.body;

    // AUTO TIMESTAMP
    data.timestamp = Date.now();

    console.log("================================");
    console.log("DATA FROM ESP32");
    console.log("================================");

    console.log(data);

    // ======================================================
    // SAVE LATEST
    // ======================================================
    await db.ref("monitoring/latest").set(data);

    // ======================================================
    // SAVE HISTORY
    // ======================================================
    const historyRef = db
      .ref("monitoring/history")
      .push();

    await historyRef.set(data);

    console.log("================================");
    console.log("DATA SAVED");
    console.log("================================");

    res.status(200).json({

      success: true,
      message: "Data saved successfully",
      data

    });

  } catch (error) {

    console.error("================================");
    console.error("SAVE ERROR");
    console.error("================================");

    console.error(error);

    res.status(500).json({

      success: false,
      error: error.message

    });

  }

});

// ======================================================
// GET LATEST MONITORING
// ======================================================
app.get("/api/monitoring", async (req, res) => {

  try {

    const snapshot = await db
      .ref("monitoring/latest")
      .once("value");

    res.status(200).json({

      success: true,
      data: snapshot.val()

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,
      error: error.message

    });

  }

});

// ======================================================
// GET HISTORY
// ======================================================
app.get("/api/history", async (req, res) => {

  try {

    const snapshot = await db
      .ref("monitoring/history")
      .once("value");

    res.status(200).json({

      success: true,
      data: snapshot.val()

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,
      error: error.message

    });

  }

});

// ======================================================
// DELETE HISTORY
// ======================================================
app.delete("/api/history", async (req, res) => {

  try {

    await db.ref("monitoring/history").remove();

    res.status(200).json({

      success: true,
      message: "History deleted"

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,
      error: error.message

    });

  }

});

// ======================================================
// LOCAL SERVER
// ======================================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {

  console.log("================================");
  console.log("SERVER RUNNING 🚀");
  console.log(`PORT : ${PORT}`);
  console.log("================================");

});

export default app;
