const { Text,  CalendarDay } = require('@keystonejs/fields');
const Test = {
  fields: {
    name: { type: Text },
    email: { type: Text, isUnique: true },
    dob: {
      type: CalendarDay,
      format: 'do MMMM yyyy',
      dateFrom: '1901-01-01',
      dateTo: formatISO(new Date(), { representation: 'date' }),
    },
    password: { type: Password },
  },
};

module.exports = Test