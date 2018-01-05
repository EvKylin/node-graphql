const {makeExecutableSchema} = require('graphql-tools');
const resolvers = require('./resolvers');

// Define your types here.
const typeDefs = `
  type Mutation {
    createLink(url: String!, description: String!): Link
    createVote(linkId: ID!): Vote
    createUser(name: String!, authProvider: AuthProviderSignupData!): User
    signinUser(email: AUTH_PROVIDER_EMAIL): SigninPayload!

    createTodo(name: String!, completed: Boolean!): Todo
  }

  input AuthProviderSignupData {
    email: AUTH_PROVIDER_EMAIL
  }
  input AUTH_PROVIDER_EMAIL {
    email: String!
    password: String!
  }

  type Link {
    id: ID!
    url: String!
    description: String!
    postedBy: User
    votes: [Vote!]!
  }

  type Vote {
    id: ID!
    user: User!
    link: Link
  }

  type User {
    id:ID!
    name: String!
    email: String
  }

  type SigninPayload {
    token: String
    user: User
  }

  type Todo {
    id: ID!
    name: String!
    completed: Boolean!
    postedBy: User
  }

  type Query {
    allLinks(filter: LinkFilter, skip: Int, first: Int): [Link!]!
    allTodos(skip: Int, first: Int): [Todo!]!
  }

  input LinkFilter {
    OR: [LinkFilter!]
    description_contains: String
    url_contains: String
  }

  type Subscription {
    Link(filter: LinkSubscriptionFilter): LinkSubscriptionPayload
  }

  input LinkSubscriptionFilter {
    mutation_in: [_ModelMutationType!]
  }

  type LinkSubscriptionPayload {
    mutation: _ModelMutationType!
    node: Link
  }

  enum _ModelMutationType {
    CREATED
    UPDATED
    DELETED
  }
`;

// Generate the schema object from your types definition.
module.exports = makeExecutableSchema({typeDefs, resolvers});
