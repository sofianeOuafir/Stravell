export const fromSnapShotToObject = snapshot => {
  if (snapshot.val() === null) {
    return null;
  }
  return { id: snapshot.key, ...snapshot.val() };
};

export const fromSnapShotToArray = (snapshot) => {
  let array = [];
  snapshot.forEach(element => {
    array.push({
      id: element.key,
      ...element.val()
    });
  });
  return array;
}