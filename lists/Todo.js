const { Text,  Checkbox, Relationship } = require('@keystonejs/fields');

module.exports = {
  fields: {
    // existing fields
    description: {
      type: Text,
      isRequired: true,
    },
    isComplete: {
      type: Checkbox,
      defaultValue: false,
    },
    // added fields
   
    // assignee: {
    //   type: Relationship,
    //   isRequired: true,
    //   ref: 'User',
    // },
  },
};