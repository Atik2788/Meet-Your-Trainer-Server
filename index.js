const express = require('express')
const app = express()
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
const port = process.env.PORT || 5002;

// middleWare
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8ev4byy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        const servicesCollection = client.db('trainerMongoCrud').collection('services')

        // get data from mongo db.
        app.get('/services', async(req, res)=>{
           const query = {}
           const cursor = servicesCollection.find(query)
           const service = await cursor.toArray()
           res.send(service)
        })


        // get data from mongo db.
        app.get('/serviceslimit', async(req, res)=>{
           const query = {}
           const cursor = servicesCollection.find(query)
           const service = await cursor.limit(3).toArray()
           res.send(service)
        })


        
        // Post data in mongodb
        app.post('/services', async(req, res)=>{
            const services = req.body;
            const result = await servicesCollection.insertOne(services)
            res.send(result)
            console.log(services)
        })
       
     


       
        // post or create (CRUD) ***************** POST, CREATE ************



        // Delete (CRUD) *********** Deete  ***************



    }
    finally{

    }
}
run().catch(err => console.log(err))






app.get('/', (req, res)=>{
    res.send('Hello world')
})
 


app.listen(port, () =>{
    console.log(`app running on port: ${port}`)
})