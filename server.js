const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('secretKey', 'dbccoldbrewisgreat')
//in the request body, there's going to be
//email with potential to end in turing.io (get admin privlidges)
//appName

//in check Auth, see if the appName is an app that we 


const checkAuth = (request, response, next) => {
  if(!request.body.token) {
    return response
      .status(403)
      .send({ error: "You are not authorized to access this data"})
  }

  try {
    const decoded = jwt.verify(request.body.token, app.get('secretKey'));
    if (decoded.email.includes('@turing.io')) {
      next();
    }
    else {
      return response
        .status(403)
        .send({ error: 'You are not authorized to access this data' })
    }
  } catch (error) {
    return response
      .status(403)
      .send({ error: 'Invalid Token'})
  }
}



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

app.post('/api/v1/authenticate', (request, response) => {
  const userInfo = request.body;
  const { email, appName } = request.body
  console.log(request)

  for(let requiredParams of ['email', 'appName']) {
    if (!userInfo[requiredParams]) {
      return response
        .status(422)
        .send({ error: `You are missing ${requiredParams}`})
    }
  }

  const token = jwt.sign({ email, appName }, app.get('secretKey'), {expiresIn: '48h'});
  response.status(201).json(token)
})


app.get('/', (request, response) => {

});

// Wizarding Families endpoints
app.get('/api/v1/families', async (request, response) => {
  const name = request.param('name')

  try {
    let familyInfoToReturn;
    if (name) {
      console.log(name)
      familyInfoToReturn = await database('families').where('name', name).select();
    } else {
      familyInfoToReturn = await database('families').select();
    }
    return response.status(200).json(familyInfoToReturn)
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

app.post('/api/v1/families', checkAuth, (request, response) => {
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

app.delete('/api/v1/families/:id', checkAuth, (request, response) => {
  const { id } = request.params;

  database('families').where('id', id).del()
  .then( deleted => {
    response.status(202).json({ id: deleted.id })
  })
})

app.put('/api/v1/families/:id', checkAuth, (request, response) => {
  const familyInfo = request.body;
  const { id } = request.body;

  for(let requiredParam of ['name', 'id']) {
    if(!familyInfo[requiredParam]) {
      return response
        .status(422)
        .send({ error: `You're missing a "${requiredParam}"` })
    }
  }

  // need to write an if for if they pass in something that isn't a column

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

app.post('/api/v1/characters', checkAuth, (request, response) => {
  const charInfo = request.body;

  for(let requiredParams of ['name', 'description', 'presence', 'family_id']) {
    if(!familyInfo[requiredParams]) {
      return response
        .status(422)
        .send({ error: `You're missing a "${requiredParams}"`})
    }
  }

  database('characters').insert(charInfo, 'id')
    .then(char => {
      response.status(201).json({ id: char[0] })
    })
    .catch( error => {
      response.status(500).json({ error })
    })
})

app.delete('/api/v1/characters/:id', checkAuth, (request, response) => {
  const { id } = request.params;

  database('characters').where('id', id).del()
  .then( deleted => {
    response.status(202).json({ id: deleted.id })
  })
})

app.put('/api/v1/characters/:id', checkAuth, (request, response) => {
  const charInfo = request.body;
  const { id } = request.body;

  for(let requiredParams of ['id']) {
    if(!charInfo[requiredParams]) {
      return response
        .status(422)
        .send({ error: `You're missing a "${requiredParams}"` })
    }
  }

  // need to write an if, for if they passed in something that isn't a column

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

module.exports = app;

