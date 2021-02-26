const { Text,  Checkbox, CalendarDay, Relationship } = require('@keystonejs/fields');

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
    description: {
      type: Text,
      isRequired: true,
    },
    isComplete: {
      type: Checkbox,
      defaultValue: false,
    },
    deadline: {
      type: CalendarDay,
      dateFrom: '2019-01-01',
      dateTo: '2029-01-01',
      isRequired: false,
      defaultValue: new Date().toISOString('YYYY-MM-DD').substring(0, 10), // Today's date
    },
    assignee: {
      type: Relationship,
      ref: 'User.tasks',
      many: false,
      isRequired: true,
    },
  },
  adminDoc: 'A list of things which need to be done.',
};