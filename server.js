// const parse = require('csv-parse');
// const csv = require('./mockData/household-income-mean-median.csv');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Harry Potter DB';

app.use(bodyParser.json());

const requireHTTPS = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect('https://' + req.get('host') + req.url);
  }
    next();
};

app.enable('trust proxy');

if (process.env.NODE_ENV === 'production') { app.use(requireHTTPS); }

app.use(express.static('public'))

app.get('/', (request, response) => {

});

// Wizarding Families endpoints
app.get('/api/v1/families', (request, response) => {
  try {
    const families = await database('families').select();
    return response.status(200).json(families)
  } catch (error) {
    return response.status(500).json({ error })
  }
});

app.get('/api/v1/families/:id', (request, response) => {
  try {
    const family = await database('families').where('id', id).select();
    return response.status(200).json(family)
  } catch (error) {
    return response.status(500).json({ error })
  }
})

app.post('/api/v1/families', (request, response) => {
  const familyInfo = request.body;

  for(let requiredParam of ['family_name']) {
    if(!familyInfo[requiredParam]) {
      return response
        .status(422)
        .send({ error: `You're missing a "${requiredParam}"`})
    }
  }

  database('families').insert(familyInfo, 'id')
    .then(family => {
      response.status(201).json({ id: family[0] })
    })
    .catch( error => {
      response.status(500).json({ error })
    })
})

app.delete('/api/v1/families/:id', (request, response) => {
  const { id } = request.params;
  database('families').where('id', id).del()
  .then( deleted => {
    response.status(202).json({ id: deleted.id })
  })
})

// Characters endpoints

app.get('/api/v1/characters', (request, response) => {
  try {
    const characters = await database('characters').select();
    return response.status(200).json(characters)
  } catch (error) {
    return response.status(500).json({ error })
  }
})

app.get('/api/v1/characters/:id', (request, response) => {
  try {
    const character = await database('characters').where('id', id).select();
    return response.status(200).json(character)
  } catch (error) {
    return response.status(500).json({ error })
  }
})

app.post('/api/v1/characters', (request, response) => {
  const charInfo = request.body;

  for(let requiredParams of ['name', 'description', 'presence', 'family_id']) {
    if(!familyInfo[requiredParams]) {
      return response
        .status(422)
        .send({ error: `You're missing a "${requiredParams}"`})
    }
  }
})

app.delete('/api/v1/characters/:id', (request, response) => {
  const { id } = request.params;
  database('characters').where('id', id).del()
  .then( deleted => {
    response.static(202).json({ id: deleted.id })
  })
})



app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} server running on port 3000.`)
});
