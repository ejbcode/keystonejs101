const dotenv = require('dotenv').config()
const { Keystone } = require('@keystonejs/keystone');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');
const PROJECT_NAME = 'keystone101';
const adapterConfig = { mongoUri: process.env.MONGO_URI };
const PostSchema = require('./lists/Post')
const AuthorSchema = require('./lists/Author')
const UserSchema = require('./lists/User')
const TodoSchema = require('./lists/Todo')





/**
 * You've got a new KeystoneJS Project! Things you might want to do next:
 * - Add adapter config options (See: https://keystonejs.com/keystonejs/adapter-mongoose/)
 * - Select configure access control and authentication (See: https://keystonejs.com/api/access-control)
 */


const keystone = new Keystone({
  adapter: new Adapter(adapterConfig),
  cookieSecret: process.env.COOKIE_SECRET
});

keystone.createList('Post', PostSchema)
keystone.createList('Authorz', AuthorSchema)
keystone.createList('User', UserSchema)


keystone.createList('Todo', TodoSchema);




module.exports = {
  keystone,
  apps: [
    new GraphQLApp(), 
    new AdminUIApp({ name: PROJECT_NAME, enableDefaultRoute: true })],
};
