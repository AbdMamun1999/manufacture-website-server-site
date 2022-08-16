const express = require('express');
const app = express()
const cors = require('cors')
var jwt = require('jsonwebtoken');
require('dotenv').config()
const stripe = require("stripe")(`${process.env.STRIPE_SECRET_KEY}`);

const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' })
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbiden access' })
        }
        req.decoded = decoded
        next();
    })
}


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.y4d5u.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri,'uri')

async function run() {
    try {
        await client.connect();
        const productsCollection = client.db('manufacturer-project').collection('products')
        const purchaseCollection = client.db('manufacturer-project').collection('purchaseInfo')
        const userCollection = client.db('manufacturer-project').collection('users')
        const reviewCollection = client.db('manufacturer-project').collection('reviews')
        const paymentCollection = client.db('manufacturer-project').collection('payment')
        const productForCollection = client.db('manufacturer-project').collection('product')


        // verify admin
        const verifyAdmin = async (req, res, next) => {
            const requester = req.decoded.email
            const requseterAccount = await userCollection.findOne({ email: requester })
            if (requseterAccount.role === 'admin') {
                next()
            } else {
                res.status(403).send({ message: 'Forbiden' })
            }
        }


        app.get('/products', async (req, res) => {
            const query = {}
            const cursor = productsCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/products/:id', verifyJWT, async (req, res) => {
            const id = req.params.id
            const query = { _id: (ObjectId(id)) }
            const result = await productsCollection.findOne(query)
            res.send(result)
        })

        app.get('/orders/:email', async (req, res) => {
            console.log(req.params)
            const email = req.params.email;
            const query = { email: email }
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
            console.log(email, 'email verify')
            const user = req.body;
            const filter = { userEmail: email }
            const options = { upsert: true };
            const updateDoc = {
                $set: user
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
            res.send({ result, token })


        })

        app.get('/reviews', async (req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review)
            res.send(result)
        })


        app.get('/order/:id', async (req, res) => {
            const id = req.params.id
            console.log(req.params, 'id orders')
            const query = { _id: (ObjectId(id)) }
            const result = await purchaseCollection.findOne(query)
            res.send(result)
        })

        //create-payment-intent 
        app.post('/create-payment-intent', verifyJWT, async (req, res) => {
            const service = req.body
            const price = service.purchasePrice
            console.log(price, 'payment price')
            const amount = parseInt(price) * 100
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'usd',
                payment_method_types: [
                    "card"
                ]
            });
            res.send({
                clientSecret: paymentIntent.client_secret
            });
        })


        // update payment by id
        app.patch('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const payment = req.body;
            const filter = { _id: (ObjectId(id)) }
            const updateDoc = {
                $set: {
                    paid: true,
                    transactionId: payment.transactionId,
                    status: 'pending'
                }
            };
            const result = await paymentCollection.insertOne(payment)
            const updatedOrders = await purchaseCollection.updateOne(filter, updateDoc);
            res.send(updatedOrders)
        })


        // get all users
        app.get('/users', verifyJWT, async (req, res) => {
            const query = {}
            const cursor = userCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        // check admin for useAdmin
        app.get('/admin/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email }
            const user = await userCollection.findOne(filter)
            const isAdmin = user.role === 'admin';
            res.send({ admin: isAdmin })
        })

        // create admin
        app.put('/users/admin/:email', verifyJWT,verifyAdmin, async (req, res) => {
            const email = req.params.email;
            const filter = { userEmail: email }
            /*   const requester = req.decoded.email
              console.log(requester)
              const requseterAccount = await userCollection.findOne({ email: requester })
              console.log(requester)
              if (requseterAccount.role === 'admin') { */
            const updateDoc = {
                $set: { role: 'admin' }
            };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result)
            /*  } else {
                 res.status(403).send({ message: 'Forbiden' })
             } */

        })

        // post product for added a product page
        app.post('/product', verifyJWT,verifyAdmin, async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product)
            res.send(result)
        })

        // get All orders for manage all order page
        app.get('/allorders', async (req, res) => {
            const query = {}
            const cursor = purchaseCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        // get manage all order update status
        app.put('/allorders/:id',verifyJWT,verifyAdmin, async (req, res) => {
            const id = req.params.id
            const filter = { _id: (ObjectId(id)) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: 'Shift'
                }
            };
            const result = await purchaseCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })

        // delete single product for manage product page
        app.delete('/allproducts/:id',verifyJWT,verifyAdmin,async (req, res) => {
            const id = req.params.id
            const filter = { _id: (ObjectId(id)) }
            console.log(filter)
            const result = await productsCollection.deleteOne(filter)
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
