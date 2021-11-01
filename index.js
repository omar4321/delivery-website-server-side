const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ksj3s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// console.log(uri);

async function run() {
  try {
    await client.connect();
    console.log('connected to db');
    const database = client.db('pizza');
    const pizzaAddCollection = database.collection('pizzaAdd');
    //get Api
    app.get('/pizzaAdd', async (req, res) => {
      const cursor = pizzaAddCollection.find({});
      const pizzaAdd = await cursor.toArray();
      res.send(pizzaAdd);
    });
    //post api
    app.post('/pizzaAdd', async (req, res) => {
      const pizzaAdd = req.body;
      // console.log('hit the post api', service);
      const result = await pizzaAddCollection.insertOne(pizzaAdd);
      console.log(result);
      res.send('post hitted');
    });
    //get single service
    app.get('/pizzaAdd/:id', async (req, res) => {
      const id = req.params.id;
      // console.log('getting id', id);
      const query = { _id: ObjectId(id) };
      const pizzaAdd = await pizzaAddCollection.findOne(query);

      res.json(pizzaAdd);
    });

    // DELETE API
    app.delete('/pizzaAdd/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await pizzaAddCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('Running Genius Server omar');
});

app.listen(port, () => {
  console.log('running Genius server on port', port);
});
