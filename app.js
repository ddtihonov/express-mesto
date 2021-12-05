const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => console.log('Connected to Database'))
  .catch((error) => console.log({ errorMessage: error.message }));

const app = express();

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
