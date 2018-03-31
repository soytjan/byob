const characterData = require('../../../mockData/character-data.js');
const familyData = require('../../../mockData/familyNames.js');

const createFamily = (knex, familyName) => {
  return knex('families').insert({
    name: familyName
  }).returning(['id', 'name'])
};

const createCharacter = (knex, character, familyId) => {
  const updatedChar = {
    name: character.name,
    book_presence: character.book_presence,
    description: character.description,
    family_id: familyId
  };
  return knex('characters').insert(updatedChar, 'id'); 
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
    .then((familyNames) => {
      let characterPromises = [];

      for(let i = 0; i < characterData.length; i++) {
        const { family_name } = characterData[i];
        const familyFound = familyNames.find(familyName => familyName[0].name === family_name)
        characterPromises.push(createCharacter(knex, characterData[i], familyFound[0].id))
      }
      return Promise.all(characterPromises); 

    })
    .catch(error => console.log(`Error seeding data: ${error}`))
};
