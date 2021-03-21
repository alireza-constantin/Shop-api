const mongodb = require('mongodb');

const mongoConnect = async () => {
  const connect = await mongodb.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`MongoDB is connected...`.cyan.bold);
};

module.exports = mongoConnect;
