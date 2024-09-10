import { processCSVs , processContacts } from './helpers/processCSVs.js';

async function main() {
  try {
    const { allContacts, reallocate } = await processContacts();

    console.log(reallocate[5800].OrganizationRecordId)
    let matches = allContacts.filter(contact => contact.OrganizationRecordId === reallocate[5800].OrganizationRecordId)
    console.log(matches)
    // for (let i = 0; i < reallocate.length; i++) {
    //   console.log("Iteration: " + i);
    // }

  } catch (error) {
    console.error('Error processing CSV files:', error);
  }
}

main();
