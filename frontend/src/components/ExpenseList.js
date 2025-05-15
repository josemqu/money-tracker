import React from 'react';
import ExpenseItem from './ExpenseItem';
import { FaHome, FaCar, FaUtensils, FaHeartbeat, FaGift, FaTshirt, FaUserFriends, FaRegStar, FaQuestionCircle } from 'react-icons/fa';

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Casa':
        return <FaHome color="#bbb" size={20} style={{ marginRight: 8 }} />;
      case 'Transporte':
        return <FaCar color="#bbb" size={20} style={{ marginRight: 8 }} />;
      case 'Comida':
        return <FaUtensils color="#bbb" size={20} style={{ marginRight: 8 }} />;
      case 'Salud':
        return <FaHeartbeat color="#bbb" size={20} style={{ marginRight: 8 }} />;
      case 'Regalos':
        return <FaGift color="#bbb" size={20} style={{ marginRight: 8 }} />;
      case 'Indumetaria':
        return <FaTshirt color="#bbb" size={20} style={{ marginRight: 8 }} />;
      case 'Cuidado Personal':
        return <FaUserFriends color="#bbb" size={20} style={{ marginRight: 8 }} />;
      case 'Salida':
        return <FaRegStar color="#bbb" size={20} style={{ marginRight: 8 }} />;
      default:
        return <FaQuestionCircle color="#bbb" size={20} style={{ marginRight: 8 }} />;
    }
  };

  return (
    <ul style={{ listStyle: 'none', padding: 0, width: '100%', maxWidth: 500, margin: '32px auto 0 auto' }}>
      {[...expenses]
        .sort((a, b) => {
          const da = a.date ? new Date(a.date) : new Date(0);
          const db = b.date ? new Date(b.date) : new Date(0);
          return db - da; // Orden descendente (más reciente primero)
        })
        .map((expense) => (
          <ExpenseItem
            key={expense._id || expense.id}
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
