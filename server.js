/* Express JS */
const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

const googleCalAPI = require('./serverHelpers/googleCalAPI'),
    adviceAPI = require('./serverHelpers/adviceAPI'),
    meditationAPI = require('./serverHelpers/meditationAPI')

/* Serve static files*/
// app.get('/advice', (req, res) => {
//     adviceAPI.getAdvice(req, res)
// });
// app.get('/meditations', (req, res) => {
//     meditationAPI.getMeditations(req, res)
// });
app.get('/calendar', (req, res) => {
    googleCalAPI.getClasses(req, res);
});

/* Default */
app.get('/', (req, res) => {
    res.send('NKT Mobile App API');
});

/* Listen on Port */
app.listen(port, () => {
  console.log(`listening on port ${ port }`);
});