// const parse = require('csv-parse');
// const csv = require('./mockData/household-income-mean-median.csv');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// const environment = process.env.NODE_ENV || 'development';
// const configuration = require('./knexfile')[environment];
// const database = require('knex')(configuration);

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
  
});

app.get('/api/v1/families/:id', (request, response) => {

})

// Characters endpoints

app.get('/api/v1/characters', (request, response) => {

})

app.get('/api/v1/characters/:id', (request, response) => {

})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} server running on port 3000.`)
});
