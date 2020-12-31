module Dynamic: {
  type dependency = {source: Id.Activatable.t};

  type t = {
    id: int,
    dependencies: list(dependency),
  };
};

module Static: {
  type t = {
    id: int,
    name: string,
    description: option(string),
    isPrerequisite: bool,
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Decode: {let assoc: Json_Decode_Static.decodeAssoc(t);};
};
