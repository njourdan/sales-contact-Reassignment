// Function to process a single CSV and return the data
import { parse } from 'csv';
import fs from 'fs';
export async function processCSVs(filename) {
  const data = []; // Create a local data array

  return new Promise((resolve, reject) => {
    fs.createReadStream(`src/${filename}.csv`)
      .pipe(
        parse({
          columns: true,
          trim: true
        })
      )
      .on('data', (row) => {
        data.push(row);
      })
      .on('error', (err) => {
        console.error(err);
        reject(err); // Reject the promise in case of error
      })
      .on('end', () => {
        resolve(data); // Resolve the promise with the data array
      });
  });
}
// Function to process both CSVs and return the data
export async function processContacts() {
  const allContacts = await processCSVs('all');
  const reallocate = await processCSVs('reallocate');
  return { allContacts, reallocate };
}

export function writeToOutputCSV(filename, array) {

  const header = Object.keys(array[0]).join(",")+ "\n";

  // console.log(header)

  let csv = header;
  csv += array.map(record => {
    // Merge all values from the record object into a single string
    const mergedValues = mergeObjectValues(record);
    return mergedValues;
  }).join("\n");
  fs.writeFileSync(`./src/output/${filename}.csv`, csv);
}
function mergeObjectValues(obj) {
  const values = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      values.push(obj[key]);
    }
  }
  return values.join(",");
}