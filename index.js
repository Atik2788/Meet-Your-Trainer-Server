const express = require("express");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const jwt = require('jsonwebtoken')
const { query } = require("express");
const port = process.env.PORT || 5002;


// middleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8ev4byy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1,});

function verifyJWT(req, res, next){
    // console.log(req.headers.authorization);
    const authHeader = req.headers.authorization;
    if(!authHeader){
        res.status(401).send({message: 'unauthorized access'})
        }
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
            if(err){
                res.status(401).send({message: 'unauthorized access'})
            }
            req.decoded = decoded;
            next();
        })
}

async function run() {
  try {
    const servicesCollection = client.db("trainerMongoCrud").collection("services");
    const reviewCollection = client.db("trainerMongoCrud").collection("reviews");



    // JWT TOKEN 
    app.post('/jwt', (req, res)=>{
        const user = req.body;
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '7d'})
        res.send({token})
          console.log(user)
      })
  



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




    // get reviews gy using user email
    app.get("/reviews", verifyJWT, async (req, res) => {

        const decoded = req.decoded; 
        console.log('inside orders api', decoded);
        if(decoded.email !== req.query.email){
            res.status(403).send({message: 'unauthorized access'})
        }

      let query = {};
      if(req.query.email){
        query ={
            email: req.query.email
        }
      }
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.sort({createdAt:-1}).toArray();
      res.send(reviews);
    });



    // get reviews gy using service id
    app.get("/reviews2", async (req, res) => {
        // console.log(req.query.serviceId)
      let query = {};

      if(req.query.serviceId){
        query ={
            serviceId: req.query.serviceId
        }
      }
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.sort({createdAt:-1}).toArray();
      res.send(reviews);
    });


    // Post reviews Data in mongodb
    app.post("/reviews", async (req, res) => {
      const review = req.body;

      const result = await reviewCollection.insertOne(review);
      res.send(result);
      console.log("reviews is running", review);
    });


    // edit review PUT
    app.put('/reviews/:id', async(req, res) =>{
        const id = req.params.id;
        const filter = {_id: ObjectId(id)}
        const result = await reviewCollection.updateOne(filter, updatedReview)
        res.send(result);
    });



    // Delete Reviews2 by user(email)
    app.delete('/reviews/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await reviewCollection.deleteOne(query)
        res.send(result)
    })


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
