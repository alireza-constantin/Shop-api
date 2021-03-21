const mongoose = require('mongoose');

const mongoConnect = async () => {
  const connect = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`MongoDB is connected: ${connect.connection.host}...`.cyan.bold);
};

module.exports = mongoConnect;
