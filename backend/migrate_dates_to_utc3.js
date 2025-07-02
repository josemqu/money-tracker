const mongoose = require("mongoose");
const Expense = require("./models/Expense");
const dotenv = require("dotenv");
const Subcategory = require("./models/Subcategory");
dotenv.config();

const MONGO_USER = process.env.MONGO_USER || "josemqu";
const MONGO_PASS = process.env.MONGO_PASS || "LmfXA2ZNj5rskBm4";
const MONGO_HOST = process.env.MONGO_HOST || "codercluster.tgft5r9.mongodb.net";
const MONGO_DB = process.env.MONGO_DB || "expenses";
const mongoUri = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_DB}?retryWrites=true&w=majority`;

async function migrateDates() {
  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");

  // Buscar todos los gastos
  const expenses = await Expense.find();

  console.log(`Encontrados ${expenses.length} gastos para migrar.`);
  let updated = 0;

  for (const expense of expenses) {
    let oldDate = expense.date;
    let newDate = null;
    let changed = false;
    let subcatChanged = false;

    // Migrar subcategory de string a ObjectId si es necesario
    if (expense.subcategory && typeof expense.subcategory === "string") {
      const subcat = await Subcategory.findOne({ name: expense.subcategory });
      if (subcat) {
        expense.subcategory = subcat._id;
      } else {
        expense.subcategory = null;
      }
      subcatChanged = true;
    }

    // Caso 1: fecha es string (YYYY-MM-DD)
    if (typeof oldDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(oldDate)) {
      const [year, month, day] = oldDate.split("-").map(Number);
      newDate = new Date(Date.UTC(year, month - 1, day, 3, 0, 0));
      changed = true;
    }
    // Caso 2: fecha es Date con hora UTC 00:00:00
    else if (
      oldDate instanceof Date &&
      oldDate.getUTCHours() === 0 &&
      oldDate.getUTCMinutes() === 0 &&
      oldDate.getUTCSeconds() === 0
    ) {
      newDate = new Date(oldDate.getTime() + 3 * 60 * 60 * 1000);
      changed = true;
    }
    // Caso 3: fecha es Date con hora UTC 21:00:00
    else if (
      oldDate instanceof Date &&
      oldDate.getUTCHours() === 21 &&
      oldDate.getUTCMinutes() === 0 &&
      oldDate.getUTCSeconds() === 0
    ) {
      // Sumar 6 horas y pasar al día siguiente a las 03:00:00
      newDate = new Date(oldDate.getTime() + 6 * 60 * 60 * 1000);
      changed = true;
    }

    if (changed || subcatChanged) {
      try {
        if (changed) expense.date = newDate;
        await expense.save();
        updated++;
        console.log(
          `Actualizado gasto ${expense._id}: ${
            oldDate.toISOString ? oldDate.toISOString() : oldDate
          } -> ${changed ? newDate.toISOString() : oldDate} | subcat: ${
            subcatChanged ? "migrada" : "ok"
          }`
        );
      } catch (err) {
        console.error(
          `No se pudo actualizar el gasto ${expense._id}:`,
          err.message
        );
      }
    }
  }

  console.log(`\nMigración terminada. Gastos actualizados: ${updated}`);
  mongoose.disconnect();
}

migrateDates().catch((err) => {
  console.error("Error en la migración:", err);
  mongoose.disconnect();
});
