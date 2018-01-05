const DataLoader = require('dataloader');

// 1
async function batchUsers (Users, keys) {
  return await Users.find({_id: {$in: keys}}).toArray();
}

async function batchTodos (Todos, keys) {
  return await Todos.find({_id: {$in: keys}}).toArray();
}

// 2
module.exports = ({Users, Todos}) =>({
  // 3
  userLoader: new DataLoader(
    keys => batchUsers(Users, keys),
    {cacheKeyFn: key => key.toString()},
  ),

  todoLoader: new DataLoader(
    keys => batchTodos(Todos, keys),
    {cacheKeyFn: key => key.toString()},
  ),
});
