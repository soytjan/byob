## Synopsis

This Api contains information about 100+ characters of the Harry Potter world and the Wizarding Families they belong to. Using Node Express, the database is built in POSTGRESQL using KNEX to translate javascript to SQL. This project focused on creating a secure way for users to access the database through authentication using JSON web tokens.

Two tables are stored in the database. The first contains a list of the [Sacred 28 Families](http://harrypotter.wikia.com/wiki/Sacred_Twenty-Eight), with the addition of a 29th option called "Not Pure Blood", that are stored with a unique id. The second table contains 100+ Harry Potter characters with a name, description, book_presence (a boolean with whether or not they were found in the book series), and a foreign key indicating which of the 28 families that character belongs to. If the character is not a part of the Sacred 28 Families, then they are listed under the 29th option, "Not Pure Blood." 

## Motivation

Amanda and Casey both grew up with Harry Potter and love everything about it. Our goal was to make an Api that people can access to learn more about the characters and the Wizarding Family Trees. For the record, Amanda is a Hufflepuff and Casey is a Ravenclaw.

## Installation

Clone the repo and run ```npm install```. 

The developer must create their own database, so install postgresql and run ```psql``` in your terminal. Then ```CREATE DATABASE wizarding_family_trees```. Exit out of psql with the command ```\q```. 

Run these two commands in the root project folder ```knex migrate:make initial``` and ```knex seed:run```. This seeds the databse with all of the wizarding family tree and character data. Now, the developer can start the server using ```node server.js```. Now the application will be running on the developer's local host.

Users now have access to all GET requests. In order to be authorized for a POST/PUT/DELETE request, the user must register an email with the ending of ```@turing.io``` and application name at the local host provider. Then a user will receive a JWT that exprires in 48 hours. In any request made, the user must include their token in the body of the request.

## API Reference

Wizarding Family Tree Table

GET 


### Characters Table

#### GET

```GET '/api/v1/characters'```

JWT not required. Users will receive a list of all the characters names, descriptions, book presence, and family ids stored in the database.

```GET '/api/v1/characters/:id'```

JWT not required. Users must replace ```:id``` with a number that represents a character's unique id in the characters table. This request will return the character that has a unique id that matches the one in the request paramaters.

#### POST

```POST '/api/v1/characters'```

JWT required with an email ending in ```@turing.io```. In order to successfully create a new character, the request body must be an object that contains two key value pairs. The first must have a key of ```token``` and a ```string``` value of the user's JWT. The second key must be named ```character``` and have a value of an object. In the object, there must be four key value pairs: ```name``` must be a ```string```, ```description``` must be a ```string```, ```book_presence``` must be a boolean, ```family_id``` must be a number that represents a unique id from the Wizarding Family Tree.

Body example:
``` 
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6e30sImFwcE5hbWUiOnt9LCJpYXQiOjE1MjI2MTIzNTcsImV4cCI6MTUyMjc4NTE1N30.n3547islk87YxWQYTEMYdlHzyulzUhOE9-vk5VVow5o", 
  "character": { 
    "name": "Hermione Granger", 
    "description": "the best character by far", 
    "book_presence": true, 
    "family_id": 29 
   }
}
```

#### DELETE

```DELETE '/api/v1/characters/:id'```

JWT required with an email ending in ```@turing.io```. In order to successfully delete a character, the ```:id``` in the request URL must be replaced with a character's unique id. The body must contain the user's JWT. 

Body example:
``` 
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6e30sImFwcE5hbWUiOnt9LCJpYXQiOjE1MjI2MTIzNTcsImV4cCI6MTUyMjc4NTE1N30.n3547islk87YxWQYTEMYdlHzyulzUhOE9-vk5VVow5o"
}
```

#### PUT

```PUT '/api/v1/characters/:id'```

JWT required with an email ending in ```@turing.io```. In order to successfully update a character, the ```:id``` in the request URL must be replaced with a character's unique id. The body must be an object with two key value pairs. The first key must be named ```token``` and have a value a ```string``` of the user's JWT token. The second key must be ```character``` with a value of an object with at least one or up to four of the following strings: ```name```, ```description```, ```book_presence```, ```family_id```.

``` 
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6e30sImFwcE5hbWUiOnt9LCJpYXQiOjE1MjI2MTIzNTcsImV4cCI6MTUyMjc4NTE1N30.n3547islk87YxWQYTEMYdlHzyulzUhOE9-vk5VVow5o", 
  "character": { 
    "name": "Hermione Weasley"
   }
}
```


## Tests

Describe and show how to run the tests with code examples.

## Contributors

Let people know how they can dive into the project, include important links to things like issue trackers, irc, twitter accounts if applicable.

## License

A short snippet describing the license (MIT, Apache, etc.)
