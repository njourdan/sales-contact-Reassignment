export function dedupeAndTransform(arr, validIds) {
  /* this function takes an array of contacts,  and an array of validids, iterates through the array 
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


  return result;
}
export function winnerTransformArray(data) {
  let newdata = {
    recordId: data['﻿RecordId'], // Use the key to extract 'RecordId'
    newContactOwner: data.mostContactsInOrg[0].user, // Extract 'ContactOwner'
    name: `${data.FirstName} ${data.LastName}`.trim(), // Combine 'FirstName' and 'LastName'
    reason: `${data.mostContactsInOrg[0].user} had ${data.mostContactsInOrg[0].count} out of ${data.totalContactsInOrg} total contacts`
  }
  return newdata

};

export function tieTransformArray(data) {
  let newdata = {
    recordId: data['﻿RecordId'], // Use the key to extract 'RecordId'
    contactOwner: data.mostContactsInOrg.map(contact => contact.user).join(' / '), // Extract 'ContactOwner'
    name: `${data.FirstName} ${data.LastName}`.trim(), // Combine 'FirstName' and 'LastName'
    reason: `the users ${data.mostContactsInOrg.map(contact => contact.user).join(' / ')} had equal amounts of contacts in the Organization`
  }
  return newdata
};
export function noneTransformArray(data) {
  let newdata = {
    recordId: data['﻿RecordId'], // Use the key to extract 'RecordId'
    contactOwner: '',
    name: `${data.FirstName} ${data.LastName}`.trim(), // Combine 'FirstName' and 'LastName'
    reason: `No one owns a contact in this Organization`
  }
  return newdata
};
export function noOrgTransformArray(data) {
  let newdata = {
    recordId: data['﻿RecordId'], // Use the key to extract 'RecordId'
    contactOwner: '',
    name: `${data.FirstName} ${data.LastName}`.trim(), // Combine 'FirstName' and 'LastName'
    reason: `This Contact has no Orgnization`
  }
  return newdata
};