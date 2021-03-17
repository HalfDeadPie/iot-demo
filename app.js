'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

app.get('/', (req, res) => {
    res.send('Please, use the /decoder route');
});

app.get('/decoder', (req, res) => {
    var payload = req.query.payload
    console.log('Received: ', payload)
    let decoder = require('./decoder')
    let result = decoder.decode_payload(payload)
    console.log('Response: \n', result)
    console.log("")
    res.status(200).send(result)
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
