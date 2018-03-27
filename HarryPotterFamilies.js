const Nightmare = require('nightmare');
const nightmare = Nightmare( {show: true} );
const fs = require('fs');

nightmare
  .goto('http://harrypotter.wikia.com/wiki/Yaxley_family')
  .evaluate(() => {
    const someFamily = [...document.querySelectorAll('div.pi-data-value.pi-font a')];
    
    const abbotNames = someFamily.map( member => {
      let family = 'Yaxley';
      let characters = member.innerText;
      
      return { family, characters };
    });

    return abbotNames
  })
  .end()
  .then((result) => {
    let output = JSON.stringify(result, null, 2);

    fs.writeFile('./yaxley-data.json', output, 'utf8', err => {
      if(err) {
        return console.log(err)
      }
    })

    console.log('saved!')
  })
  .catch( error => {
    console.log('errrrrr')
  })