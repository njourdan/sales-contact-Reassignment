import {parse} from 'csv'
import fs from 'fs'

fs.createReadStream('src/Contacts.csv')
.pipe(
parse({
        columns: true,
        trim: true
}))
.on('data', (row) => {
    console.log(row);
  })
  .on('error', (err) => {
    console.error(err);
  })
  .on('end', () => {
    console.log(data.length);
  });
