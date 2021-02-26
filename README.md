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

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Folder structure

📦my-app

┣ 📂pages

┃ ┣ 📂api

┃ ┃ ┗ 📜hello.js

┃ ┣ 📜index.js

┃ ┗ 📜_app.js

┣ 📂public

┃ ┣ 📜favicon.ico

┃ ┗ 📜vercel.svg

┣ 📂styles

┃ ┣ 📜globals.css

┃ ┗ 📜Home.module.css

┣ 📜.gitignore

┣ 📜package-lock.json

┣ 📜package.json

┗ 📜README.md

## Pages

All React Component exported from a .js, .jsx, .ts, or .tsx file in the pages directory will become a page. Each page is associeted with a route based on its own file name.

**Example:**
If you create a React Component like below

```JS
const welcome = () => {
  return (
    <div>
      Welcome
    </div>
  )
}

export default welcome

```

it will be accessible at _/welcome_ with no need to import a router

## Layout

The _\_app.js_ file wraps around all of your page components, so it's a good place to put our Layout component.

_page/\_app.js_

```JS
import Layout from '../components/Layout'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
        <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
```

```JS
import React from 'react'

const Layout = ({children}) => {
  return (
    <div>
      Header
        <div className="main">
          {children}
        </div>
      Footer
    </div>
  )
}

export default Layout
```

## Head Component

Head is a 'next/head' component that can be imported from any Next.js page component to add information to the page header. In this component you can customize the page title, all of the website metadata, page keywords, viewport settings

```HTML
 <Head>
    <title>NextJS 101</title>
    <meta charSet="utf-8" />
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
  </Head>
```

This should be imported in each page, but we can create a Layout with the Head component in it.
_e.g:.:_

```JS
import Head from 'next/head'

const Meta = ({ title, keywords, description }) => {
  return (
    <Head>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='keywords' content={keywords} />
      <meta name='description' content={description} />
      <meta charSet='utf-8' />
      <link rel='icon' href='/favicon.ico' />
      <title>{title}</title>
    </Head>
  )
}

Meta.defaultProps = {
  title: 'My App Title',
  keywords: 'nextjs, react',
  description: 'Next From scratch',
}

export default Meta

```

## Link component

Similar to what we would do with React-Router we use Link to navigate between pages imported from next
import Link from "next/link";

```JS
<Link href="/">
  <a>home</a>
</Link>
```

With that in mind, now we can create a Nav component to navigate through our links and then imported in the Layout component

```js
import Link from "next/link";
import { useRouter } from "next/router";

const Nav = () => {
  const router = useRouter();
  return (
    <nav className="nav">
      <ul>
        <li className={router.pathname == "/" ? "active" : ""}>
          <Link href="/">
            <a>home</a>
          </Link>
        </li>
        <li className={router.pathname == "/welcome" ? "active" : ""}>
          <Link href="/welcome">
            <a>Welcome</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
```

## Image Component

The Next.js Image component allow you're to take advantage of lazy loading as well as optimizations around image sizes.
Next.js optimizes images on-demand, as users request them. Unlike static site generators and static-only solutions, your build times aren't increased, whether shipping 10 images or 10 million images.

```JS
import Image from 'next/image'

const Nav = () => {

  const router = useRouter()
  return (
    <div className="nav">
      <Image src="/logo.png"  alt="site logo"  width={90} height={50}/>
    </div>
  )
}

export default Nav

```

## Data Fetching and Rendering

Next.js provide two forms of pre-rendering: Static Generation and Server-side that differ when generates the HTML for a page.

Static Generation is the pre-rendering method that generates the HTML at build time. The pre-rendered HTML is then reused on each request.
Server-side Rendering is the pre-rendering method that generates the HTML on each request
In the Static Generation, the HTML pages are rendered at build time.

### Static Generation with getStaticProps

```JS
export async function getStaticProps() {
  const res = await fetch(`https:....`)
  const data = await res.json()

  return {
    props: {
      data
    }
  }
}
```

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the Vercel [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# KeystoneJS Blank Starter Template

You've created a KeystoneJS project! This project contains an AdminUI and GraphQL App.

You probably want to add Lists, Authentication, Access control and a front-end application.

## Running the Project.

To run this project first run `npm install`. Note: If you generated this project via the Keystone cli step this has been done for you \\o/.

Once running the Keystone Admin UI is reachable via: `localhost:3000/admin`.

## Next steps

This example has no front-end application but you can build your own using the GraphQL API (`http://localhost:3000/admin/graphiql`).
