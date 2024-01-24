const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' :
    process.env.NODE_ENV === 'test' ? '.env.test' :
      '.env.dev'
});
require('./db');

const app = express();
const port = process.env.PORT || 8090;

app.use(helmet());

app.use(cors());

app.use(express.json());

const userRouter = require('./routes/userRoute');
const authRouter = require('./routes/authRoute');
app.use('/api', userRouter);
app.use('/auth', authRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Error!");
});

// Verifica se o arquivo está sendo executado diretamente
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  });
}

module.exports = app;