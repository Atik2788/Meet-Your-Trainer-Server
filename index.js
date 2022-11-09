const express = require("express");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const { query } = require("express");
const port = process.env.PORT || 5002;

// middleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8ev4byy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const servicesCollection = client
      .db("trainerMongoCrud")
      .collection("services");
    const reviewCollection = client
      .db("trainerMongoCrud")
      .collection("reviews");

    // get data from mongo db.
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const service = await cursor.toArray();
      res.send(service);
    });

    // get data from mongo db by limit.
    app.get("/serviceslimit", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const service = await cursor.limit(3).toArray();
      res.send(service);
    });

    // get data by id
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.send(service);
    });

    // Post services data in mongodb
    app.post("/services", async (req, res) => {
      const services = req.body;
      const result = await servicesCollection.insertOne(services);
      res.send(result);
      console.log(services);
    });




    // get reviews
    app.get("/reviews", async (req, res) => {
        // console.log(req.query.serviceId)
      let query = {};
      if(req.query.serviceId){
        query ={
            serviceId: req.query.serviceId
        }
      }
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    



    // Post reviews Data in mongodb
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      console.log(review);
      const result = await reviewCollection.insertOne(review);
      res.send(result);
      console.log("reviews is running", review);
    });

  } finally {
  }
}


run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log(`app running on port: ${port}`);
});
