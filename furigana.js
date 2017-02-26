// 'keb' is a phrase and 'reb' is its phonetic reading.
// returns an array of every possible assignment of readings to characters.
// example:
// label('雲も無い', 'くももない')
// ==
// [
//    {
//      'keb': ['雲', 'も', '無', 'い'],
//      'reb': ['く', 'も', 'もな', 'い']
//    },
//    {
//      'keb': ['雲', 'も', '無', 'い'],
//      'reb': ['くも', 'も', 'な', 'い']
//    }
// ]
// If there is only one element in the array then the labeling is unambiguous.

// This should only be used with very small inputs.
// A much more efficient implementation is possible.
function label(keb, reb) {
  let kana = new Set(reb);
  let pieces = [keb[0]];
  let piece_is_kana = [kana.has(keb[0])]; 
  // tokenize keb
  for (let char of keb.substr(1)) {
    let is_kana = kana.has(char);
    if (is_kana == piece_is_kana[pieces.length - 1]) {
      pieces[pieces.length - 1] += char;
    } else {
      pieces.push(char);
      piece_is_kana.push(is_kana);
    }
  }
  // labelings cache
  let cache = new Map();
  let m = Math.max(pieces.length, reb.length);
  function labelings(i, j) {
    if (!cache.has(m * i + j)) {
      cache.set(m * i + j, Array.from(_labelings(i, j)));
    }
    return cache.get(m * i + j);
  }
  // labelings generator
  function* _labelings(i, j) {
    if (i === 0 && j === 0) {
      yield {
        'keb': [],
        'reb': []
      };
    }
    if (i > 0 && j >= i) {
      if (!piece_is_kana[i - 1] || pieces[i - 1] == reb[j - 1]) {
        for (let prefix_labeling of labelings(i - 1, j - 1)) {
          yield {
            'keb': prefix_labeling.keb.concat([pieces[i - 1]]),
            'reb': prefix_labeling.reb.concat([reb[j - 1]])
          };
        }
      }
      if (!piece_is_kana[i - 1]) {
        for (let prefix_labeling of labelings(i, j - 1)) {
          let preb = prefix_labeling.reb;
          yield {
            'keb': prefix_labeling.keb,
            'reb': preb
              .slice(0, -1)
              .concat([preb[preb.length - 1] + reb[j - 1]])
          };
        }
      }
    }
  }
  return labelings(pieces.length, reb.length);
}
