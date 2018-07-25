const koa = require('koa');
const koaRouter = require('koa-router');
const koaBody = require('koa-bodyparser');
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa');
const schema = require('./schema');

const connectMongo = require('./mongo-connector');
const buildDataloaders = require('./dataloaders');
const formatError = require('./formatError');
const { authenticate } = require('./authentication');

// subscriptions
const { execute, subscribe } = require('graphql');
const { createServer } = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');

const start = async () => {
  const mongo = await connectMongo();
  const buildOptions = async (req, res) => {
    const user = await authenticate(req, mongo.Users);
    return {
      context: {
        dataloaders: buildDataloaders(mongo),
        mongo,
        user
      },
      formatError,
      schema
    };
  };

  const app = new koa();
  const router = new koaRouter();
  const PORT = 4000;

  app.use(koaBody());

  router.post('/graphql', graphqlKoa(buildOptions));
  router.get('/graphql', graphqlKoa(buildOptions));
  router.get(
    '/graphiql',
    graphiqlKoa({
      endpointURL: '/graphql',
      passHeader: `'Authorization': 'bearer token-whenhan@foxmail.com'`,
      subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
    })
  );

  app.use(router.routes());
  app.use(router.allowedMethods());

  const server = app.listen(PORT, () => {
    SubscriptionServer.create(
      { execute, subscribe, schema },
      { server, path: '/subscriptions' }
    );
    console.log(`Hackernews GraphQL server running on port ${PORT}.`);
  });
};

// 5
start();
