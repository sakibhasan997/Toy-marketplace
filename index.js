const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


// mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7suhtvy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();

    const setToysCollection = client.db('carsDB').collection('allToys');
    const tabToysCollection = client.db('carsDB').collection('tabToy');
    const toysCollection = client.db('carsDB').collection('posted')




    // post toys in database
    app.post('/postToys', async(req, res)=>{
      const body = req.body;
      console.log(body);
      const result = await toysCollection.insertOne(body);
        res.send(result)
    })
    app.get('/toys', async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if(req.query?.email){
        query = {postedBy: req.query.email}
      }
      const result = await toysCollection.find(query).toArray();
      res.send(result);
    })
    
    

    // app.get('/toys', async(req,res)=>{
    //   const result = 
    // })


    // app.get('/')

    // console.log(req.params.text);
    // if(req.params.text == 'truck' || req.params.text == 'regular car'|| req.params.text == 'sports car'){
    //   const result = await setToysCollection.find({sub_category: req.params.text}).toArray();
    //   res.send(result)
    // }
   
    app.get('/tabToys', async (req, res) => {
      const result = await tabToysCollection.find().toArray();
      res.send(result);
    })

  //   app.get('/tabToys/:id', async (req,res)=>{
  //     console.log(req.params.id);
  //     const result = await tabToysCollection.find({_id: req.params.id}).toArray();
  //     res.send(result)
  // })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello Brother I am Running Now You Can Do This')
});


app.listen(port, () => {
  console.log(`server site is running port: ${port}`);
})