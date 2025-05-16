'use strict';

const { parseCSV } = require('./csv-parser');
const { addPercentageField, sortByField } = require('./csv-processor');
const { createFormatter } = require('./csv-formatter');

const testData = require('./test-data');

const processCSVData = (csvData) => {
  const objects = parseCSV(csvData);

  const withPercentage = addPercentageField(objects, 'density');
  const sorted = sortByField(withPercentage, 'percentage');

  const formatter = createFormatter();

  const fieldOrder = [
    'city',
    'population',
    'area',
    'density',
    'country',
    'percentage',
  ];

  return formatter.formatRows(sorted, fieldOrder);
};

function main() {
  console.log(processCSVData(testData));
}

main();
