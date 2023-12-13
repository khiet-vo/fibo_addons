const express = require('express');
const cors = require('cors');
const port = 3001;
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.json({ type: 'application/json' }));

// Routes
app.get('/', (_req, res) => {
  console.info('Homepage:' + port);
  res.send('Hello world!!!');
});

app.listen(port, () => {
  console.log('Fibo App running on port:' + port);
});
