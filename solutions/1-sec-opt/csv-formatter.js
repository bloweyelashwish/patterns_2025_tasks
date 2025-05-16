'use strict';

const DEFAULT_CONFIG = {
  city: { align: 'left', width: 18 },
  population: { align: 'right', width: 10 },
  area: { align: 'right', width: 8 },
  density: { align: 'right', width: 8 },
  country: { align: 'right', width: 18 },
  percentage: { align: 'right', width: 6 },
};

const formatValue = (value, fieldConfig) => {
  if (value === undefined || value === null) {
    value = '';
  }

  const stringValue = String(value);
  const { align, width } = fieldConfig;

  if (align === 'left') {
    return stringValue.padEnd(width);
  } else {
    return stringValue.padStart(width);
  }
};

const createFormatter = (config = {}) => {
  const formattingConfig = {};
  for (const field in DEFAULT_CONFIG) {
    formattingConfig[field] = {
      ...DEFAULT_CONFIG[field],
      ...(config[field] || {}),
    };
  }

  const formatRow = (obj, fieldOrder = null) => {
    const fields = fieldOrder || Object.keys(obj);
    let output = '';

    fields.forEach((field) => {
      const value = obj[field];
      const fieldConfig = formattingConfig[field];

      output += formatValue(value, fieldConfig);
    });

    return output;
  };

  const formatRows = (objects, fieldOrder = null) =>
    objects.map((obj) => formatRow(obj, fieldOrder)).join('\n');

  return {
    formatRow,
    formatRows,
  };
};

module.exports = {
  createFormatter,
  defaultConfig: DEFAULT_CONFIG,
};
