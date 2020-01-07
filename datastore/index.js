const fs = require("fs");
const path = require("path");
const _ = require("underscore");
const counter = require("./counter");

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
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
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
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
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
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, "data");

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
