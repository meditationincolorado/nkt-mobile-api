const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

/* */
app.get('/advice', (req, res) => {
    const meditations = require('./data/advice.json')
    res.send(meditations);
});

app.get('/meditations', (req, res) => {
    const meditations = require('./data/meditations.json')
    res.send(meditations);
});

app.get('/', (req, res) => {
    res.send('NKT Mobile App API');
});

app.listen(port, () => {
  console.log(`listening on port ${ port }`);
});