open SelectOption;
open Ley_Option;
open Activatable_Accessors;
open Activatable_SelectOptions;

module F = Ley_Function;
module SO = SelectOption;
module SOM = SelectOption.Map;
module L = Ley_List;
module O = Ley_Option;
module T = Ley_Transducer;
module IM = Ley_IntMap;
module IS = Ley_IntSet;

open T;

/**
 * Test if the id of the passed select option is activated for the passed
 * `ActivatableDependent`.
 */
let isNotActive = maybeHeroEntry =>
  maybeHeroEntry
  |> O.option([], getActiveSelectOptions1)
  |> ((activeSelections, {id, _}: SO.t) => L.notElem(id, activeSelections));

/**
 * Test if a select option is not activated more than once for the passed
 * `ActivatableDependent`.
 */
let areNoSameActive = maybeHeroEntry =>
  maybeHeroEntry
  |> O.option([], getActiveSelectOptions1)
  |> (
    (activeSelections, {id, _}: SO.t) => L.countMax(id, 1, activeSelections)
  );

/**
 * `isNotRequired otherActivatables maybeHeroEntry so` returns if the id of the
 * passed select option `so` is required for the passed Activatable
 * `maybeHeroEntry`. `otherActivatables` should be a map of the Activatables
 * from the same group ()
 */
let isNotRequired = (otherActivatables, maybeHeroEntry) =>
  maybeHeroEntry
  |> O.option(
       [],
       Dependencies.Flatten.getRequiredSelectOptions1(otherActivatables),
     )
  |> (
    (applicableOptions, {id, _}: SO.t) =>
      L.all(
        fun
        | OneOrMany.One(option) => Id.Activatable.SelectOption.(option != id)
        | Many(options) => L.notElem(id, options),
        applicableOptions,
      )
  );

/**
 * `isNotRequiredNotActive :: Maybe ActivatableDependent -> SelectOption -> Bool`
 *
 * Test if the id of the passed select option is neither required nor activated
 * for the passed `ActivatableDependent`.
 */
let isNotRequiredNotActive = (otherActivatables, maybeHeroEntry) => {
  let isNoActiveSelection = isNotActive(maybeHeroEntry);
  let isNoRequiredSelection =
    isNotRequired(otherActivatables, maybeHeroEntry);

  so => isNoActiveSelection(so) && isNoRequiredSelection(so);
};

/**
 * Returns a transducer to check if an item is available and if their
 * prerequisites are met.
 */
let isValid = (staticData: Static.t, hero: Hero.t, entryId, fold) =>
  fold
  >>~ EntryAvailability.isAvailableNull(
        (x: SelectOption.t) => x.src,
        staticData.publications,
        hero.rules,
      )
  >>~ (
    x =>
      x.prerequisites
      |> Prerequisite.Collection.ByLevel.getFirstLevel
      |> Ley_List.map(Prerequisite.General.unify)
      |> Prerequisites.Validation.arePrerequisitesMet(
           staticData,
           hero,
           entryId,
         )
  );

/**
 * Returns a transducer to check if an item is available, if their
 * prerequisites are met, and if its neither active nor required.
 */
let isNoGenericRequiredOrActiveSelection =
    (staticData, hero, maybeHeroEntry, otherActivatables, entryId, fold) =>
  fold
  |> isValid(staticData, hero, entryId)
  >>~ isNotRequiredNotActive(otherActivatables, maybeHeroEntry);

/**
 * Returns a transducer to check if an item is available, if their
 * prerequisites are met, and if its not required.
 */
let isNoGenericRequiredSelection =
    (staticData, hero, maybeHeroEntry, otherActivatables, entryId, fold) =>
  fold
  |> isValid(staticData, hero, entryId)
  >>~ isNotRequired(otherActivatables, maybeHeroEntry);

/**
 * From a list of spell select options, only return the ones that match the
 * predicate.
 */
let filterSpellSelectOptions = (pred, fold) =>
  fold
  >>~ (
    (x: SelectOption.t) =>
      [@warning "-4"]
      (
        switch (x.staticEntry) {
        | Some(Spell(spell)) => Some(spell)
        | _ => None
        }
      )
      |> O.option(false, pred)
  );

let getAvailableSelectOptionsTransducer =
    (
      staticData: Static.t,
      hero: Hero.t,
      magicalTraditions,
      staticEntry,
      maybeHeroEntry,
    ) => {
  // Prefill some parameters
  let isValidShort = isValid(staticData, hero);

  // Prefill some parameters
  let isNoGenericRequiredOrActiveSelectionShort =
    isNoGenericRequiredOrActiveSelection(staticData, hero, maybeHeroEntry);

  // Prefill some parameters
  let isNoGenericRequiredSelectionShort =
    isNoGenericRequiredSelection(staticData, hero, maybeHeroEntry);

  switch ((staticEntry: Static.activatable)) {
  | Advantage(staticAdvantage) =>
    let id = Id.All.Advantage(staticAdvantage.id);

    let isNoRequiredOrActiveSelection =
      isNoGenericRequiredOrActiveSelectionShort(hero.advantages, id);

    let isNoRequiredSelection =
      isNoGenericRequiredSelectionShort(hero.advantages, id);

    [@warning "-4"]
    (
      switch (Id.Advantage.fromInt(staticAdvantage.id)) {
      | ExceptionalSkill =>
        Some(
          fold =>
            // There shouldnt be more than two activations for the same skill
            fold |> isNoRequiredSelection >>~ areNoSameActive(maybeHeroEntry),
        )
      | _ => Some(isNoRequiredOrActiveSelection)
      }
    );
  | Disadvantage(staticDisadvantage) =>
    let id = Id.All.Disadvantage(staticDisadvantage.id);

    let isNoRequiredOrActiveSelection =
      isNoGenericRequiredOrActiveSelectionShort(hero.disadvantages, id);

    [@warning "-4"]
    (
      switch (Id.Disadvantage.fromInt(staticDisadvantage.id)) {
      | PersonalityFlaw =>
        // List of unique active select options
        let uniqueSelections =
          O.option(
            [],
            heroEntry =>
              heroEntry
              |> mapActiveOptions1(
                   fun
                   | Preset(Generic(id)) => Some(id)
                   | _ => None,
                 ),
            maybeHeroEntry,
          );

        // Checks if the passed id either matches the passed select option's id
        // and is already active.
        let isInfiniteActive = (id, selectOption: SO.t) =>
          selectOption.id == Generic(id) && L.elem(id, uniqueSelections);

        // Checks if the passed select option is Prejudice and if Prejudice is
        // already active.
        let isPrejudiceAndActive = isInfiniteActive(7);

        // Checks if the passed select option is Unworldly and if Unworldly is
        // already active.
        let isUnworldlyAndActive = isInfiniteActive(8);

        // Checks if the passed select option is not active, not required and if
        // there is a maximum of one other unique select option of this entry
        // active.
        let isNotActiveAndMaxNotReached = selectOption =>
          isNotRequiredNotActive(
            hero.disadvantages,
            maybeHeroEntry,
            selectOption,
          )
          && L.lengthMax(1, uniqueSelections);

        Some(
          fold =>
            fold
            |> isValidShort(Disadvantage(staticDisadvantage.id))
            >>~ (
              x =>
                // If Prejudice is active, it can be activated multiple times
                isPrejudiceAndActive(x)
                // If Unworldly is active, it can be activated multiple times
                || isUnworldlyAndActive(x)
                // If the select option has not been activated yet, there must be
                // a maximum of one other unique activations, since only a maximum
                // of two unique is allowed
                || isNotActiveAndMaxNotReached(x)
            ),
        );
      | NegativeTrait
      | Maimed => Some(isNoRequiredOrActiveSelection)
      | Incompetent =>
        // Checks if the advantage with the passed id is active
        let isAdvActive = id =>
          IM.lookup(Id.Advantage.toInt(id), hero.advantages) |> isActiveM;

        // Checks if the passed select option does not represent a social skill
        let isNotSocialSkill = (so: SO.t) =>
          switch (so.id) {
          | Skill(id) =>
            IM.lookup(id, staticData.skills)
            |> O.any((skill: Skill.Static.t) =>
                 skill.gr === Id.Skill.Group.toInt(Social)
               )
            |> (!)
          | _ => true
          };

        Some(
          fold =>
            fold
            |> isNoRequiredOrActiveSelection
            >>~ (
              x =>
                // Socially Adaptable and Inspire Confidence
                // require no Incompetence in social skills
                isAdvActive(SociallyAdaptable)
                || isAdvActive(InspireConfidence)
                  ? isNotSocialSkill(x) : true
            ),
        );
      | _ => Some(isNoRequiredOrActiveSelection)
      }
    );
  | SpecialAbility(staticSpecialAbility) =>
    let id = Id.All.SpecialAbility(staticSpecialAbility.id);

    let isNoRequiredOrActiveSelection =
      isNoGenericRequiredOrActiveSelectionShort(hero.specialAbilities, id);

    let isNoRequiredSelection =
      isNoGenericRequiredSelectionShort(hero.specialAbilities, id);

    [@warning "-4"]
    (
      switch (Id.SpecialAbility.fromInt(staticSpecialAbility.id)) {
      | SkillSpecialization =>
        let isFirstSpecializationValid = id =>
          IM.lookup(id, hero.skills)
          |> O.option(false, (skill: Skill.Dynamic.t)
               // Skill Rating must be at least 6 for 1st specialization
               => skill.value >= 6);

        let isAdditionalSpecializationValid =
            (counter, selectOption: SO.t, id) =>
          liftM2(
            (skill: Skill.Dynamic.t, activeApps) =>
              // Maximum of three is allowed
              L.lengthMax(2, activeApps)
              // Skill Rating must be at least 6/12/18 for 1st/2nd/3rd specialization
              && skill.value >= (L.length(activeApps) + 1)
              * 6,
            IM.lookup(id, hero.skills),
            SOM.lookup(selectOption.id, counter),
          )
          |> O.dis;

        let counter = O.Infix.(maybeHeroEntry <&> getActiveOptions2Map);

        Some(
          fold =>
            fold
            |> isNoRequiredSelection
            >>~ (
              switch (counter) {
              // if counter is available, maybeHeroEntry must be a Some and thus there
              // can be active selections
              | Some(counter) => (
                  selectOption =>
                    switch (selectOption.id) {
                    | Skill(id) =>
                      SOM.member(selectOption.id, counter)
                        ? isAdditionalSpecializationValid(
                            counter,
                            selectOption,
                            id,
                          )
                        : isFirstSpecializationValid(id)
                    | _ => true
                    }
                )
              // otherwise we only need to check if the skill rating is at least 6, as
              // there can't be an activated selection then.
              | None => (
                  selectOption =>
                    switch (selectOption.id) {
                    | Skill(id) => isFirstSpecializationValid(id)
                    | _ => true
                    }
                )
              }
            )
            <&~ (
              (selectOption: SO.t) => {
                let maybeCurrentCount =
                  O.Infix.(counter >>= SOM.lookup(selectOption.id));

                selectOption
                // Increase cost if there are active specializations
                // for the same skill
                |> O.liftDef(selectOption =>
                     O.liftM2(
                       (currentCount, selectOptionCost) =>
                         {
                           ...selectOption,
                           apValue:
                             Some(
                               selectOptionCost * (L.length(currentCount) + 1),
                             ),
                         },
                       maybeCurrentCount,
                       selectOption.apValue,
                     )
                   )
                |> O.liftDef((selectOption: SO.t) =>
                     Ley_Option.Infix.(
                       (
                         switch (selectOption.staticEntry) {
                         | Some(Skill(skill)) => Some(skill)
                         | _ => None
                         }
                       )
                       <&> (
                         skill =>
                           skill.applications
                           |> IM.elems
                           |> L.filter(
                                (application: Skill.Static.Application.t) => {
                                // An application can only be selected once
                                let isInactive =
                                  O.all(
                                    L.notElem(
                                      Id.Activatable.Option.Preset(
                                        Generic(application.id),
                                      ),
                                    ),
                                    maybeCurrentCount,
                                  );

                                // New applications must have valid prerequisites
                                let hasValidPrerequisites =
                                  Prerequisites.Validation.arePrerequisitesMet(
                                    staticData,
                                    hero,
                                    id,
                                    switch (application.prerequisite) {
                                    | Some(prerequisite) => [
                                        {
                                          value: Activatable(prerequisite),
                                          displayOption: Generate,
                                        },
                                      ]
                                    | None => []
                                    },
                                  );

                                isInactive && hasValidPrerequisites;
                              })
                           |> (
                             applications => {
                               ...selectOption,
                               applications: Some(applications),
                             }
                           )
                       )
                     )
                   );
              }
            ),
        );
      | TraditionGuildMages =>
        // Filter all spells so that only spells are included that cant be
        // familiar spells
        Some(
          filterSpellSelectOptions(spell =>
            Ley_IntSet.disjoint(
              spell.traditions,
              Ley_IntSet.fromList([
                Id.MagicalTradition.toInt(General),
                Id.MagicalTradition.toInt(GuildMages),
              ]),
            )
          ),
        )
      | PropertyKnowledge as id
      | AspectKnowledge as id =>
        let availableIds =
          switch (id) {
          | PropertyKnowledge =>
            Spells.PropertyKnowledge.getAvailableProperties(
              staticData.spells,
              hero.spells,
            )
          | AspectKnowledge =>
            LiturgicalChants.AspectKnowledge.getAvailableAspects(
              staticData.liturgicalChants,
              hero.liturgicalChants,
            )
          // Never happens
          | _ => []
          };

        let isValidId = (selectOption: SO.t) =>
          switch (selectOption.id) {
          | Generic(id) => L.elem(id, availableIds)
          | _ => false
          };

        Some(fold => fold |> isNoRequiredOrActiveSelection >>~ isValidId);
      | PropertyFocus =>
        let activePropertyKnowledges =
          maybeHeroEntry |> O.option([], getActiveSelectOptions1);

        let hasActivePropertyKnowledge = (selectOption: SO.t) =>
          switch (selectOption.id) {
          | Generic(_) as id => L.elem(id, activePropertyKnowledges)
          | _ => false
          };

        Some(
          fold =>
            fold
            |> isNoRequiredOrActiveSelection
            >>~ hasActivePropertyKnowledge,
        );
      | AdaptionZauber =>
        let minimumSkillRating = 10;

        let hasSpellMinimumSr = (selectOption: SO.t) =>
          switch (selectOption.id) {
          | Spell(id) =>
            IM.lookup(id, hero.spells)
            |> O.option(false, (spell: ActivatableSkill.Dynamic.t) =>
                 switch (spell.value) {
                 | Active(value) => value >= minimumSkillRating
                 | Inactive => false
                 }
               )
          | _ => false
          };

        let isUnfamiliarSpell = (selectOption: SO.t) =>
          switch (selectOption.id) {
          | Spell(id) =>
            IM.lookup(id, staticData.spells)
            |> O.option(
                 false,
                 Dependencies.TransferredUnfamiliar.isUnfamiliarSpell(
                   hero.transferredUnfamiliarSpells,
                   magicalTraditions,
                 ),
               )
          | _ => false
          };

        Some(
          fold =>
            fold
            |> isNoRequiredOrActiveSelection
            >>~ hasSpellMinimumSr
            >>~ isUnfamiliarSpell,
        );
      | SpellEnhancement as id
      | ChantEnhancement as id =>
        let getTargetHeroEntry =
          switch (id) {
          | SpellEnhancement => (id => IM.lookup(id, hero.spells))
          | ChantEnhancement => (id => IM.lookup(id, hero.liturgicalChants))
          | _ => (_ => None)
          };

        let isNotUnfamiliar =
          Ley_Bool.notP(
            Dependencies.TransferredUnfamiliar.isUnfamiliarSpell(
              hero.transferredUnfamiliarSpells,
              magicalTraditions,
            ),
          );

        let isValueValid = (maybeLevel, heroEntry: ActivatableSkill.Dynamic.t) =>
          switch (maybeLevel, heroEntry.value) {
          | (Some(level), Active(value)) => value >= level * 4 + 4
          | (None, Active(_))
          | (None, Inactive)
          | (Some(_), Inactive) => false
          };

        Some(
          fold =>
            fold
            |> isNoRequiredOrActiveSelection
            >>~ (
              (selectOption: SO.t) =>
                switch (
                  selectOption.staticEntry,
                  O.Infix.(
                    selectOption.enhancementTarget >>= getTargetHeroEntry
                  ),
                ) {
                | (Some(Spell(staticSpell)), Some(heroSpell)) =>
                  isNotUnfamiliar(staticSpell)
                  && isValueValid(selectOption.enhancementLevel, heroSpell)
                | (Some(LiturgicalChant(_)), Some(heroChant)) =>
                  isValueValid(selectOption.enhancementLevel, heroChant)
                | _ => false
                }
            ),
        );
      | LanguageSpecializations =>
        // Pair: fst = sid, snd = current_level
        let availableLanguages =
          hero.specialAbilities
          |> IM.lookup(Id.SpecialAbility.toInt(Language))
          |> O.option([], (heroLanguage: Activatable_Dynamic.t) =>
               heroLanguage.active
               |> O.mapOption((active: Activatable_Dynamic.single) =>
                    O.Infix.(
                      active.level
                      >>= (
                        level =>
                          switch (level, active.options |> O.listToOption) {
                          | (3 | 4, Some(Preset(Generic(sid)))) =>
                            Some((sid, level))
                          | _ => None
                          }
                      )
                    )
                  )
             );

        Some(
          fold =>
            fold
            |> isNoRequiredOrActiveSelection
            |> mapOptionT((selectOption: SO.t) =>
                 switch (selectOption.id) {
                 | Generic(sid) =>
                   switch (L.lookup(sid, availableLanguages)) {
                   | Some(4) => Some({...selectOption, apValue: Some(0)})
                   | Some(3) => Some(selectOption)
                   | Some(_)
                   | None => None
                   }
                 | _ => None
                 }
               ),
        );
      | MadaschwesternStil =>
        Some(
          filterSpellSelectOptions(spell =>
            Ley_IntSet.disjoint(
              spell.traditions,
              Ley_IntSet.fromList([
                Id.MagicalTradition.toInt(General),
                Id.MagicalTradition.toInt(Witches),
              ]),
            )
          ),
        )
      | ScholarDesMagierkollegsZuHoningen =>
        let allowedTraditions =
          [Id.MagicalTradition.Druids, Elves, Witches]
          |> L.map(Id.MagicalTradition.toInt)
          |> IS.fromList;

        let maybeTransferredSpellFromTradition =
          O.Infix.(
            hero.specialAbilities
            |> IM.lookup(Id.SpecialAbility.toInt(TraditionGuildMages))
            >>= (
              specialAbility =>
                specialAbility.active
                |> O.listToOption
                >>= (
                  active =>
                    (
                      switch (active.options |> O.listToOption) {
                      | Some(Preset(Spell(id))) => Some(id)
                      | Some(_)
                      | None => None
                      }
                    )
                    >>= F.flip(IM.lookup, staticData.spells)
                    <&> (spell => spell.traditions)
                )
            )
          );

        maybeTransferredSpellFromTradition
        |> O.option(
             idT,
             transferredSpellFromTradition => {
               // Contains all allowed trads the first spell does not have
               let traditionDiff =
                 IS.Infix.(allowedTraditions \/ transferredSpellFromTradition);

               let hasTransferredSpellAllAllowedTraditions =
                 IS.null(traditionDiff);

               filterSpellSelectOptions(spell =>
                 Ley_IntSet.notElem(
                   Id.MagicalTradition.toInt(General),
                   spell.traditions,
                 )
                 && Ley_IntSet.any(
                      F.flip(
                        IS.elem,
                        hasTransferredSpellAllAllowedTraditions
                          ? allowedTraditions : traditionDiff,
                      ),
                      spell.traditions,
                    )
               );
             },
           )
        |> O.return;
      | _ => Some(isNoRequiredOrActiveSelection)
      }
    );
  };
};

let getAvailableSelectOptions =
    (
      staticData: Static.t,
      hero: Hero.t,
      magicalTraditions,
      staticEntry,
      maybeHeroEntry,
    ) => {
  let allSelectOptions =
    Activatable_Accessors.selectOptions(staticEntry) |> SO.Map.elems;

  getAvailableSelectOptionsTransducer(
    staticData,
    hero,
    magicalTraditions,
    staticEntry,
    maybeHeroEntry,
  )
  |> (
    fun
    | Some(transducer) =>
      switch (transduceList(transducer, allSelectOptions)) {
      | [] => L.null(allSelectOptions) ? Some([]) : None
      | xs => Some(xs)
      }
    | None => Some(allSelectOptions)
  );
};
