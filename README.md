---
date: 2021-02-19
title: "A Graphql Crud in KeystoneJS and mongodb"
tags: ["KeystoneJS", "CMS", Graphql]
published: false
image: "../../../images/blog/keystone.png"
excerpt: "Keystone Crud Graphql Mongodb"
---

# KeystoneJS

DEFINITION, installatio

Right out of the box, Next.js provides things like pre-rendering, routing, code splitting, and webpack support.

- [Live Demo](https://nextjs-scratch.vercel.app/)
- [Repo en github](https://github.com/ejbcode/nextjs-scratch)

## Install

To create a project, run:

```bash
npm init keystone-app my-app
```

You'll be prompted with a few questions:

- What is your project name? Pick any name for your project. You can change it later if you like.
- Select a database type. Choose between MongoDB and PostgreSQL.
- Where is your database located? Provide the connection string for your database.
- Test your database connection. Test that Keystone can connect to your database.
- Select a starter project. These are some preconfigured projects you can use as the base of your own application.

Once you have answered these questions, Keystone will be installed in a project directory. This will take a few minutes, as there are a number of dependencies which need to be downloaded and installed.

Once your project has been set up you should move into its directory so that you can start using it

cd my-app
npm run dev

change the port 3000 for avoid future problem with the frontend.

### dotenv

npm i dotenv

create a .env file

```JS
MONGO_URI='mongodb+srv://USER:PASSWORD@keystonecluster.rlmni.mongodb.net/keystone101?retryWrites=true&w=majority'
COOKIE_SECRET="literally anything you want"
```

```JS
const dotenv = require('dotenv').config()

const adapterConfig = { mongoUri: process.env.MONGO_URI };

const keystone = new Keystone({
  adapter: new Adapter(adapterConfig),
  cookieSecret: process.env.COOKIE_SECRET
});
```

## Adding lists

Create a folder name **lists**, in this folder we gonna create the schemas into separete files.

e.g:
/lists/Posts.js

```JS
const { Text, Checkbox } = require('@keystonejs/fields');

module.exports = {
 fields: {
   description: {
     type: Text,
     isRequired: true,
   },
   isComplete: {
     type: Checkbox,
     defaultValue: false,
   },
 },
};
```

Here we described a very basic schema for a generic Todo list. Let's add it to our Keystone application. Inside of index.js import the defined schema.

_index.js_

```JS
const TodoSchema = require('./lists/Todo.js');

keystone.createList('Todo', TodoSchema);
```

And each list can have as many fields as you need.

Keystone will process each List, converting it into a series of GraphQL CRUD (Create, Read, Update, Delete) operations. For example, the above lists will generate:

```GRAPHQL
type Mutation {
  createTodo(...): Todo
  updateTodo(...): Todo
  deleteTodo(...): Todo

}

type Query {
  allTodos(...): [Todo]
  Todo(...): Todo

}

type Todo {
  id: ID
  task: String
}

```

## Relationships

To do a relationships first you have to import the trupe Relationship from '@keystonejs/fields', and add it to the schema

```JS
assignee: {
  type: Relationship,
  ref: 'User.tasks',
  many: false,
  isRequired: true,
}
```

And we could do a two-sided relationship between User and Todo

_/lists/User.js_

```JS
const { Text, Checkbox, Password, Relationship} = require('@keystonejs/fields')

const UserFields = {
  fields: {
    name: {
      type: Text,
      isRequired: true,
    },
    email: {
      type: Text,
      isRequired: true,
      isUnique: true,
    },
    password: {
      type: Password,
      isRequired: true,
    },
    isAdmin: {
      type: Checkbox,
      isRequired: true,
    },
    tasks: {
      type: Relationship,
      ref: 'Todo.assignee',
      many: true,
    }
  },
}

module.exports = UserFields

```

## Authentication in KeystoneJS

You can set an access control to the AdminUI, and set another access control to restrict the API access

### Logging in to the Admin UI

You have to define which list is going to be use to login in the UI. For this example we going to use the user list
Then we need to install.
`npm i @keystonejs/auth-password`

and then import it in the index file

```JS
//import PasswordAuthStrategy from @keystonejs/auth-password
const { PasswordAuthStrategy } = require('@keystonejs/auth-password')

//create the authStrategy. We define which list and what are the
// params to login in the Admin ui
const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
  config: {
    identityField: 'email',
    secretField: 'password',
  },
});

//add the authStrategy to the keystone export
module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({
      name: PROJECT_NAME,
      enableDefaultRoute: true,
      authStrategy,
    }),
  ],
};
```

Now, with the password access control mechanism, all users with accounts will be able to access the Admin UI. For restrict the access to a Admin user, we need to use the the isAccessAllowed config option. This function it must return either true or false.

```JS

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({
      name: PROJECT_NAME,
      enableDefaultRoute: true,
      authStrategy,
      // Add isAccessAllowed to restrict the access only for admin user
      isAccessAllowed: ({ authentication: { item: user, listKey: list } }) => !!user && !!user.isAdmin
    }),
  ],
};

```

admin will have to logginto have access to the adminUI.
This access control will not restrict the API access.

### Access control to the API

finally, the index.js file with admin, login access control to the AdminUI and the API

```JS
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

```

query bringData {
allTodos {
name
id
}
}

query bringDataByKeyword($search: String!) {
allTodos(where: { name_contains: $search }) {
name
}
}

query bringDataorderby($order: [SortTodosBy!]) {
allTodos(sortBy: $order) {
name
}
}

query dataById($id: ID!) {
Todo(where: { id: $id }) {
name
}
}

mutation createATodo($newname: String!) {
createTodo(data: { name: $newname }) {
name
}
}

mutation deleteByID($idToDelete: ID!) {
deleteTodo(id: $idToDelete) {
name
}
}

mutation updateById($idToUpdate: ID!, $newname: String!) {
updateTodo(id: $idToUpdate, data: { name: $newname }) {
name
}
}

{ "search": "f",
"newname": "this is a new todo",
"idToDelete": "6030cb9f6da9b240fc43f005",
"id": "6030becc6da9b240fc43efff",
"order": ["name_DESC"]
}
