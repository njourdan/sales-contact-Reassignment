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
          if (filename == 'reallocate') {
            // console.log(row);
          }
          data.push(row);
        })
        .on('error', (err) => {
          console.error(err);
          reject(err); // Reject the promise in case of error
        })
        .on('end', () => {
          console.log(`${filename} CSV processed with ${data.length} rows`);
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