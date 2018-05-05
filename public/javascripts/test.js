function findInterval(value, range) {
  let j = -1;

  // 判断有没有超出范围
  if(value < range[0] || value>range[range.length - 1]) 
    return -1;
  else {
    for(let i in range) {
      if(value >= range[i]){
        j = i;
      }else {
        break;
      }
    }
    return j;
  }
}

function findInterval2(value, range) {
  if(value < range[0] || value>range[range.length - 1])
    return -1;

  // let middleIndex = (range.length%2===0?range.length/2:(range.length-1)/2);
  // let middleIndex = Math.floor((range.length%2===0?(range.length+1)/2:range.length/2));
  let middleIndex = Math.floor(range.length/2);


  if(range.length <= 2) return 0;
  // else if (value === range[middleIndex]) return middleIndex;
  else if (value > range[middleIndex]) {
    return middleIndex + findInterval2(value, range.slice(middleIndex, range.length));
  }else {
    return findInterval2(value, range.slice(0, middleIndex+1));
  }
}

let range1 =[0, 10, 20];
let range2 =[0, 10, 20, 30];
// console.log(findInterval(0, range)); //0
// console.log(findInterval(5, range)); //0
// console.log(findInterval(10, range)); //1
// console.log(findInterval(12, range)); //1
// console.log(findInterval(20, range)); //2
// console.log(findInterval(30, range)); //2
// console.log(findInterval(40, range)); //3
console.log('----------range1--------------');
console.log(findInterval2(0, range1)); //0
console.log(findInterval2(5, range1)); //0
console.log(findInterval2(10, range1)); //0
console.log(findInterval2(12, range1)); //1
console.log(findInterval2(20, range1)); //1

console.log('-----------range2-------------');
console.log(findInterval2(0, range2)); //0
console.log(findInterval2(5, range2)); //0
console.log(findInterval2(10, range2)); //1
console.log(findInterval2(15, range2)); //1
console.log(findInterval2(20, range2)); //1
console.log(findInterval2(25, range2)); //2
console.log(findInterval2(30, range2)); //2