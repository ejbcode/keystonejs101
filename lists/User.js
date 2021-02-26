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
