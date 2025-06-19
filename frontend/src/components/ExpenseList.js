import React, { useState, useCallback } from "react";
import ExpenseItem from "./ExpenseItem";
import CATEGORY_COLORS from "../constants/categoryColors";
import styles from "./ExpenseList.module.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  FaHome,
  FaCar,
  FaUtensils,
  FaHeartbeat,
  FaGift,
  FaTshirt,
  FaUserFriends,
  FaRegStar,
  FaQuestionCircle,
  FaTools,
} from "react-icons/fa";

// Función para formatear la fecha
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Hoy';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Ayer';
  } else {
    return date.toLocaleDateString('es-AR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric' 
    });
  }
};

// Función para agrupar gastos por fecha
const groupExpensesByDate = (expenses) => {
  if (!expenses || !Array.isArray(expenses)) return [];
  
  return expenses
    .filter(expense => expense && expense.date && expense.category)
    .map(expense => ({
      ...expense,
      dateGroup: new Date(expense.date).toDateString(),
      formattedDate: formatDate(expense.date),
      subcategory: typeof expense.subcategory === 'object' 
        ? expense.subcategory.name 
        : expense.subcategory
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .reduce((groups, expense) => {
      const date = expense.dateGroup;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(expense);
      return groups;
    }, {});
};

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  const [expandedDays, setExpandedDays] = useState({});

  // Función para alternar la visibilidad de un día
  const toggleDay = useCallback((date) => {
    setExpandedDays(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  }, []);

  // Por defecto, expandir todos los días
  const getIsExpanded = useCallback((date) => {
    // Si no hay nada en expandedDays, expandir todo
    // Si hay algo en expandedDays, respetar la preferencia del usuario
    return expandedDays[date] !== false; // undefined o true significa expandido
  }, [expandedDays]);
  const getCategoryIcon = (category) => {
    const color = CATEGORY_COLORS[category]?.color || "#bbb";
    switch (category) {
      case "Casa":
        return <FaHome color={color} size={20} />;
      case "Transporte":
        return <FaCar color={color} size={20} />;
      case "Comida":
        return <FaUtensils color={color} size={20} />;
      case "Salud":
        return <FaHeartbeat color={color} size={20} />;
      case "Regalos":
        return <FaGift color={color} size={20} />;
      case "Indumentaria":
        return <FaTshirt color={color} size={20} />;
      case "Cuidado Personal":
        return <FaUserFriends color={color} size={20} />;
      case "Salida":
        return <FaRegStar color={color} size={20} />;
      case "Servicios":
        return <FaTools color={color} size={20} />;
      default:
        return <FaQuestionCircle color={color} size={20} />;
    }
  };

  const groupedExpenses = groupExpensesByDate(expenses);
  const dates = Object.keys(groupedExpenses);

  if (!expenses || expenses.length === 0) {
    return <div className={styles['no-expenses']}>No hay gastos para mostrar</div>;
  }

  return (
    <div className={styles['expense-list']}>
      {dates.map((date) => {
        const isExpanded = getIsExpanded(date);
        return (
          <div key={date} className={`${styles['expense-day-group']} ${isExpanded ? styles['is-expanded'] : ''}`}>
            <div 
              className={styles['expense-day-header']} 
              onClick={() => toggleDay(date)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && toggleDay(date)}
            >
              <span className={styles['header-content']}>
                {groupedExpenses[date][0].formattedDate}
                <span className={styles['expense-count']}>
                  ({groupedExpenses[date].length} {groupedExpenses[date].length === 1 ? 'gasto' : 'gastos'})
                </span>
              </span>
              <span className={styles['toggle-icon']}>
                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>
            {isExpanded && (
              <ul className={styles['expense-items']}>
                {groupedExpenses[date].map((expense) => (
                  <ExpenseItem
                    key={expense._id}
                    expense={expense}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    categoryIcon={getCategoryIcon(expense.category)}
                  />
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ExpenseList;
