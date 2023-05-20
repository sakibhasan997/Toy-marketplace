const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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


    const setToysCollection = client.db('carsDB').collection('allToys');
    const tabToysCollection = client.db('carsDB').collection('tabToy');
    const toysCollection = client.db('carsDB').collection('posted')


    // indexing search
    const indexKeys = { toy_name: 1, sub_category: 1 }; // Replace field1 and field2 with your actual field names
    const indexOptions = { name: "nameCategory" }; // Replace index_name with the desired index name
    const result = await toysCollection.createIndex(indexKeys, indexOptions);
    console.log(result);

    // searching
    app.get('/toySearchByTitle/:text', async (req, res) => {
      const searchText = req.params.text;
      const result = await toysCollection.find({
        $or: [
          { toy_name: { $regex: searchText, $options: 'i' } },
          { sub_category: { $regex: searchText, $options: 'i' } }
        ]
      }).toArray()
      res.send(result)
    })

    // get toy data
    app.get('/tabToys', async (req, res) => {
      const result = await tabToysCollection.find().sort({ category: 1 }).toArray();
      res.send(result);
    })
    // get data
    app.get('/toys', async (req, res) => {
      // console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { postedBy: req.query.email }
      }
      const result = await toysCollection.find(query).sort({ sub_category: 1 }).toArray();
      res.send(result);
    })


    // updated data
    app.get('/toys/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) }
      const result = await toysCollection.findOne(query);
      res.send(result)
    })

    // post toys in database
    app.post('/postToys', async (req, res) => {
      const body = req.body;
      // console.log(body);
      const result = await toysCollection.insertOne(body);
      res.send(result)
    })

    // updated mongodb
    app.put('/updated/:id', async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      const filter = { _id: new ObjectId(id) }
      const updatedDoc = {
        $set: {
          price: body.price,
          available_quantity: body.available_quantity,
          description: body.description,
          sub_category: body.sub_category
        },
      };
      const result = await toysCollection.updateOne(filter, updatedDoc);
      res.send(result)
    })

    // deleted data
    app.delete('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.deleteOne(query);
      res.send(result);
    })











    // Send a ping to confirm a successful connection

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