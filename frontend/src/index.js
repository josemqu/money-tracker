import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ExpensesProvider } from './context/ExpensesContext';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ExpensesProvider>
      <App />
    </ExpensesProvider>
  </React.StrictMode>
);
