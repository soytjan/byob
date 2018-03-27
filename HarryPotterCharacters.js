const Nightmare = require('nightmare');
const nightmare = Nightmare( {show: true} );
const fs = require('fs');

nightmare
  .goto('https://en.wikipedia.org/wiki/List_of_Harry_Potter_characters')
  .wait(2000)
  .evaluate(() => {
    const charDivs = [...document.querySelectorAll('li')];
    
    const charInfo = charDivs.map( charDiv => {
      // let name = charDiv.querySelector('a').innerText
      let characterString = charDiv.innerText.split(" – ");
      let name = characterString[0];
      let description = characterString[1]
      return { name, description };
    });

    return charInfo
  })
  .end()
  .then((result) => {
    let output = JSON.stringify(result, null, 2);

    fs.writeFile('./character-data.json', output, 'utf8', err => {
      if(err) {
        return console.log(err)
      }
    })

    console.log('saved!')
  })
  .catch( error => {
    console.log(error.message)
  })