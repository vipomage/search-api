function minStartVal(numArr: number[]) {
  let initial = 0;

  do {
    initial += 1;
  } while (!canSum(numArr, initial));

  return initial;
}

function canSum(numArr: number[], initial: number) {
  for (const num of numArr) {
    if (initial + num < 1) {
      return false;
    }

    initial += num;
  }

  return true;
}

const numArr = [-3, 2, -3, 4, 2];

console.log(minStartVal(numArr));
