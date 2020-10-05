/**
 * Decode a main entry. If successful, the returned pair is the decoded main
 * entry with it's associated id to be able to be directly used to be inserted
 * into a map.
 */
type entryType('a) =
  Locale.order => Json.Decode.decoder(option((int, 'a)));

module type BaseType = {
  type t;
  let decode: Locale.order => Json.Decode.decoder(t);
};

module type SubType = {
  type t;
  type multilingual;
  let decodeMultilingual: Json.Decode.decoder(multilingual);
  let resolveTranslations: (Locale.order, multilingual) => t;
};

module type SubTypeWrapper = {
  type t('a);
  let decodeMultilingual:
    Json.Decode.decoder('a) => Json.Decode.decoder(t('a));
  let resolveTranslations:
    (Locale.order, (Locale.order, 'a) => 'b, t('a)) => t('b);
};
