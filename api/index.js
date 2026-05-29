import express from "express";
import admin from "firebase-admin";
import cors from "cors";


const app = express();

app.set("strict routing", true);
app.use(cors());
app.use(express.json());

if (!admin.apps.length) {

  admin.initializeApp({

    credential: admin.credential.cert({

      projectId: process.env.FIREBASE_PROJECT_ID,

      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,

      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')

    }),

    databaseURL:
      "https://smartcollar-60894-default-rtdb.firebaseio.com"

  });

}

const db = admin.database();


app.get("/", (req, res) => {

  res.status(200).send("Backend Running 🚀");

});


app.get("/firebase-test", async (req, res) => {

  try {

    const testData = {

      status: "success",
      message: "Firebase Connected",
      timestamp: Date.now()

    };

    await db.ref("test").set(testData);

    console.log("FIREBASE CONNECTED");

    res.status(200).json({

      success: true,
      data: testData

    });

  } catch (error) {

    console.error("FIREBASE ERROR:");
    console.error(error);

    res.status(500).json({

      success: false,
      error: error.message

    });

  }

});


app.post("/api/monitoring", async (req, res) => {

  try {

    const data = req.body;

    // AUTO TIMESTAMP
    data.timestamp = Date.now();

    console.log("DATA FROM ESP32:");
    console.log(data);

    // SAVE LATEST
    await db.ref("monitoring/latest").set(data);

    // SAVE HISTORY
    const historyRef = db.ref("monitoring/history").push();

    await historyRef.set(data);

    console.log("DATA SAVED");

    res.status(200).json({

      success: true,
      message: "Data saved successfully",
      data

    });

  } catch (error) {

    console.error("SAVE ERROR:");
    console.error(error);

    res.status(500).json({

      success: false,
      error: error.message

    });

  }

});


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


export default app;