import {processContacts, writeToOutputCSV } from './helpers/processCSVs.js';
import {dedupeAndTransform, winnerTransformArray,tieTransformArray} from './helpers/dataTransformation.js'
const saleUserIDs =[2109229,2197147,1930596,1871085,2012130,2104545,2200280,1871087,1871113,1871094,1871088]
async function main() {
  const winner = []
  const tie = []
  const none = []
  try {

    const { allContacts, reallocate } = await processContacts();
    for (let i = 0; i < 250; i++) {
    
    let matches = allContacts.filter(contact => contact.OrganizationRecordId === reallocate[i].OrganizationRecordId)
    let result = await dedupeAndTransform(matches,saleUserIDs)
    // console.log(reallocate[i].ContactOwner)
    let isTie = result.length > 0 ? (result.length === 1 ? 1 : 2) : 0; // 0 for none, 1 for winner, and 2 for tie
    if(!reallocate[i].OrganizationRecordId){
      console.log("skiping ",reallocate[i].FirstName)
      continue // skip the loop if there is no organization id
    }
    if(isTie == 0){
      // none
      none.push(reallocate[i])
    }else if(isTie == 1){
      // winner
      reallocate[i].ContactOwner = result[0].user
      reallocate[i].reason = result
      // console.log(reallocate[i].reason)
      winner.push(reallocate[i])
    }else if(isTie > 1){
      //tie
      // console.log(reallocate[i].OrganizationRecordId)
      // console.log(result)
      reallocate[i].reason = result
      tie.push(reallocate)
    }
    }
    // console.log(tie)

    let winnerinput = winnerTransformArray(winner)
    // let tieinput = tieTransformArray
    writeToOutputCSV('winner',winnerinput)

















  } catch (error) {
    console.error(`Error in main: ${error}`);
  }
 

}

main();
