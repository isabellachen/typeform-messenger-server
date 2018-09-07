const fs = require('fs');

const db = {};

const persistAnswers = () => {
  fs.writeFile(
    __dirname + '/data/answers.json',
    JSON.stringify(answers),
    err => {
      if (err) throw err;
      console.log('The answers has been updated!');
    }
  );
};

module.exports = {
  db,
  persistAnswers
};
