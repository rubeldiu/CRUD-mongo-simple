const express = require("express");
//dbRubel saPfdDreAfmIKNUI
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const uri =
  "mongodb+srv://dbRubel:saPfYourPasswordI@cluster0.ulzfk.mongodb.net/organicdb?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

client.connect((err) => {
  const ProductCollection = client.db("organicdb").collection("products");

 

  //Insert Data

  app.post("/addProduct", (req, res) => {
    const product = req.body;
    ProductCollection.insertOne(product).then((result) => {
      console.log("Data added successfully");
      res.redirect("/");
    });
  });

   // Read Data
   app.get("/products", (req, res) => {
    ProductCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.delete("/delete/:id", (req, res) => {
    ProductCollection.deleteOne({ _id: ObjectId(req.params.id) }).then(
      (result) => {
        res.send(result.deletedCount > 0);
      }
    );
  });

  app.patch('/update/:id',(req,res)=>{
      ProductCollection.updateOne({ _id: ObjectId(req.params.id)},{
          $set:{price:req.body.price,quantity:req.body.quantity}
      })
      .then(result => {
        res.send(result.modifiedCount > 0)
    })
  })

  app.get('/product/:id', (req, res) => {
    ProductCollection.find({ _id: ObjectId(req.params.id) })
        .toArray((err, documents) => {
            res.send(documents[0])
        })
})

  console.log("database connected");
});

app.listen(4000);
