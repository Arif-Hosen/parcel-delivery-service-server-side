const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();

// user:parcel-delivery-service
// pass:1fIGKWV0zKcmY2EJ
const port = process.env.PORT || 5000;

const cors = require('cors');

// middleware
app.use(cors())
app.use(express.json());

const uri = "mongodb+srv://parcel-delivery-service:1fIGKWV0zKcmY2EJ@cluster0.p2nrx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send("Hello Parcel Delivery Server");
})

async function run() {
    try {
        await client.connect();
        const database = client.db("parcel-delivery-service");
        const parcelServices = database.collection("services");
        const bookingCollection = database.collection("booking");

        // get api
        app.get('/services', async (req, res) => {
            const cursor = parcelServices.find({});

            const services = await cursor.toArray();
            res.json(services);

        })
        // get single service api
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const service = await parcelServices.findOne(query);
            res.json(service);

        })

        // post booking
        app.post('/booking', async (req, res) => {
            const customer = req.body;
            console.log('hit the post api', customer);

            const result = await bookingCollection.insertOne(customer);

            res.json(result)
        });

        // get booking
        app.get('/booking', async (req, res) => {
            const cursor = bookingCollection.find({});

            const booking = await cursor.toArray();
            res.json(booking);

        })

        // DELETE API
        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally {

    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log('listening port', port)
})