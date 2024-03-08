const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  // console.log('uncaught exception, shutting down...');
  // console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);

// const DB =
//   'mongodb+srv://milly:T!8A.tkSGZWdbnZ@cluster0.ngy4vmc.mongodb.net/natours?retryWrites=true';
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful!');
  });
// .catch((err) => console.log(err));

//start server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  // console.log('Unhandled rejection! Shutting down...');
  // console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
