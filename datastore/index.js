const fs = require("fs");
const path = require("path");
const _ = require("underscore");
const counter = require("./counter");
var Promise = require('bluebird');
const readFilePromise = Promise.promisify(fs.readFile);

var items = {};

// Public API ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(exports.dataDir + "/" + id + ".txt", text, err => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = callback => {
  fs.readdir(exports.dataDir, (err, items) => {
    if (err) {
      callback(err);
    }
    let data = _.map(items, item => {
      let id = path.basename(item, '.txt');
      let filepath = path.join(exports.dataDir, item);
      return readFilePromise(filepath).then(fileData => {
        return {
          id: id,
          text: fileData.toString(),
        };
      });
    });
    Promise.all(data)
      .then((items) => {
        callback(null, items);
      })
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(exports.dataDir + "/" + id + ".txt", (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: data.toString() });
    }
  });
};

exports.update = (id, text, callback) => {
  console.log('index ID: ', id);
  fs.readFile(exports.dataDir + "/" + id + ".txt", (err, data) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(exports.dataDir + "/" + id + ".txt", text, err => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, text);
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.readFile(exports.dataDir + '/' + id + '.txt', (err, data) => {
    if (err) {
      callback(err);
    } else {
      fs.unlink(exports.dataDir + '/' + id + '.txt', (err) => {
        if (err) {
          callback(err);
        }
        callback(null);
      });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, "data");

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
