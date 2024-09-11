import { processCSVs , processContacts, dedupeAndTransform } from './helpers/processCSVs.js';
const saleUserIDs =[2109229,2197147,1930596,1871085,2012130,2104545,2200280,1871087,1871113,1871094,1871088]
async function main() {
  const winner = []
  const tie = []
  const none = []
  try {

    const { allContacts, reallocate } = await processContacts();
    for (let i = 0; i < reallocate.length; i++) {
      console.log("Iteration: " + i);
    
    let matches = allContacts.filter(contact => contact.OrganizationRecordId === reallocate[i].OrganizationRecordId)
    let result = await dedupeAndTransform(matches,saleUserIDs)
    // console.log(reallocate[i].ContactOwner)
    if(result.length == 0){
      none.push(reallocate[i])
    }else if(result.length == 1){
      reallocate[i].ContactOwner = result[0].user
      // console.log(reallocate[i].ContactOwner)
      winner.push(reallocate[i])
    }else if(result.length > 1){
      console.log(result)
    }
    }
   

















  } catch (error) {
    console.error(`Error in main: ${error}`);
  }
  console.log(winner.length)
}

main();
