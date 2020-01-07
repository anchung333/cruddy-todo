const fs = require("fs");
const path = require("path");
const _ = require("underscore");
const counter = require("./counter");
var Promise = require('bluebird');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

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
    } else {
      let result = [];
      if (items.length === 0) {
        callback(null, result);
      } else {
        for (let i = 0; i < items.length; i++) {
          fs.readFile(exports.dataDir + "/" + items[i], (err, data) => {
            if (err) {
              callback(err);
            } else {
              const id = items[i].slice(0, 5);
              result.push({ id, text: id });
              if (i === items.length - 1) {
                callback(null, result);
              }
            }
          });
        }
      }
    }
  });
};

exports.readAllPromise = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(exports.dataDir, (err, items) => {
      if (err) {
        reject(err);
      } else {
        if (items.length === 0) {
          resolve([]);
        } else {
          const promises = items.map(item => {
            return new Promise((resolve, reject) => {
              fs.readFile(exports.dataDir + "/" + item, (err, text) => {
                if (err) {
                  reject(err);
                } else {
                  const id = item.slice(0, 5);
                  resolve({ id, text: text.toString() });
                }
              });
            });
          });
          resolve(Promise.all(promises));
        }
      }
    });
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
