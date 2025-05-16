'use strict';

const LINE_SEPARATOR = '\n';
const COL_SEPARATOR = ',';

const isProcessableCSV = (data) =>
  typeof data === 'string' && data.trim().split(LINE_SEPARATOR).length >= 2;

const extractParts = (data) => {
  const lines = data.trim().split(LINE_SEPARATOR);
  const [header, ...bodyLines] = lines;

  return {
    properties: header.split(COL_SEPARATOR).map((prop) => prop.trim()),
    body: bodyLines.filter((line) => line.trim().length > 0),
  };
};

const rowToValue = (row, properties, options = {}) => {
  const { convertNumbers = true } = options;
  const values = row.split(COL_SEPARATOR).map((val) => val.trim());

  return properties.reduce((obj, prop, index) => {
    const value = values[index];

    obj[prop] =
      convertNumbers && !isNaN(value) && value !== '' ? Number(value) : value;

    return obj;
  }, {});
};

const partsToValue = (parts, options = {}) =>
  parts.body.map((row) => rowToValue(row, parts.properties, options));

const parseCSV = (data, options = {}) => {
  if (!isProcessableCSV(data)) {
    throw new Error('Invalid CSV string');
  }

  return partsToValue(extractParts(data), options);
};

module.exports = {
  parseCSV,
};
