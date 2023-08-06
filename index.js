const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.watftgx.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const categorysCollection = client.db("news-hub").collection("categorys");
    const newsCollection = client.db("news-hub").collection("all-news")
    const saveNewsCollection = client.db("news-hub").collection("save-news")

    app.get("/category", async (req, res) => {
      const result = await categorysCollection.find().toArray()
      res.send(result)
    })

    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { id: id }
      const result = await categorysCollection.find(query).toArray()
      res.send(result)
    })

    app.get("/news", async (req, res) => {
      const result = await newsCollection.find().toArray()
      res.send(result)
    })

    app.get("/news/:id", async (req, res) => {
      const id = req.params.id;
      if (id == 0) {
        const result = await newsCollection.find().toArray()
        res.send(result)
      }
      else {
        const query = { category_id: id }
        const result = await newsCollection.find(query).toArray()
        res.send(result)
      }
    })

    app.get("/saveNews",async(req,res)=>{
      const email = req.query.email;
      const query = {email:email}
      const result = await saveNewsCollection.find(query).toArray()
      res.send(result)
    })

    app.post("/saveNews", async (req, res) => {
      const data = req.body
      const result = await saveNewsCollection.insertOne(data)
      res.send(result)
    })

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
  res.send('news in runing')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})