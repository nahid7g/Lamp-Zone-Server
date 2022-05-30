const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion,ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Use Express
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.klt1tc5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const partsCollection = client.db("lampzone").collection("parts");
    const reviewsCollection = client.db("lampzone").collection("reviews");
    const orderCollection = client.db("lampzone").collection("orders");
    const newsLetterCollection = client.db("lampzone").collection("newsletter");
    app.get("/parts",async(req,res) => {
      const query = {};
      const cursor = partsCollection.find(query);
      const parts = await cursor.toArray();
      res.send(parts)
    });
    app.get("/parts/:id",async(req,res) =>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const part = await partsCollection.findOne(query);
      res.send(part);
    })
    app.get("/reviews",async(req,res) => {
      const query = {};
      const cursor = reviewsCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    })
    // Get 8 reviews for homepage
    app.get("/eight-reviews",async(req,res) => {
      const query = {};
      const cursor = reviewsCollection.find(query).limit(8);
      const reviews = await cursor.toArray();
      res.send(reviews);
    })
    // Post Reviews 
    app.post("/reviews",async(req,res) => {
      const review = req.body;
      const doc = review;
      const result = await reviewsCollection.insertOne(doc);
      res.send({success:true,result})
    })
    app.get("/orders",async(req,res) => {
      const email = req.query.email;
      const query = {email:email};
      const orders = await orderCollection.find(query).toArray();
      res.send(orders);
    })
    app.post("/orders",async(req,res) => {
      const orders = req.body;
      const doc = orders;
      const result = await orderCollection.insertOne(doc);
      res.send({success:true,result})
    })
    app.post("/newsletter",async(req,res) => {
      const userInfo = req.body;
      const doc = userInfo;
      const result = await newsLetterCollection.insertOne(doc);
      res.send({success:true,result})
    })
  }
  finally {

  }
}
run().catch(console.dir)

app.get("/", (req, res) => {
  res.send("Hola! Server working perfectly");
});

app.listen(port, () => {
  console.log(`Lamp zone running from port: ${port}`);
});
