module I = Ley_Int;
module IM = Ley_IntMap;
module IS = Ley_IntSet;
module L = Ley_List;
module O = Ley_Option;

open Activatable_Cache;

type t = {
  minLevel: option(int),
  maxLevel: option(int),
  disabled: bool,
};

// const hasRequiredMinimumLevel =
//   (min_level: Maybe<number>) => (max_level: Maybe<number>): boolean =>
//     isJust (max_level) && isJust (min_level)

let getActivesById = (mp, id) =>
  IM.lookup(id, mp)
  |> O.option([], ({active, _}: Activatable_Dynamic.t) => active);

let isNotRequiredByDependencies =
    (
      hero: Hero.t,
      staticEntry,
      heroEntry: Activatable_Dynamic.t,
      singleEntry: Activatable_Convert.singleWithId,
    ) =>
  heroEntry.dependencies
  // Filter out every dependency that can be matched by another entry
  |> Dependencies.Flatten.flattenActivatableDependencies(
       switch (staticEntry) {
       | Static.Advantage(_) => getActivesById(hero.advantages)
       | Disadvantage(_) => getActivesById(hero.disadvantages)
       | SpecialAbility(_) => getActivesById(hero.specialAbilities)
       },
       singleEntry.id,
     )
  |> L.all((dep: Activatable_Dynamic.dependency) =>
       !
         Dependencies.Activatable.isDependencyMatched(
           dep,
           Activatable_Convert.singleWithIdToSingle(singleEntry),
         )
       // If the entry matched the dependency, try if other activations of the
       // same entry may still satisfy the dependency, so that it can still be
       // removed
       || L.Index.deleteAt(singleEntry.index, heroEntry.active)
       |> L.any(Dependencies.Activatable.isDependencyMatched(dep))
     );

let isEntrySpecificRemovalValid =
    (
      cache,
      staticData,
      hero,
      staticEntry,
      heroEntry: Activatable_Dynamic.t,
      singleEntry: Activatable_Convert.singleWithId,
    ) =>
  if (Tradition.Magical.isTraditionId(staticData, singleEntry.id)) {
    let activeTraditions = cache.magicalTraditions;

    let hasMultipleTraditions = L.length(activeTraditions) > 1;

    hasMultipleTraditions
    || !ActivatableSkills.hasActiveSkillEntries(Spells, hero)
    && IS.null(hero.cantrips);
  } else if (Tradition.Blessed.isTraditionId(staticData, singleEntry.id)) {
    !ActivatableSkills.hasActiveSkillEntries(LiturgicalChants, hero)
    && IS.null(hero.blessings);
  } else {
    switch (staticEntry) {
    | Static.Advantage(staticAdvantage) =>
      [@warning "-4"]
      Id.Advantage.(
        switch (fromInt(staticAdvantage.id)) {
        | ExceptionalSkill =>
          switch (singleEntry.options) {
          | [Preset(Skill(id)), ..._] =>
            // value of target skill
            let value =
              IM.lookup(id, hero.skills) |> Skill.Dynamic.getValueDef;

            // amount of active Exceptional Skill advantages for the same skill
            let countSameSkill =
              L.countBy(
                (active: Activatable_Dynamic.single) =>
                  switch (active.options) {
                  | [Preset(Skill(otherId)), ..._] => otherId === id
                  | _ => false
                  },
                heroEntry.active,
              );

            // if the maximum skill rating is reached removal needs to be
            // disabled
            value >= cache.startExperienceLevel.maxSkillRating + countSameSkill;
          | _ => true
          }
        | ExceptionalCombatTechnique =>
          switch (singleEntry.options) {
          | [Preset(CombatTechnique(id)), ..._] =>
            // value of target combat technique
            let value =
              IM.lookup(id, hero.combatTechniques)
              |> CombatTechnique.Dynamic.getValueDef;

            // if the maximum combat technique rating is reached removal needs
            // to be disabled
            value >= cache.startExperienceLevel.maxCombatTechniqueRating + 1;
          | _ => true
          }
        | _ => true
        }
      )
    | Disadvantage(_) => true
    | SpecialAbility(staticSpecialAbility) =>
      [@warning "-4"]
      Id.SpecialAbility.(
        switch (fromInt(staticSpecialAbility.id)) {
        | Literacy =>
          switch (
            cache.matchingLanguagesScripts.isEntryActiveRequiringMatch,
            cache.matchingLanguagesScripts.scriptsWithMatchingLanguages,
            singleEntry.options,
          ) {
          // requiring entry must be active, the list of scripts must contain
          // only one element and that element has to match the current script
          // to prohibit removing the entry
          | (
              true,
              [onlyScriptWithLanguage],
              [Preset(Generic(scriptId)), ..._],
            ) =>
            onlyScriptWithLanguage !== scriptId
          | _ => true
          }
        | Language =>
          switch (
            cache.matchingLanguagesScripts.isEntryActiveRequiringMatch,
            cache.matchingLanguagesScripts.languagesWithMatchingScripts,
            singleEntry.options,
          ) {
          // requiring entry must be active, the list of languages must contain
          // only one element and that element has to match the current language
          // to prohibit removing the entry
          | (
              true,
              [onlyLanguageWithScript],
              [Preset(Generic(languageId)), ..._],
            ) =>
            onlyLanguageWithScript !== languageId
          | _ => true
          }
        | PropertyKnowledge =>
          switch (singleEntry.options) {
          | [Preset(Generic(propertyId)), ..._] =>
            hero.spells
            // If there is any spell with matching property above SR 14...
            |> IM.any((heroSpell: ActivatableSkill.Dynamic.t) =>
                 ActivatableSkill.Dynamic.valueToInt(heroSpell.value) > 14
                 && IM.lookup(heroSpell.id, staticData.spells)
                 |> O.option(true, ({Spell.Static.property, _}) =>
                      property === propertyId
                    )
               )
            // ...prohibit removal
            |> (!)
          | _ => true
          }
        | AspectKnowledge =>
          let activeAspects =
            Activatable_SelectOptions.mapActiveOptions1(
              fun
              | Preset(Generic(aspectId)) => Some(aspectId)
              | _ => None,
              heroEntry,
            )
            |> IS.fromList;

          switch (singleEntry.options) {
          | [Preset(Generic(aspectId)), ..._] =>
            let otherAspects = IS.delete(aspectId, activeAspects);

            hero.liturgicalChants
            // If there is any liturgical chant with matching aspect
            // above SR 14 and no other aspect knowledges for that entry...
            |> IM.any((heroLiturgicalChant: ActivatableSkill.Dynamic.t) =>
                 ActivatableSkill.Dynamic.valueToInt(
                   heroLiturgicalChant.value,
                 )
                 > 14
                 && IM.lookup(
                      heroLiturgicalChant.id,
                      staticData.liturgicalChants,
                    )
                 |> O.option(true, ({LiturgicalChant.Static.aspects, _}) =>
                      IS.member(aspectId, aspects)
                      && IS.disjoint(otherAspects, aspects)
                    )
               )
            // ...prohibit removal
            |> (!);
          | _ => true
          };
        | CombatStyleCombination =>
          let activeArmedStyles = cache.armedCombatStylesCount;
          let activeUnarmedStyles = cache.unarmedCombatStylesCount;

          let totalActive = activeArmedStyles + activeUnarmedStyles;

          // default is 1 per group (armed/unarmed), but with this SA 1 more in
          // one group: maximum of 3, but max 2 per group. If max is reached,
          // this SA cannot be removed
          totalActive < 3 && (activeArmedStyles < 2 || activeUnarmedStyles < 2);
        | MagicStyleCombination =>
          // default is 1, but with this SA its 2. If it's 2 this SA is
          // neccessary and cannot be removed
          cache.magicalStylesCount < 2
        | Zugvoegel
        | JaegerinnenDerWeissenMaid
        | AnhaengerDesGueldenen =>
          switch (cache.blessedTradition) {
          | Some((_, _, blessedTradition)) =>
            hero.liturgicalChants
            // Filter liturgical chants...
            |> IM.mapMaybe(
                 fun
                 // ...so that only the active ones remain...
                 | {ActivatableSkill.Dynamic.id, value: Active(_), _} =>
                   // ...and replace with their static entry.
                   IM.lookup(id, staticData.liturgicalChants)
                 | _ => None,
               )
            // Check if there is any active entry that does not belong to the
            // active tradition...
            |> IM.any(({LiturgicalChant.Static.traditions, _}) =>
                 IS.notElem(blessedTradition.numId, traditions)
               )
            // ...which would prohibit removal
            |> (!)
          | None => true
          }
        | _ => true
        }
      )
    };
  };

let isStyleSpecialAbilityRemovalValid = (hero, staticEntry) =>
  switch (staticEntry) {
  | Static.Advantage(_)
  | Disadvantage(_) => true
  | SpecialAbility(specialAbility) =>
    Activatable_ExtendedStyle.isStyleValidToRemove(hero, specialAbility)
  };

/**
 * `getMinLevelForIncreaseEntry defaultAmount currentAmount` returns the minimum
 * level for an "increase entry", which is an entry that allows to get more
 * specific values or entries than usually allowed. `currentAmount` is the
 * current amount of specific values or entries used and `defaultAmount` the
 * default amount allowed.
 */
let getMinLevelForIncreaseEntry = (defaultAmount, currentAmount) =>
  currentAmount > defaultAmount ? Some(currentAmount - defaultAmount) : None;

/**
 * `getMaxLevelForDecreaseEntry defaultAmount currentAmount` returns the maximum
 * level for a "decrease entry", which is an entry that disallows to get as many
 * specific values or entries as usually allowed. `currentAmount` is the current
 * amount of specific values or entries used and `defaultAmount` the default
 * amount allowed.
 */
let getMaxLevelForDecreaseEntry = (maxDecrease, current) =>
  I.max(0, maxDecrease - current);

let getEntrySpecificMinLevel =
    (cache, staticData: Static.t, hero, staticEntry) =>
  switch (staticEntry) {
  | Static.Advantage(staticAdvantage) =>
    [@warning "-4"]
    Id.Advantage.(
      switch (fromInt(staticAdvantage.id)) {
      | LargeSpellSelection =>
        hero
        |> ActivatableSkills.countActiveSkillEntries(Spells)
        |> getMinLevelForIncreaseEntry(3)
      | ZahlreichePredigten =>
        EntryGroups.SpecialAbility.countActiveFromGroup(
          Predigten,
          cache.specialAbilityPairs,
        )
        |> getMinLevelForIncreaseEntry(3)
      | ZahlreicheVisionen =>
        EntryGroups.SpecialAbility.countActiveFromGroup(
          Visionen,
          cache.specialAbilityPairs,
        )
        |> getMinLevelForIncreaseEntry(3)
      | _ => None
      }
    )
  | Disadvantage(_) => None
  | SpecialAbility(staticSpecialAbility) =>
    [@warning "-4"]
    Id.SpecialAbility.(
      switch (fromInt(staticSpecialAbility.id)) {
      | Imitationszauberei =>
        hero.spells
        |> IM.countWith(({ActivatableSkill.Dynamic.id, _}) =>
             IM.lookup(id, staticData.spells)
             |> O.option(false, ({Spell.Static.gr, _}) =>
                  gr === Id.Spell.Group.toInt(Spells)
                )
           )
        // Minimum level must be the number of active spells, if there are any
        |> O.ensure(count => count > 0)
      | _ => None
      }
    )
  };

let getEntrySpecificMaxLevel = (cache, hero, staticEntry) =>
  switch (staticEntry) {
  | Static.Advantage(_) => None
  | Disadvantage(staticDisadvantage) =>
    [@warning "-4"]
    Id.Disadvantage.(
      switch (fromInt(staticDisadvantage.id)) {
      | SmallSpellSelection =>
        hero
        |> ActivatableSkills.countActiveSkillEntries(Spells)
        |> getMaxLevelForDecreaseEntry(3)
        |> O.return
      | WenigePredigten =>
        EntryGroups.SpecialAbility.countActiveFromGroup(
          Predigten,
          cache.specialAbilityPairs,
        )
        |> getMaxLevelForDecreaseEntry(3)
        |> O.return
      | WenigeVisionen =>
        EntryGroups.SpecialAbility.countActiveFromGroup(
          Visionen,
          cache.specialAbilityPairs,
        )
        |> getMaxLevelForDecreaseEntry(3)
        |> O.return
      | _ => None
      }
    )
  | SpecialAbility(staticSpecialAbility) =>
    [@warning "-4"]
    Id.SpecialAbility.(
      switch (fromInt(staticSpecialAbility.id)) {
      | DunklesAbbildDerBuendnisgabe =>
        O.Infix.(hero.pact <&> (pact => pact.level))
      | _ => None
      }
    )
  };

let adjustMinLevelByDependencies =
    ({Activatable_Dynamic.dependencies, _}, singleEntry, maybeMinLevel) =>
  L.foldr(
    (dependency: Activatable_Dynamic.dependency, maybeMinLevel) =>
      switch (dependency.level) {
      | Some(definedLevel) =>
        // get the level dependency from the object and ensure it's
        // greater than the current minimum level and that...
        definedLevel > O.sum(maybeMinLevel)
        // ...if the dependency defines options, too, the entry must match them
        // as well. A dependency without options is valid for all entries (in
        // case of calculating a minimum level)
        && Dependencies.Activatable.areOptionDependenciesMatched(
             dependency,
             Activatable_Convert.singleWithIdToSingle(singleEntry),
           )
          ? Some(definedLevel) : maybeMinLevel
      | None => maybeMinLevel
      },
    maybeMinLevel,
    dependencies,
  );

/**
 * Get minimum valid level.
 */
let getMinLevel =
    (cache, staticData, hero, staticEntry, heroEntry, singleEntry) =>
  getEntrySpecificMinLevel(cache, staticData, hero, staticEntry)
  |> adjustMinLevelByDependencies(heroEntry, singleEntry);

let getMaxLevel = (cache, staticData, hero, staticEntry) => {
  let entrySpecificMaxLevel =
    getEntrySpecificMaxLevel(cache, hero, staticEntry);

  let maxPossibleWithPrerequisites =
    Prerequisites.Validation.getMaxLevel(
      staticData,
      hero,
      staticEntry |> Activatable_Accessors.id |> Id.Activatable.toAll,
      Prerequisites.Activatable.getLevelPrerequisites(staticEntry),
    );

  O.Infix.(
    O.liftM2(I.min, entrySpecificMaxLevel, maxPossibleWithPrerequisites)
    <|> entrySpecificMaxLevel
    <|> maxPossibleWithPrerequisites
  );
};

/**
 * Checks if the given active entry can be removed or changed in level.
 */
let isRemovalOrModificationValid =
    (cache, staticData, hero, staticEntry, heroEntry, singleEntry) => {
  let minLevel =
    getMinLevel(cache, staticData, hero, staticEntry, heroEntry, singleEntry);

  let maxLevel = getMaxLevel(cache, staticData, hero, staticEntry);

  {
    disabled:
      O.isSome(minLevel)
      || !
           isNotRequiredByDependencies(
             hero,
             staticEntry,
             heroEntry,
             singleEntry,
           )
      || !isStyleSpecialAbilityRemovalValid(hero, staticEntry)
      || !
           isEntrySpecificRemovalValid(
             cache,
             staticData,
             hero,
             staticEntry,
             heroEntry,
             singleEntry,
           ),
    maxLevel,
    minLevel,
  };
};
