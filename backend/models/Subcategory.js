const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
});

subcategorySchema.index({ name: 1, category: 1 }, { unique: true });

const Subcategory = mongoose.model("Subcategory", subcategorySchema);

module.exports = Subcategory;
