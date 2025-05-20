const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  category: String,
  // Reference to Subcategory document
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    required: false,
  },
  // Optionally keep the subcategory name for easier queries (denormalization)
  subcategoryName: {
    type: String,
    required: false,
  },
  place: String,
  paymentMethod: String,
  paidBy: String,
  amount: Number,
  date: String,
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
