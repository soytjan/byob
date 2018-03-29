const characterData = require('../../../mockData/character-data.js');
const familyData = require('../../../mockData/familyNames.js');

const createFamily = (knex, familyName) => {
  return knex('families').insert({
    name: familyName
  }, 'id')
};

const createCharacter = (knex, character, familyId) => {
  const updatedChar = {
    name: character.name,
    book_presence: character.book_presence,
    description: character.description,
    family_id: familyId
  };
  return knex('characters').insert(updatedChar); 
};

exports.seed = function(knex, Promise) {
  return knex('characters').del()
    .then(() => knex('families').del())
    .then(() => {
      let familyPromises = [];

      familyData.forEach(family => {
        familyPromises.push(createFamily(knex, family))
      })

      return Promise.all(familyPromises);
    })
    .then(() => {
      // need to create an array of character promises
      // need to use the family_name value to find family name in the families table
      // find row and grab id to pass into createCharacter method
      // then push this into characterPromises
      let characterPromises = [];

      characterData.forEach(character => {
        const { family_name } = character;
        // SELECT families.id FROM families WHERE families.name = 'Black';
        // running raw SQL in the db works with the above command
        // Is this a promise that isn't resolving? why is it returning this weird object? 
        const famId = knex('families').where({name: 'Black'}).select('id')
        console.log('fam id', famId)
        characterPromises.push(createCharacter(knex, character, famId));
      });

      return Promise.all(characterPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
};
