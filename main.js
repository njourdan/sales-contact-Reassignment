import {processContacts, writeToOutputCSV } from './helpers/processCSVs.js';
import {dedupeAndTransform, winnerTransformArray,tieTransformArray} from './helpers/dataTransformation.js'
const saleUserIDs =[2109229,2197147,1930596,1871085,2012130,2104545,2200280,1871087,1871113,1871094,1871088]
async function main() {
  const winner = []
  const tie = []
  const none = []
    const { allContacts, reallocate } = await processContacts();
    for (let i = 0; i < 250; i++) {
    if(reallocate[i].OrganizationRecordId){
    let matches = allContacts.filter(contact => contact.OrganizationRecordId === reallocate[i].OrganizationRecordId)

    let salesOrgContactCount = await dedupeAndTransform(matches,saleUserIDs) //

    let totalContactsInOrg = salesOrgContactCount.reduce((acc, cur) => acc + cur.count, 0);

    let mostContactsInOrg = salesOrgContactCount.filter(obj => obj.count === Math.max(...salesOrgContactCount.map(item => item.count)));

    reallocate[i].salesOrgContactCount= salesOrgContactCount
    reallocate[i].totalContactsInOrg = totalContactsInOrg
    reallocate[i].mostContactsInOrg = mostContactsInOrg
    if(reallocate[i].totalContactsInOrg == 0){
      //logic for N/A

    }else if(reallocate[i].salesOrgContactCount.length == 1){
      // logic for win
      const winnerInput = await winnerTransformArray(reallocate[i])
      console.log(winnerInput)
      winner.push(winnerInput)
    }else if(reallocate[i].salesOrgContactCount.length > 1){
      // logic for tie
    }
    } else {
      // no org

    }
    } 
    writeToOutputCSV('winner',winner)

  }
main();
