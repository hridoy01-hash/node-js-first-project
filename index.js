const express = require('express');
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const app = express();
const port = 5000;

//user : firstMongoDB
//password : iCYGP0iUbQ6rCeN8

//midleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://firstMongoDB:iCYGP0iUbQ6rCeN8@cluster0.6rclh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("foodCluster");
      const userCollection = database.collection("users");
      


      //get api
      app.get('/users', async (req,res)=>{
          
        const cursor = userCollection.find({});
        const users = await cursor.toArray();
        res.send(users);

      } );

      app.get('/users/:id',async(req,res)=>{
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const user = await userCollection.findOne(query)

       
        console.log('loaded user with id',id);
        res.send(user);
      })




    //POST API
    app.post('/users', async (req,res)=>{
        const newUser = req.body
        const result = await userCollection.insertOne(newUser)
        console.log('get new user ',req.body);
        console.log('added user ',result);
        res.json(result);

    });

    //UPDATE API
   app.put('/users/:id',async(req,res)=>{
     const id = req.params.id;
     const updatedUser = req.body;
     const filter = {_id:ObjectId(id)};
     const options = { upsert: true };
     const updateDoc = {
      $set: {
        name:updatedUser.name,
        email:updatedUser.email
      },
    };
    const result = await userCollection.updateOne(filter,updateDoc,options)

    //  console.log("update user",req); 
    res.json(result)
   })




    //Delete API
    app.delete('/users/:id',async(req,res)=>{
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await userCollection.deleteOne(query);

        console.log('delete the user ',result);
        res.json(result);
    })

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/',(req,res) => {
    res.send('Running my CURD seerver');
});

app.listen(port,()=>{
    console.log("Running my server on ",port);
});