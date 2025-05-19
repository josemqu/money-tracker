import { useState, useEffect } from "react";
import {
  fetchExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  clearAllExpenses,
} from "../services/expenseService";

export default function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExpenses()
      .then((data) => {
        setExpenses(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const add = async (data) => {
    const res = await addExpense(data);
    setExpenses((prev) => [...prev, res.expense]);
    return res;
  };
  const update = async (id, data) => {
    const res = await updateExpense(id, data);
    setExpenses((prev) =>
      prev.map((e) => (e.id === id || e._id === id ? res.expense : e))
    );
    return res;
  };
  const remove = async (id) => {
    await deleteExpense(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id && e._id !== id));
  };
  const clearAll = async () => {
    await clearAllExpenses();
    setExpenses([]);
  };

  return {
    expenses,
    loading,
    error,
    add,
    update,
    remove,
    clearAll,
    setExpenses, // expone setter para casos especiales
  };
}
