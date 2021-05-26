function largestNumber(numArr: number[], length: number) {
  if (length === 1) {
    return numArr[0];
  }

  return Math.max(numArr[length - 1], largestNumber(numArr, length - 1));
}

const numArray: number[] = [1, 2, 10, 5, 99, -1];

console.log(largestNumber(numArray, numArray.length));
