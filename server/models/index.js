const fs = require('fs');

const db = {};

const persistDb = db => {
  fs.writeFile(__dirname + '/../data/db.json', JSON.stringify(db), err => {
    if (err) throw err;
    console.log('The db has been updated!');
  });
};

module.exports = {
  db,
  persistDb
};
