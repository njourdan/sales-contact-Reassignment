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
  const total = result.reduce((acc, cur) => acc + cur.count, 0);
  if(result.length > 0 ){
    // console.log(arr)
  console.log(maxCount, total)}
  const largest = result.filter(obj => obj.count === maxCount);


  return largest;
}
export function winnerTransformArray(data) {
    return data.map(item => {
      return {
        recordId: item['﻿RecordId'], // Use the key to extract 'RecordId'
        contactOwner: item.ContactOwner, // Extract 'ContactOwner'
        name: `${item.FirstName} ${item.LastName}`.trim() // Combine 'FirstName' and 'LastName'
      };
    });
  }
  export function tieTransformArray(data) {
    return data.map(item => {
      return {
        recordId: item['﻿RecordId'], // Use the key to extract 'RecordId'
        contactOwner: item.ContactOwner, // Extract 'ContactOwner'
        name: `${item.FirstName} ${item.LastName}`.trim() // Combine 'FirstName' and 'LastName'
      };
    });
  }