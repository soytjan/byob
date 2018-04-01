const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage with text', () => {
    return chai.request(server)
      .get('/')
      .then(response => {
        response.should.have.status(200);
        response.should.be.html;
      })
      .catch(err => {
        throw err;
    });
  });

  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
      .get('/sad')
      .then(response => {
        response.should.have.status(404);
      })
      .catch(err => {
        throw err;
    });
  });
});

describe('API Routes', () => {
  const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFtYW5kYUB0dXJpbmcuaW8iLCJhcHBOYW1lIjoiRnVuIiwiaWF0IjoxNTIyNTM0NTEwLCJleHAiOjE1MjI3MDczMTB9.Jfs2YDjE3hSmpn91eVbACJFYfc8qG1aYfBQkswf7Dks";

  beforeEach((done) => {
    database.migrate.rollback()
    .then(() => {
      database.migrate.latest()
      .then(() => {
        return database.seed.run()
        .then(() => {
          done()
        })
      })
    })
  })

  describe('GET /api/v1/families', () => {
    it('should return all of the families', () => {
      return chai.request(server)
        .get('/api/v1/families')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(29);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('Abbott');
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
        })
        .catch(error => {
          throw error;
      })
    })
  })

  describe('GET /api/v1/families:id', () => {
    it('should return family with associated id', () => {
      return chai.request(server)
        .get('/api/v1/families/1')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('Abbott');
        })
        .catch(error => {
          throw error;
        })
    })
  })

  describe('POST /api/v1/families', () => {
    it('should create a new family', () => {
      return chai.request(server)
        .post('/api/v1/families')
        .send({
          token: mockToken,
          family: { name: 'Potter '}
        })
        .then(response => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(30);
        })
        .catch(error => {
          throw error;
       });
    });

    it('should return an error if missing a required param', () => {
      return chai.request(server)
        .post('/api/v1/families')
        .send({
          token: mockToken,
          family: { magic: true }
        })
        .then(response => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.equal(`You're missing a "name"`);
        })
        .catch(error => {
          throw error;
       });
    });

    it('should return an error if sent object has invalid value', () => {
      return chai.request(server)
        .post('/api/v1/families')
        .send({
          token: mockToken,
          family: { 
            magic: true,
            name: "Potter"
          }
        })
        .then(response => {
          response.should.have.status(500);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
        })
        .catch(error => {
          throw error;
       });
    });
  })

  // describe('DELETE /api/v1/families/:id', () => {
  //   it('should delete family associated with id', () => {
  //     return chai.request(server)
  //       .delete('/api/v1/families2')
  //       .send({
  //         token: mockToken
  //       })
  //       .then(response => {
  //         response.should.have.status(202);
  //         response.should.be.json;
  //         response.body.should.be.a('object');
  //         response.body.should.have.property('id');
  //         response.body.id.should.equal(1);
  //       })
  //       .catch(error => {
  //         throw error;
  //       })
  //   })
  // })

  describe('PUT /api/v1/families/:id', () => {
    it('should update family associated with id', () => {
      return chai.request(server)
        .put('/api/v1/families/1')
        .send({
          token: mockToken,
          family: {
            name: "Tjan"
          }
        })
        .then(response => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('name');
          response.body.name.should.equal('Tjan');
        })
        .catch(error => {
          throw error;
        })
    })

    it('should return an error message if sent object includes invalid key', () => {
      return chai.request(server)
        .put('/api/v1/families/1')
        .send({
          token: mockToken,
          family: {
            name: "Tjan",
            house: "Hufflepuff"
          }
        })
        .then(response => {
          response.should.have.status(500);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.equal('Can only accept {name: `name of family you wish to change`}')
        })
    }) 
  })

  describe('GET /api/v1/characters', () => {
    it('should return all of the characters', () => {
      return chai.request(server)
        .get('/api/v1/characters')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          // response.body.length.should.equal(119);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('Hannah Abbott');
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
          response.body[0].should.have.property('book_presence');
          response.body[0].book_presence.should.equal(true);
          response.body[0].should.have.property('family_id');
          response.body[0].family_id.should.equal(1);
        })
        .catch(error => {
          throw error;
      })
    })
  })

  describe('GET /api/v1/characters/:id', () => {
    it('should return character with associated id', () => {
      return chai.request(server)
        .get('/api/v1/characters/1')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('Hannah Abbott');
          response.body[0].should.have.property('book_presence');
          response.body[0].book_presence.should.equal(true);
          response.body[0].should.have.property('family_id');
          response.body[0].family_id.should.equal(1);
        })
        .catch(error => {
          throw error;
        })
    })
  })

  describe('POST /api/v1/characters', () => {
    it('should create a new character', () => {
      return chai.request(server)
        .post('/api/v1/characters')
        .send({
          token: mockToken,
          character: { 
            "name": "Casey", 
            "description": "OMG I wish, I would be in Ravenclaw", 
            "book_presence": true, 
            "family_id": 1
          }
        })
        .then(response => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          // response.body.id.should.equal(121);
        })
        .catch(error => {
          throw error;
       });
    });

    it('should return an error if missing a required param', () => {
      return chai.request(server)
        .post('/api/v1/characters')
        .send({
          token: mockToken,
          character: { 
            // "name": "Casey", 
            "description": "OMG I wish, I would be in Ravenclaw", 
            "book_presence": true, 
            "family_id": 1
          }
        })
        .then(response => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.equal(`You're missing a "name"`);
        })
        .catch(error => {
          throw error;
       });
    });

    it('should return an error if sent object has invalid value', () => {
      return chai.request(server)
        .post('/api/v1/characters')
        .send({
          token: mockToken,
          character: {
            "name": "Casey", 
            "description": "OMG I wish, I would be in Ravenclaw", 
            "book_presence": true, 
            "family_id": 1,
            "is_she_really_in_the_book": "in her dreams" 
          }
        })
        .then(response => {
          response.should.have.status(500);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
        })
        .catch(error => {
          throw error;
       });
    });
  })

  describe('DELETE /api/v1/characters/:id', () => {
    it('should delete character associated with id', () => {
      return chai.request(server)
        .delete('/api/v1/characters/1')
        .send({
          token: mockToken
        })
        .then(response => {
          response.should.have.status(202);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(1);
        })
        .catch(error => {
          throw error;
        })
    })
  })

  describe('PUT /api/v1/characters/:id', () => {
    it('should update character associated with id', () => {
      return chai.request(server)
        .put('/api/v1/characters/1')
        .send({
          token: mockToken,
          character: {
            "name": "Casey", 
          }
        })
        .then(response => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('name');
          response.body.name.should.equal('Casey')
        })
        .catch(error => {
          throw error;
        })
    })

    it('should return an error message if sent object includes invalid key', () => {
      return chai.request(server)
        .put('/api/v1/characters/1')
        .send({
          token: mockToken,
          family: {
            name: "Casey",
            would_she_be_a_ravenclaw: "YEP YEPPITY YES"
          }
        })
        .then(response => {
          response.should.have.status(500);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.equal('Can only accept name, description, presence, family id as keys')
        })
    }) 
  })

})
