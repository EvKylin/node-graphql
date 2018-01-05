const {Logger, MongoClient} = require('mongodb');

// 1
const MONGO_URL = 'mongodb://localhost:27017/hackernews';

// 2
module.exports = async () => {
  // MongoClient.connect('mongodb://localhost:27017', function(err, client){
  //   console.log('success');
  //   const db = client.db('hackernews');
  //   const links = db.collection('links');
  //   console.log(links)
  // })
  const db = await MongoClient.connect(MONGO_URL);
  let logCount = 0;
  Logger.setCurrentLogger((msg, state) => {
    console.log(`MONGO DB REQUEST ${++logCount}: ${msg}`)
  });
  Logger.setLevel('debug');
  Logger.filter('class', ['Cursor'])
  return {
    Links: db.collection('links'),
    Users: db.collection('users'),
    Votes: db.collection('votes'),
    Todos: db.collection('todos'),
  };
}
