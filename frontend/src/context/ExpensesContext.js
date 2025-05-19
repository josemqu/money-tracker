import React, { createContext, useContext } from "react";
import useExpenses from "../hooks/useExpenses";

const ExpensesContext = createContext();

export const ExpensesProvider = ({ children }) => {
  const expensesData = useExpenses();
  return (
    <ExpensesContext.Provider value={expensesData}>
      {children}
    </ExpensesContext.Provider>
  );
};

export const useExpensesContext = () => useContext(ExpensesContext);
