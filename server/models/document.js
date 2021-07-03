const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let documentSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  url: {
    type: String
  },
  children: { type: [{ id: String, name: String, url: String }] }
});

module.exports = mongoose.model('Document', documentSchema);