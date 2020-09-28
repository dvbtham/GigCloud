const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  const dbUrl = 'mongodb://127.0.0.1:27017/';

  MongoClient.connect(dbUrl, { useUnifiedTopology: true })
    .then((client) => {
      _db = client.db('gigcloud');
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) return _db;
  throw 'No database found';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
