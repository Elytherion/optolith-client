module Category: {
  type t = {
    id: int,
    name: string,
    primaryPatronCultures: Ley_IntSet.t,
  };
};

type t = {
  id: int,
  name: string,
  category: int,
  skills: (int, int, int),
  limitedToCultures: Ley_IntSet.t,
  isLimitedToCulturesReverse: bool,
};

let decode: Decoder.entryType(t);
