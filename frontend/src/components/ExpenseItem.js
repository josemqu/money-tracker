import React from "react";
import Card from "@mui/material/Card";
import styles from "./ExpenseItem.module.css";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PAYMENT_METHODS from "../constants/paymentMethods";
import USERS from "../constants/users";
import {
  FaEdit,
  FaTrashAlt,
  FaCalendarAlt,
  FaStore,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function ExpenseItem({
  expense,
  onEdit,
  onDelete,
  categoryIcon,
}) {
  // Parsear fecha YYYY-MM-DD como local
  function parseLocalDate(dateString) {
    if (!dateString) return null;
    const [year, month, day] = dateString.split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  // Formato de fecha
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = parseLocalDate(dateString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Formato de monto
  const formatAmount = (amount) => {
    const nf = new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const [entero, decimales] = nf.format(Number(amount)).split(",");
    return (
      <>
        ${entero}
        <sup style={{ fontSize: "0.7em", opacity: 0.85, marginLeft: 1 }}>
          {decimales}
        </sup>
      </>
    );
  };

  return (
    <Card className={styles.expenseCard}>
      {/* Fecha y Monto */}
      <div className={styles.headerRow}>
        <div
          style={{ display: "flex", alignItems: "center", flex: 1, gap: 10 }}
        >
          <div className={styles.dateBox}>
            <FaCalendarAlt color="#a0aec0" size={14} />
            <Typography variant="body2" sx={{ color: "#e0e6f0" }}>
              {formatDate(expense.date)}
            </Typography>
          </div>
          {expense.place && (
            <div className={styles.localBox} style={{ marginLeft: 10 }}>
              <FaMapMarkerAlt color="#10b981" size={14} />
              <Typography
                variant="body2"
                sx={{ color: "#d1fae5", fontWeight: 500 }}
              >
                {expense.place}
              </Typography>
            </div>
          )}
        </div>
        {/* Badge del monto */}
        <div className={styles.amountBadge}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, letterSpacing: 0.5, textAlign: "center" }}
          >
            {formatAmount(expense.amount)}
          </Typography>
        </div>
      </div>

      {/* Categoría y Subcategoría */}
      <div className={styles.categoryRow}>
        {categoryIcon && <span style={{ marginRight: 0 }}>{categoryIcon}</span>}
        <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 600 }}>
          {expense.category}
        </Typography>
        {expense.subcategory && (
          <Typography variant="body2" sx={{ color: "#ccc", ml: 1 }}>
            {typeof expense.subcategory === "object"
              ? expense.subcategory.name
              : expense.subcategory}
          </Typography>
        )}
      </div>

      {/* Local */}

      {/* Métodos de pago y acciones */}
      <CardActions disableSpacing className={styles.actionsRow}>
        <div className={styles.chipsRow}>
          {expense.paymentMethod &&
            (() => {
              const pm = PAYMENT_METHODS.find(
                (p) => p.value === expense.paymentMethod
              ) || { bg: "#e0e0e0", color: "#424242" };
              return (
                <Chip
                  label={expense.paymentMethod}
                  size="small"
                  sx={{
                    backgroundColor: pm.bg,
                    color: pm.color,
                    fontWeight: 500,
                    fontSize: "0.75rem",
                  }}
                />
              );
            })()}
          {expense.paidBy &&
            (() => {
              const user = USERS.find((u) => u.value === expense.paidBy) || {
                bg: "#ececec",
                color: "#333",
              };
              return (
                <Chip
                  label={expense.paidBy}
                  size="small"
                  sx={{
                    backgroundColor: user.bg,
                    color: user.color,
                    fontWeight: 500,
                    fontSize: "0.75rem",
                  }}
                />
              );
            })()}
        </div>
        <div className={styles.actionButtons}>
          <IconButton
            size="small"
            onClick={() => onEdit(expense)}
            sx={{ color: "#bbb" }}
          >
            <FaEdit size={16} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              if (!expense._id) {
                console.error(
                  "Error: el gasto no tiene _id. No se puede eliminar.",
                  expense
                );
                alert(
                  "No se puede eliminar este gasto porque no tiene _id asignado."
                );
                return;
              }
              onDelete(expense._id);
            }}
            sx={{ color: "#b44" }}
          >
            <FaTrashAlt size={16} />
          </IconButton>
        </div>
      </CardActions>
    </Card>
  );
}
