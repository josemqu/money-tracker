const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // Por ahora mantenemos category como string
});

const Subcategory = mongoose.model('Subcategory', subcategorySchema);

module.exports = Subcategory;
