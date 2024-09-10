import {parse} from 'csv'
import fs from 'fs'
const contactExport = []
fs.createReadStream('src/Contacts.csv')
.pipe(
parse({
        columns: true,
        trim: true
}))
.on('data', (row) => {
    contactExport.push(row)
  })
  .on('error', (err) => {
    console.error(err)
  })
  .on('end', () => {
    console.log(contactExport.length)
  });