require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5002;

// MongoDB connection
const mongoUser = process.env.MONGO_USER;
const mongoPass = process.env.MONGO_PASS;
const mongoHost = process.env.MONGO_HOST;
const mongoDb = process.env.MONGO_DB;
const mongoUri = `mongodb+srv://${mongoUser}:${mongoPass}@${mongoHost}/${mongoDb}?retryWrites=true&w=majority`;

mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Expense model
const expenseSchema = new mongoose.Schema({
  category: String,
  subcategory: String,
  place: String,
  paymentMethod: String,
  paidBy: String,
  amount: Number,
  date: String,
});
const Expense = mongoose.model("Expense", expenseSchema);

app.post("/expenses", async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json({ message: "Expense registered", expense });
  } catch (err) {
    res.status(500).json({ error: "Error registering expense", details: err });
  }
});

app.get("/expenses", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Error fetching expenses", details: err });
  }
});

// Eliminar gasto
app.delete("/expenses/:id", async (req, res) => {
  try {
    const result = await Expense.findByIdAndDelete(req.params.id);
    if (result) {
      res.json({ message: "Expense deleted", id: req.params.id });
    } else {
      res.status(404).json({ error: "Expense not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error deleting expense", details: err });
  }
});

// Eliminar todos los gastos
app.delete("/expenses/all", async (req, res) => {
  try {
    await Expense.deleteMany({});
    res.json({ message: "Todos los gastos eliminados" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error deleting all expenses", details: err });
  }
});

// Editar gasto
app.put("/expenses/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (expense) {
      res.json({ message: "Expense updated", expense });
    } else {
      res.status(404).json({ error: "Expense not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error updating expense", details: err });
  }
});

app.get("/", (req, res) => {
  res.send("GastosClaros Backend");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
