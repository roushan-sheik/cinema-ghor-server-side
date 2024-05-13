const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const express = require("express");

const app = express();
//middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://blog-management-app-bc38c.web.app",
    ],
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
    // await client.connect();
    // ==========================> Wishlist  route implementation <=============================
    const wishlistCollection = client.db("blogWebDB").collection("wishlist");
    // get all wishlist blog
    app.get("/wishlist", async (req, res) => {
      const cursor = wishlistCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // add to wishlist
    app.post("/wishlist", async (req, res) => {
      const newItem = req.body;
      console.log(newItem);
      const result = await wishlistCollection.insertOne(newItem);
      // Send the inserted comment as response
      res.status(201).send(result);
    });
    // get user wishlist
    app.get("/wishlist/:user_email", async (req, res) => {
      console.log(req.params.id);
      const result = await wishlistCollection.find({
        user_email: req.params.user_email,
      });
      const data = await result.toArray();
      res.send(data);
    });
    // delete blog from wishlist
    app.delete("/wishlist/delete/:id", async (req, res) => {
      const result = await wishlistCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      console.log(result);
      res.send(result);
    });

    // ==========================> Comment route implementation <=============================
    const commentCollection = client.db("blogWebDB").collection("comments");
    // get all comments
    app.get("/comments", async (req, res) => {
      const cursor = commentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // create comment
    app.post("/comments", async (req, res) => {
      const newItem = req.body;
      console.log(newItem);
      const result = await commentCollection.insertOne(newItem);
      // Send the inserted comment as response
      res.status(201).send(result);
    });

    // get blog comments
    app.get("/comments/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await commentCollection.find({
        blog_id: req.params.id,
      });
      const data = await result.toArray();
      res.send(data);
    });
    // delete comment
    app.delete("/comment/delete/:id", async (req, res) => {
      const result = await commentCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      console.log(result);
      res.send(result);
    });
    // ==========================> Blog route implementation <=============================
    const blogCollection = client.db("blogWebDB").collection("blogPosts");
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
    });
    // update blog route added
    app.get("/updateblog/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await blogCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });
    // get my blogs
    app.get("/myblog/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await blogCollection
        .find({ user_email: req.params.email })
        .toArray();
      res.send(result);
    });
    // create blog
    app.post("/blogposts", async (req, res) => {
      const newItem = req.body;
      console.log(newItem);
      const result = await blogCollection.insertOne(newItem);
      res.send(result);
    });
    // delete blog post
    app.delete("/delete/:id", async (req, res) => {
      const result = await blogCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      console.log(result);
      res.send(result);
    });
    // update blog route
    app.put("/updateChanges/:id", async (req, res) => {
      console.log(req.params.id);
      const query = { _id: new ObjectId(req.params.id) };
      const options = { upsert: true };
      const data = {
        $set: {
          title: req.body.title,
          image_url: req.body.image_url,
          category: req.body.category,
          short_description: req.body.short_description,
          long_description: req.body.long_description,
        },
      };
      const result = await blogCollection.updateOne(query, data, options);
      res.send(result);
    });
    // filter blogs
    app.get("/filter-blog", async (req, res) => {
      const filter = req.query.filter;
      const search = req.query.search;
      let query = {
        title: { $regex: search, $options: "i" },
      };
      if (filter) query.category = filter;
      const result = await blogCollection.find(query).toArray();
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
