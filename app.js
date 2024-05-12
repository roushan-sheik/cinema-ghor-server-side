const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const express = require("express");

const app = express();
//middleware
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
// response
app.get("/", (req, res) => {
  res.send("Hello doctor");
});
// health
app.get("/health", (req, res) => {
  res.status(200).send("Helth is Good");
});
// Database connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.08atmtx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const doctorServices = client.db("carDoctor").collection("services");
    // get all blogs
    app.get("/blogposts", async (req, res) => {
      const cursor = blogCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // get single blog
    app.get("/blogdetails/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await blogCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    } );
    // update blog route added 
      app.get("/updateblog/:id", async (req, res) => {
        console.log(req.params.id);
        const result = await blogCollection.findOne({
          _id: new ObjectId(req.params.id),
        });
        res.send(result);
      } );
    // get my blogs 
        app.get("/myblog/:email", async (req, res) => {
          console.log(req.params.email);
          const result = await blogCollection
            .find({ email: req.params.email })
            .toArray();
          res.send(result);
        });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port : http://localhost:${port}`);
});
