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
export function dedupeAndTransform(arr, validIds) {
/* thus function takes an array of contacts,  and an array of validids, iterates through the array 
first seeing if the contact is owned by a valid owner, then checks if there is a count object for that owner
if there is none it creates an hash object for the owner, and sets the count to 1, if it finds an existing one then it iterates
the end result is an array that looks something like this
[ { user: 1871085, count: 1 }, { user: 1871113, count: 1 } ]
  next if finds the max, ie the object in the array with the highest count, then returns it.
  if there are multiple it returns multiple
  */
    const counts = {};
  
    arr.forEach(contact => {
      let ownerID = parseInt(contact.ContactOwner.split(";")[0])
      if (validIds.includes(ownerID)) {
        if (counts[ownerID]) {
          counts[ownerID]++;
        } else {
          counts[ownerID] = 1;
        }
      }
    });
  
    const result = Object.keys(counts).map(key => ({
      user: parseInt(key),
      count: counts[key]
    }));
  
    const maxCount = Math.max(...result.map(obj => obj.count));
    const largest = result.filter(obj => obj.count === maxCount);
  
    return largest;
  }