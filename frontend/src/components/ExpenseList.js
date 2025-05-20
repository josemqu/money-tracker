import React from "react";
import ExpenseItem from "./ExpenseItem";
import CATEGORY_COLORS from "../constants/categoryColors";
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
} from "react-icons/fa";

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
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
      default:
        return <FaQuestionCircle color={color} size={20} />;
    }
  };

  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        width: "100%",
        maxWidth: 500,
        margin: "32px auto 0 auto",
      }}
    >
      {[...expenses]
        .filter(expense => expense && expense.category)
        .map(expense => ({
          ...expense,
          subcategory: typeof expense.subcategory === "object" ? expense.subcategory.name : expense.subcategory
        }))
        .sort((a, b) => {
          const da = a.date ? new Date(a.date) : new Date(0);
          const db = b.date ? new Date(b.date) : new Date(0);
          return db - da; // Orden descendente (más reciente primero)
        })
        .map((expense) => (
          <ExpenseItem
            key={expense._id}
            expense={expense}
            onEdit={onEdit}
            onDelete={onDelete}
            categoryIcon={getCategoryIcon(expense.category)}
          />
        ))}
    </ul>
  );
};

export default ExpenseList;
