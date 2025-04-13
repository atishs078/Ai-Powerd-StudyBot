const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: String,
  description: String,
  keywords: [String],
  link: String // link to PDF, video, etc.
});

module.exports = mongoose.model('Material', materialSchema);
