export const isOdd = (number) => {
  if(!number){
    return;
  }
  return number % 2 === 1;
}

export const isMultipleOfThree = (index) => {
  return index % 3 === 0;
}