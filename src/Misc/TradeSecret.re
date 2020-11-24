type t = {
  id: int,
  name: string,
  description: option(string),
  apValue: int,
  isSecretKnowledge: bool,
  prerequisites: Prerequisite.Collection.Profession.t,
  src: list(PublicationRef.t),
  errata: list(Erratum.t),
};

module Decode = {
  module Translation = {
    type t = {
      name: string,
      description: option(string),
      errata: option(list(Erratum.t)),
    };

    let t = json =>
      JsonStrict.{
        name: json |> field("name", string),
        description: json |> optionalField("description", string),
        errata: json |> optionalField("errata", Erratum.Decode.list),
      };
  };

  module TranslationMap = TranslationMap.Make(Translation);

  type multilingual = {
    id: int,
    apValue: int,
    isSecretKnowledge: bool,
    prerequisites:
      option(Prerequisite.Collection.Profession.Decode.multilingual),
    src: list(PublicationRef.Decode.multilingual),
    translations: TranslationMap.t,
  };

  let multilingual = json =>
    JsonStrict.{
      id: json |> field("id", int),
      apValue: json |> field("apValue", int),
      isSecretKnowledge: json |> field("isSecretKnowledge", bool),
      prerequisites:
        json
        |> optionalField(
             "prerequisites",
             Prerequisite.Collection.Profession.Decode.multilingual,
           ),
      src: json |> field("src", PublicationRef.Decode.multilingualList),
      translations: json |> field("translations", TranslationMap.Decode.t),
    };

  let resolveTranslations = (langs, x) =>
    Ley_Option.Infix.(
      x.translations
      |> TranslationMap.Decode.getFromLanguageOrder(langs)
      <&> (
        translation => {
          id: x.id,
          name: translation.name,
          description: translation.description,
          apValue: x.apValue,
          isSecretKnowledge: x.isSecretKnowledge,
          prerequisites:
            x.prerequisites
            |> Ley_Option.option(
                 [],
                 Prerequisite.Collection.Profession.Decode.resolveTranslations(
                   langs,
                 ),
               ),
          src: PublicationRef.Decode.resolveTranslationsList(langs, x.src),
          errata: translation.errata |> Ley_Option.fromOption([]),
        }
      )
    );

  let t = (langs, json) =>
    json |> multilingual |> resolveTranslations(langs);

  let toAssoc = (x: t) => (x.id, x);

  let assoc = Decoder.decodeAssoc(t, toAssoc);
};
