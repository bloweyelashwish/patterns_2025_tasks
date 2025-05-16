'use strict';

const { performance } = require('perf_hooks');
const { parseCSV } = require('./csv-parser');
const { addPercentageField, sortByField } = require('./csv-processor');
const { createFormatter } = require('./csv-formatter');

const generateTestCSV = (rows, cols = 5) => {
  const header = Array.from({ length: cols }, (_, i) => `field${i}`).join(',');

  const data = [];
  for (let i = 0; i < rows; i++) {
    const rowData = Array.from({ length: cols }, (_, j) =>
      j === 0 ? `value${i}` : Math.floor(Math.random() * 1000),
    ).join(',');
    data.push(rowData);
  }

  return [header, ...data].join('\n');
};

const runLoadTest = (rows, cols = 5, iterations = 1) => {
  console.log(`Generating ${rows} rows with ${cols} columns...`);
  const csvData = generateTestCSV(rows, cols);

  const results = {
    parsing: 0,
    processing: 0,
    formatting: 0,
    total: 0,
  };

  console.log(`Running ${iterations} iterations...`);
  const totalStart = performance.now();

  for (let i = 0; i < iterations; i++) {
    const parseStart = performance.now();
    const objects = parseCSV(csvData);
    results.parsing += performance.now() - parseStart;

    const processingLimit = rows > 5000 ? 5000 : rows;
    const objectsToProcess = objects.slice(0, processingLimit);

    const processStart = performance.now();
    const withPercentage = addPercentageField(objectsToProcess, 'field1');
    const sorted = sortByField(withPercentage, 'percentage');
    results.processing += performance.now() - processStart;

    const formatSample = sorted.slice(0, 100);

    const formatStart = performance.now();
    const formatter = createFormatter();
    formatter.formatRows(formatSample);
    results.formatting += performance.now() - formatStart;
  }

  results.total = performance.now() - totalStart;

  results.parsing /= iterations;
  results.processing /= iterations;
  results.formatting /= iterations;

  results.memory = process.memoryUsage().heapUsed / 1024 / 1024;

  return results;
};

const benchmark = (sizes = [100, 1000, 5000, 10000]) => {
  for (const size of sizes) {
    console.log(`\nTesting with ${size} rows:`);

    try {
      const results = runLoadTest(size, 5, 10);

      console.log(`  Parsing: ${results.parsing.toFixed(2)}ms`);
      console.log(`  Processing: ${results.processing.toFixed(2)}ms`);
      console.log(`  Formatting: ${results.formatting.toFixed(2)}ms`);
      console.log(`  Total: ${results.total.toFixed(2)}ms`);

      const rowsPerSecond = (size / (results.total / 1000)).toFixed(0);
      console.log(`  Performance: ${rowsPerSecond} rows/second`);
      console.log(`  Memory: ${results.memory.toFixed(2)}MB`);
    } catch (error) {
      console.error(`  Error testing ${size} rows:`, error);
    }
  }
};

if (require.main === module) {
  benchmark();
}
