const express = require('express');
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.y4d5u.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productsCollection = client.db('manufacturer-project').collection('products')
        const purchaseCollection = client.db('manufacturer-project').collection('purchaseInfo')
        const userCollection = client.db('manufacturer-project').collection('users')
        const reviewCollection = client.db('manufacturer-project').collection('reviews')

        app.get('/products', async (req, res) => {
            const query = {}
            const cursor = productsCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params
            const query = { _id: (ObjectId(id)) }
            const result = await productsCollection.findOne(query)
            res.send(result)
        })

        app.get('/orders', async (req, res) => {
            const query = {}
            const cursor = purchaseCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await purchaseCollection.insertOne(order)
            res.send(result)
        })

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: (ObjectId(id)) }
            console.log(filter)
            const result = await purchaseCollection.deleteOne(filter)
            res.send(result)
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { userEmail: email }
            const result = await userCollection.findOne(filter)
            res.send(result)
        })

        app.put('/users/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { userEmail: email }
            const options = { upsert: true };
            const updateDoc = {
                $set: user
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result)


        })

        app.get('/reviews',async(req,res)=>{
            const query = {}
            const cursor =  reviewCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review)
            res.send(result)
        })
       

    }
    finally { }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('manufacturer server')
})

app.listen(port, () => {
    console.log('start manufacturer server', port)
})
