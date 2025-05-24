const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.port || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mo9z4qj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // await client.connect();
    const roomCollection = client.db("RoommateFinder").collection("room");

    app.get("/roomInfo", async (req, res) => {
      const result = await roomCollection.find().toArray();
      res.send(result);
    });

    app.get("/featuredRoommate", async (req, res) => {
      const query = { available: "yes" };
      const result = await roomCollection.find(query).limit(6).toArray();
      res.send(result);
    });

    app.get("/roomInfo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await roomCollection.findOne(query);
      res.send(result);
    });

    app.get("/myListings/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await roomCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/roomInfo", async (req, res) => {
      const roomDetails = req.body;
      const result = await roomCollection.insertOne(roomDetails);
      res.send(result);
    });

    app.put("/roomInfo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedRoom = req.body;
      const updateDoc = {
        $set: updatedRoom,
      };
      const result = await roomCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    app.patch("/roomInfo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedFields = req.body;
      const updateDoc = {
        $set: updatedFields,
      };
      const result = await roomCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    app.delete("/roomInfo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await roomCollection.deleteOne(query);
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    // console.log("You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Roommate Finder Server");
});
app.listen(port, () => {
  console.log(`Roommate Finder server is running on port ${port}`);
});
