const express =  require('express');
const mongoose =  require('mongoose');

const app = express();

app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.getHeader('Access-Control-Allow-Origin');
  next();
});

app.listen(5000, () => console.log('server started at port 5000'));