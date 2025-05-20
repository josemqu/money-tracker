// migrateSubcategories.js
const mongoose = require("mongoose");
const Expense = require("./models/Expense");
const Subcategory = require("./models/Subcategory");

const MONGO_USER = "josemqu";
const MONGO_PASS = "LmfXA2ZNj5rskBm4";
const MONGO_HOST = "codercluster.tgft5r9.mongodb.net";
const MONGO_DB = "expenses";

// Cambia la URI si es necesario
const mongoUser = MONGO_USER;
const mongoPass = MONGO_PASS;
const mongoHost = MONGO_HOST;
const mongoDb = MONGO_DB;
const mongoUri = `mongodb+srv://${mongoUser}:${mongoPass}@${mongoHost}/${mongoDb}?retryWrites=true&w=majority`;

async function migrate() {
  await mongoose
    .connect(mongoUri)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      process.exit(1);
    });

  // Encuentra los gastos con subcategoria como string
  const expenses = await Expense.find({ subcategory: { $type: "string" } });

  console.log(`Encontrados ${expenses.length} gastos a migrar.`);

  let updated = 0;
  let notFound = 0;

  for (const expense of expenses) {
    const subcatName = expense.subcategory;
    const subcat = await Subcategory.findOne({ name: subcatName });

    if (subcat) {
      expense.subcategory = subcat._id;
      await expense.save();
      updated++;
      console.log(
        `Migrado gasto ${expense._id}: "${subcatName}" -> ${subcat._id}`
      );
    } else {
      notFound++;
      console.warn(
        `No se encontró subcategoría para "${subcatName}" en gasto ${expense._id}`
      );
    }
  }

  console.log(
    `\nMigración terminada. Gastos actualizados: ${updated}, sin subcategoría encontrada: ${notFound}`
  );

  mongoose.disconnect();
}

migrate().catch((err) => {
  console.error("Error en la migración:", err);
  mongoose.disconnect();
});
