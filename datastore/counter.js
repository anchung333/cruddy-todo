const fs = require("fs");
const path = require("path");
const sprintf = require("sprintf-js").sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.

const zeroPaddedNumber = num => {
  return sprintf("%05d", num);
};

const readCounter = callback => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, err => {
    if (err) {
      throw "error writing counter";
    } else {
      callback(null, counterString);
    }
  });
};

// Public API //////////////////////////////////////////////

exports.getNextUniqueId = cb => {
  // old
  // counter = counter + 1;
  // return zeroPaddedNumber(counter);
  readCounter((err, id) => {
    if (err) {
      cb(err);
    } else {
      id++;
      writeCounter(zeroPaddedNumber(id), (err, data) => {
        if (err) {
          cb(err);
        } else {
          cb(null, zeroPaddedNumber(id));
        }
      });
    }
  });
};

// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, "counter.txt");
