import wizardingFamilies from '../../mockData/familyNames.js';

const createFamily = (knex, family) => {
  return knex('families').insert({
    name: family
  }, 'id')
    // .then(familyId => {
    //   let characterPromises = [];

    //   family.characters.forEach(character => {
    //     characterPromises.push(createCharacter(knex, {
    //       name: character.name,
    //       description: character.description,
    //       book_presence: character.book_presence,
    //       family_id: familyId[0]
    //     })
    //     )
    //   })
    // })
};

const createCharacter = (knex, character) => {
  return knex('characters').insert(charcter); 
};

exports.seed = function(knex, Promise) {
  return knex('characters').del()
    .then(() => knex('families').del())
    .then(() => {
      let familyPromises = [];

      wizardingFamilies.forEach(family => {
        familyPromises.push(createFamily(knex, family));
      });

      return Promise.all(familyPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
};
