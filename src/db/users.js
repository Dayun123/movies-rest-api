const faker = require('faker');
const User = require('../models/user');

const users = [];

for (let i = 0; i < 20; i++) {
  users.push(new User({
    username: faker.internet.userName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
  }));
};

users.push(new User({
  username: 'root',
  password: 'root',
  email: 'root@gmail.com',
  apiKey: faker.random.alphaNumeric(),
}));

console.log(users.pop());

module.exports = users;