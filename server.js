const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

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
app.get('/api/v1/families', async (request, response) => {
  try {
    const families = await database('families').select();
    return response.status(200).json(families)
  } catch (error) {
    return response.status(500).json({ error })
  }
});

app.get('/api/v1/families/:id', async (request, response) => {
  const { id } = request.params;

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

app.put('/api/v1/families/:id', (request, response) => {
  const familyInfo = request.body;
  const { id } = request.body;

  for(let requiredParam of ['name', 'id']) {
    if(!familyInfo[requiredParam]) {
      return response
        .status(422)
        .send({ error: `You're missing a "${requiredParam}"` })
    }
  }

  database('families').where('id', id).update({...familyInfo})
    .then(family => {
      response.status(201).json({...familyInfo});
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

// Characters endpoints

app.get('/api/v1/characters', async (request, response) => {
  try {
    const characters = await database('characters').select();
    return response.status(200).json(characters)
  } catch (error) {
    return response.status(500).json({ error })
  }
})

app.get('/api/v1/characters/:id', async (request, response) => {
  const { id } = request.params
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
    response.status(202).json({ id: deleted.id })
  })
})

app.put('/api/v1/characters/:id', (request, response) => {
  const charInfo = request.body;
  const { id } = request.body;

  for(let requiredParams of ['id']) {
    if(!charInfo[requiredParams]) {
      return response
        .status(422)
        .send({ error: `You're missing a "${requiredParams}"` })
    }
  }

  database('characters').where('id', id).update({...charInfo})
    .then(family => {
      response.status(201).json({...charInfo});
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} server running on port 3000.`)
});








































