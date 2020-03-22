// https://bost.ocks.org/mike/shuffle/
function shuffleInPlace(array) {
  let toShuffle = array.length;
  let temporary;
  let randomIndex;

  // While there remain elements to shuffle…
  while (toShuffle) {

    // Pick a remaining element…
    randomIndex = Math.floor(Math.random() * toShuffle--);

    // And swap it with the current element.
    temporary = array[toShuffle];
    array[toShuffle] = array[randomIndex];
    array[randomIndex] = temporary;
  }

  return array;
}

export function* randomBreakOrder(computers) {
  const ordered = [...new Array(computers).keys()];
  const shuffled = shuffleInPlace(ordered);

  yield* shuffled;
}
