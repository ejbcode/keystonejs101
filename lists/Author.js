const { Text } = require('@keystonejs/fields')


const author= {
  schemaDoc: 'A list of things which need to be done',
  fields: {
    name: { 
      type: Text, 
      schemaDoc: 'author schema' 
    },
  },
};

module.exports = author

