const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const admin = require("firebase-admin");
const serviceAccount = require("./firebase-service-key.json");
require("dotenv").config();
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
/* -----------Firebase Token verify---------------- */
const verifyToken = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    res.status(401).send({
      message: "Unauthorized access. Token not found",
    });
  }
  const token = authorization.split(" ")[1];
  try {
    const decoderUser = await admin.auth().verifyIdToken(token);
    req.user = decoderUser;
    next();
  } catch {
    res.status(401).send({
      message: "Unauthorized access.",
    });
  }
};

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.jdeeqhi.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("FinEase");
    const transactionCollection = db.collection("transactions");
    /* Add new transaction  */
    app.post("/transactions", verifyToken, async (req, res) => {
      const newTransaction = req.body;
      if (req.user.email !== newTransaction.email) {
        return res.status(403).send({ message: "Forbidden: Email mismatch." });
      }
      const result = await transactionCollection.insertOne(newTransaction);
      res.send(result);
    });
    /* get Transaction by user email   */
    app.get("/my-transactions", verifyToken, async (req, res) => {
      const email = req.query.email;
      if (req.user.email !== email) {
        return res.status(403).send({
          message: "Forbidden access",
        });
      }
      const result = await transactionCollection
        .find({
          email,
        })
        .toArray();
      res.send(result);
    });
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running Fine.");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
