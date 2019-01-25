import express = require('express');

const app = express();
app.disable('x-powered-by');
app.use(express.json());

app.get('/', (req, res) => {
  res.send('it works');
});

app.set('port', process.env.PORT || 3000);

export default app;
