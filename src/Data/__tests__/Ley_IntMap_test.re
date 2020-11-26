open Jest;
open Expect;
open Ley_IntMap;

let from1to5 =
  fromList([(1, "a"), (2, "b"), (4, "d"), (3, "c"), (5, "e")]);

let from1to11 =
  fromList([
    (9, "i"),
    (5, "e"),
    (8, "h"),
    (2, "b"),
    (11, "k"),
    (4, "d"),
    (10, "j"),
    (1, "a"),
    (6, "f"),
    (3, "c"),
    (7, "g"),
  ]);

describe("Foldable", () => {
  // test("foldr", () =>
  //   expect(foldr((e, acc) => e ++ acc, "l", from1to11))
  //   |> toBe("abcdefghijkl")
  // );

  test("toList", () =>
    expect(toList(from1to11))
    |> toEqual(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"])
  );

  describe("all", () => {
    test("returns true if the predicate matches all elements in the map", () =>
      expect(all(x => x < "f", from1to5)) |> toBe(true)
    );
    test(
      "returns false if the predicate does not match at least one element in the map",
      () =>
      expect(all(x => x < "e", from1to5)) |> toBe(false)
    );
  });
});

// describe ("Query", () => {
//   test ('fnull', () => {
//     expect (IntMap.Foldable.fnull (fromArray ([[1, 'a'], [2, 'b'], [4, 'd']])))
//       .toBeFalsy ()

//     expect (IntMap.Foldable.fnull (fromArray ([]))) .toBeTruthy ()
//   })

//   test ('size', () => {
//     expect (IntMap.size (from1to5)) .toEqual (5)
//     expect (IntMap.size (fromArray ([]))) .toEqual (0)
//   })

//   test ('member', () => {
//     expect (IntMap.member (2, from1to5))
//       .toBeTruthy ()

//     expect (IntMap.member (6, from1to5))
//       .toBeFalsy ()
//   })

//   test ('notMember', () => {
//     expect (IntMap.notMember (2, fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])))
//       .toBeFalsy ()

//     expect (IntMap.notMember (5, fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])))
//       .toBeTruthy ()
//   })

//   test ('lookup', () => {
//     expect (IntMap.lookup (2, fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])))
//       .toEqual (Just ('b'))

//     expect (IntMap.lookup (5, fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])))
//       .toEqual (Nothing)
//   })

//   test ('findWithDefault', () => {
//     expect (
//       IntMap.findWithDefault ('...', 2, fromArray ([[1, 'a'], [2, 'b'], [3, 'c']]))
//     )
//       .toEqual ('b')

//     expect (
//       IntMap.findWithDefault ('...', 5, fromArray ([[1, 'a'], [2, 'b'], [3, 'c']]))
//     )
//       .toEqual ('...')
//   })
// })
