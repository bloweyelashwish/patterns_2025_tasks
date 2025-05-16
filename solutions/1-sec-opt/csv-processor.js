'use strict';

const calculateField = (objects, sourceField, targetField, calculator) =>
  objects.map((obj) => ({
    ...obj,
    [targetField]: calculator(obj, sourceField),
  }));

const addPercentageField = (objects, sourceField) => {
  const maxValue = Math.max(...objects.map((obj) => obj[sourceField]));

  return calculateField(objects, sourceField, 'percentage', (obj, field) =>
    Math.round((obj[field] * 100) / maxValue),
  );
};

const sortByField = (objects, field, direction = 'desc') =>
  [...objects].sort((a, b) =>
    direction === 'desc' ? b[field] - a[field] : a[field] - b[field],
  );

module.exports = {
  calculateField,
  addPercentageField,
  sortByField,
};
