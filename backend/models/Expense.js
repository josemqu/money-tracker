const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  category: String,
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory",
    required: false,
  },
  place: String,
  paymentMethod: String,
  paidBy: String,
  amount: Number,
  date: {
    type: Date,
    default: () => new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }))
  },
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
