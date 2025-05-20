const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // Relaciona la subcategoría con la categoría principal
});

subcategorySchema.index({ name: 1, category: 1 }, { unique: true }); // Evita duplicados

const Subcategory = mongoose.model('Subcategory', subcategorySchema);

module.exports = Subcategory;
