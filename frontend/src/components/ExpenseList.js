import React, { useCallback, useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import ExpenseItem from "./ExpenseItem";
import CATEGORY_COLORS from "../constants/categoryColors";
import styles from "./ExpenseList.module.css";
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
import Button from "@mui/material/Button";

import { formatDateWithRelativeDay } from "../utils/dateUtils";

// Función para obtener la clave de fecha (solo fecha, sin hora)
const getDateKey = (dateString) => {
  if (!dateString) return "";
  // Si la fecha ya viene en formato YYYY-MM-DD, la usamos directamente
  // Si viene con hora, tomamos solo la parte de la fecha
  return dateString.slice(0, 10);
};

// Función para agrupar gastos por fecha
const groupExpensesByDate = (expenses) => {
  if (!expenses || !Array.isArray(expenses)) return {};

  return expenses
    .filter((expense) => expense && expense.date && expense.category)
    .map((expense) => ({
      ...expense,
      dateGroup: getDateKey(expense.date),
      subcategory:
        typeof expense.subcategory === "object"
          ? expense.subcategory.name
          : expense.subcategory,
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

const PAGE_SIZE = 20;

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  // Obtener fechas únicas ordenadas de más reciente a más antigua
  const dates = React.useMemo(() => {
    const uniqueDates = [
      ...new Set(
        expenses
          .filter((expense) => expense && expense.date)
          .map((expense) => getDateKey(expense.date))
      ),
    ];

    return uniqueDates.sort((a, b) => new Date(b) - new Date(a));
  }, [expenses]);

  // Paginación
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(expenses.length / PAGE_SIZE);
  const paginatedExpenses = React.useMemo(() => {
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return expenses.slice(start, end);
  }, [expenses, page]);

  // Estado para controlar qué acordeones están abiertos (todos abiertos por defecto)
  const [openItems, setOpenItems] = React.useState(dates);

  // Efecto para actualizar los ítems abiertos cuando cambian las fechas
  React.useEffect(() => {
    setOpenItems([]); // Cierra todos primero para forzar el recalculo de espacio
    setTimeout(() => setOpenItems(dates), 0); // Luego abre los nuevos acordeones
  }, [dates]);
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

  if (!expenses || expenses.length === 0) {
    return (
      <div className={styles["no-expenses"]}>No hay gastos para mostrar</div>
    );
  }

  // Agrupar gastos por fecha
  const groupedExpenses = groupExpensesByDate(paginatedExpenses);

  return (
    <>
      <Accordion.Root
        className={styles.accordionRoot}
        type="multiple"
        value={openItems}
        onValueChange={setOpenItems}
        collapsible="true"
        defaultValue={dates}
      >
        {dates.map((date) => {
          const dayExpenses = groupedExpenses[date] || [];
          if (dayExpenses.length === 0) return null;

          return (
            <Accordion.Item
              key={date}
              value={date}
              className={styles.accordionItem}
            >
              <Accordion.Header className={styles.accordionHeader}>
                <Accordion.Trigger className={styles.accordionTrigger}>
                  <div className={styles.accordionHeader}>
                    <span className={styles.dayName}>
                      {formatDateWithRelativeDay(dayExpenses[0].date)}
                    </span>
                    <div className={styles.expenseCount}>
                      {dayExpenses.length}{" "}
                      {dayExpenses.length === 1 ? "gasto" : "gastos"}
                    </div>
                  </div>
                  <ChevronDownIcon
                    className={styles.accordionChevron}
                    aria-hidden
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className={styles.accordionContent}>
                <ul className={styles.expenseList}>
                  {dayExpenses.map((expense) => (
                    <ExpenseItem
                      key={expense._id}
                      expense={expense}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      categoryIcon={getCategoryIcon(expense.category)}
                    />
                  ))}
                </ul>
              </Accordion.Content>
            </Accordion.Item>
          );
        })}
      </Accordion.Root>
      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 16,
            gap: 8,
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            sx={{ minWidth: 100, fontWeight: 600 }}
          >
            Anterior
          </Button>
          <span
            style={{
              alignSelf: "center",
              color: "#fff",
              fontWeight: 500,
              fontSize: "1.05rem",
            }}
          >
            Página {page + 1} de {totalPages}
          </span>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            sx={{ minWidth: 100, fontWeight: 600 }}
          >
            Siguiente
          </Button>
        </div>
      )}
    </>
  );
};

export default ExpenseList;
