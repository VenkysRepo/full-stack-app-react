import express from 'express';
import bodyparser from 'body-parser';
import {MongoClient} from 'mongodb';
import path from 'path'
const app = express();

//serve static files
app.use(express.static(path.join(__dirname, '/build')));
//serve static files

app.use(bodyparser.json());

//Test API Calls
app.get('/hello',(req,res) => res.send('hii'));
app.post('/hello',(req,res) => res.send(`Hii ${req.body.name}`));
//Test API Calls

//AP Call with MongoDb
app.get('/api/devices/:name', async (req, res) => {
    try {

    const deviceName = req.params.name;
     //connecting to mongodb
    const client = await MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser : true});
    const db = client.db('device-db');

    const deviceData = await db.collection('devices').findOne({name : deviceName});

    res.status(200).json(deviceData);

    client.close();
    }
    catch(error){
        res.status(500).json({message:'Error connecting to db', error});
    }

})

// all reqs callend by any other API routes should be passed on to our app. 
app.get('*',(req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
})
// all reqs callend by any other API routes should be passed on to our app. 
app.listen(8000,()=>console.log('Listening on port 8000'));