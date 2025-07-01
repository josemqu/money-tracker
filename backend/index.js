require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Subcategory = require("./models/Subcategory");

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

// Subcategory endpoints
app.post("/api/subcategories", async (req, res) => {
  try {
    const subcategory = new Subcategory(req.body);
    await subcategory.save();
    res.status(201).json({ message: "Subcategory registered", subcategory });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error registering subcategory", details: err });
  }
});

app.get("/api/subcategories", async (req, res) => {
  try {
    const subcategories = await Subcategory.find();
    res.json(subcategories);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching subcategories", details: err });
  }
});

// Listar categorías
app.get("/api/categories", async (req, res) => {
  try {
    const expenses = await Expense.find();
    const categories = expenses.map((expense) => expense.category);
    const uniqueCategories = Array.from(new Set(categories));
    res.json(uniqueCategories);
  } catch (err) {
    res.status(500).json({ error: "Error fetching categories", details: err });
  }
});

// Expense model
const Expense = require("./models/Expense");

app.post("/api/expenses", async (req, res) => {
  try {
    let dateToSave;
    if (req.body.date) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(req.body.date)) {
        // Caso YYYY-MM-DD
        const [year, month, day] = req.body.date.split("-").map(Number);
        dateToSave = new Date(Date.UTC(year, month - 1, day, 3, 0, 0));
      } else {
        // Caso con hora: ajustar siempre a las 03:00:00 UTC
        let d = new Date(req.body.date);
        d.setUTCHours(3, 0, 0, 0);
        dateToSave = d;
      }
    } else {
      dateToSave = new Date();
      dateToSave.setUTCHours(3, 0, 0, 0);
    }
    const expenseData = {
      ...req.body,
      date: dateToSave,
    };

    const expense = new Expense(expenseData);
    await expense.save();
    const populatedExpense = await expense.populate("subcategory");

    res.status(201).json({
      message: "Expense registered",
      expense: populatedExpense,
    });
  } catch (err) {
    console.error("Error registering expense:", err);
    res.status(500).json({
      error: "Error registering expense",
      details: err.message,
    });
  }
});

app.get("/api/expenses", async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate("subcategory")
      .sort({ date: -1 }); // Ordenar por fecha descendente

    res.json(expenses);
  } catch (err) {
    res.status(500).json({
      error: "Error fetching expenses",
      details: err.message,
    });
  }
});

// Eliminar gasto
app.delete("/api/expenses/:id", async (req, res) => {
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
app.delete("/api/expenses/all", async (req, res) => {
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
app.put("/api/expenses/:id", async (req, res) => {
  try {
    let dateToSave;
    if (req.body.date) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(req.body.date)) {
        // Caso YYYY-MM-DD
        const [year, month, day] = req.body.date.split("-").map(Number);
        dateToSave = new Date(Date.UTC(year, month - 1, day, 3, 0, 0));
      } else {
        // Caso con hora: ajustar siempre a las 03:00:00 UTC
        let d = new Date(req.body.date);
        d.setUTCHours(3, 0, 0, 0);
        dateToSave = d;
      }
    }
    const updateData = {
      ...req.body,
      ...(dateToSave && { date: dateToSave }),
    };
    const expense = await Expense.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).populate("subcategory");
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
