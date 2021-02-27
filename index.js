const dotenv = require('dotenv').config()
const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy }= require('@keystonejs/auth-password')
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');
const PROJECT_NAME = 'keystone101';
const PostSchema = require('./lists/Post')
const AuthorSchema = require('./lists/Author')
const UserSchema = require('./lists/User')
const TodoSchema = require('./lists/Todo')

/**
 * You've got a new KeystoneJS Project! Things you might want to do next:
 * - Add adapter config options (See: https://keystonejs.com/keystonejs/adapter-mongoose/)
 * - Select configure access control and authentication (See: https://keystonejs.com/api/access-control)
 */

const adapterConfig = { mongoUri: process.env.MONGO_URI };

const keystone = new Keystone({
  adapter: new Adapter(adapterConfig),
  cookieSecret: process.env.COOKIE_SECRET
});

const isAdmin =  ({ authentication: { item: user, listKey: list } }) => !!user && !!user.isAdmin

const isLoggedIn =  ({ authentication: { item: user, listKey: list } }) => !!user

keystone.createList('Post', {
  fields: PostSchema.fields,
  access: {
    read: true,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
})

keystone.createList('Authorz', AuthorSchema)
keystone.createList('User', {
  fields: UserSchema.fields,
  access: {
    read: true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
})
keystone.createList('Todo', TodoSchema);

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
  config: {
    identityField: 'email',
    secretField: 'password',
  },
});



module.exports = {
  keystone,
  apps: [
    new GraphQLApp(), 
    new AdminUIApp({ 
      name: PROJECT_NAME, 
      enableDefaultRoute: true, 
      authStrategy, 
      isAccessAllowed: isAdmin
    }),    
  ],
};
