# 'keb' is a phrase and 'reb' is its phonetic reading.
# returns an array of every possible assignment of readings to characters.
# example:
# label('雲も無い', 'くももない')
# ==
# [
#        {
#            'keb': ['雲', 'も', '無', 'い'],
#            'reb': ['く', 'も', 'もな', 'い']
#        },
#        {
#            'keb': ['雲', 'も', '無', 'い'],
#            'reb': ['くも', 'も', 'な', 'い']
#        }
# ]
# If there is only one element in the array then the labeling is unambiguous.

# This should only be used with very small inputs.
# A much more efficient implementation is possible.


def label(keb, reb):
    kana = set(reb)
    pieces = [keb[0]]
    piece_is_kana = [keb[0] in kana]
    # tokenize keb
    for char in keb[1:]:
        is_kana = char in kana
        if is_kana == piece_is_kana[-1]:
            pieces[-1] += char
        else:
            pieces.append(char)
            piece_is_kana.append(is_kana)
    # labelings cache
    cache = {}

    def labelings(i, j):
        if (i, j) not in cache:
            cache[(i, j)] = list(_labelings(i, j))
        return cache[(i, j)]
    # labelings generator

    def _labelings(i, j):
        if i == j == 0:
            yield {
                'keb': [],
                'reb': []
            }
        if 0 < i <= j:
            piece = pieces[i - 1]
            if piece_is_kana[i - 1] and reb[:j].endswith(piece):
                for prefix_labeling in labelings(i - 1, j - len(piece)):
                    yield {
                        'keb': prefix_labeling['keb'] + [piece],
                        'reb': prefix_labeling['reb'] + [piece]
                    }
            if not piece_is_kana[i - 1]:
                for prefix_labeling in labelings(i - 1, j - 1):
                    yield {
                        'keb': prefix_labeling['keb'] + [piece],
                        'reb': prefix_labeling['reb'] + [reb[j - 1]]
                    }
                for prefix_labeling in labelings(i, j - 1):
                    preb = prefix_labeling['reb']
                    yield {
                        'keb': prefix_labeling['keb'],
                        'reb': preb[:-1] + [preb[-1] + reb[j - 1]]
                    }
    return labelings(len(pieces), len(reb))
