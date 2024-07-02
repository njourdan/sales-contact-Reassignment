import fs from 'fs';
import csv from 'csv-parser';
import { limitedInsightlyCall } from './src/APICalls.js';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';

async function main(cid) {
  let contact = await limitedInsightlyCall(`Contact/${cid}`, {});
  if(!contact.ORGANISATION_ID){
  
  }
  let conOrg = await limitedInsightlyCall(`Organisation/${contact.ORGANISATION_ID}`, {});

  const filteredLinks = conOrg.LINKS.filter(link => link.LINK_OBJECT_NAME === 'Contact');
  const orgContactIDS = filteredLinks.map(link => link.LINK_OBJECT_ID);

  const orgContactPromises = orgContactIDS.map(async element => {
    return await limitedInsightlyCall(`Contact/${element}`, {});
  });

  const orgContacts = await Promise.all(orgContactPromises);
  const arrayOfOwners = orgContacts.map(x => x.OWNER_USER_ID);
  const win = dedupeAndTransform(arrayOfOwners, SP);

  if (win.length === 0) {
    return { type: 'noWinner', cid: cid };
  } else if (win.length === 1) {
    return { type: 'winner', cid: cid, winner: win[0].user };
  } else if (win.length > 1) {
    return { type: 'tie', cid: cid };
  }
}

function dedupeAndTransform(arr, validIds) {
  const counts = {};

  arr.forEach(id => {
    if (validIds.includes(id)) {
      if (counts[id]) {
        counts[id]++;
      } else {
        counts[id] = 1;
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

async function processContacts() {
  const contacts = [];
  fs.createReadStream('contacts.csv')
    .pipe(parse({ columns: true }))
    .on('data', (row) => {
      contacts.push(row.ContactID);
    })
    .on('end', async () => {
      const winnerData = [];
      const noWinnerData = [];
      const tieData = [];
      for (const cid of contacts) {
        console.log(cid)
        const result = await main(cid);
        if (result.type === 'winner') {
            console.log('Winner Winner Chicken Dinner')
          winnerData.push({ ContactID: result.cid, Winner: result.winner });
        } else if (result.type === 'noWinner') {
          noWinnerData.push({ Contact: result.cid });
        } else if (result.type === 'tie') {
          tieData.push({ ContactID: result.cid });
        }
      }

      // Write to winner.csv
      stringify(winnerData, { header: true, columns: { ContactID: 'ContactID', Winner: 'Winner' } }, (err, output) => {
        if (err) throw err;
        fs.writeFileSync('winner.csv', output);
      });

      // Write to noWinner.csv
      stringify(noWinnerData, { header: true, columns: { Contact: 'Contact' } }, (err, output) => {
        if (err) throw err;
        fs.writeFileSync('noWinner.csv', output);
      });

      // Write to tie.csv
      stringify(tieData, { header: true, columns: { ContactID: 'ContactID' } }, (err, output) => {
        if (err) throw err;
        fs.writeFileSync('tie.csv', output);
      });
    });
}

const SP = [1871081, 1871085, 1871087, 1871088, 1871113, 1930596, 2012130, 2104545, 2109229];

// Call processContacts to start processing the contacts from the CSV
processContacts();
