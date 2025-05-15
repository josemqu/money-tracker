import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { FaEdit, FaTrashAlt, FaCalendarAlt, FaStore, FaMapMarkerAlt } from "react-icons/fa";

export default function ExpenseItem({
  expense,
  onEdit,
  onDelete,
  categoryIcon,
}) {
  // Formato de fecha
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
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
    <Card
      sx={{
        background: "#232323",
        color: "#fff",
        borderRadius: 8,
        marginBottom: 12,
        padding: 16,
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        position: "relative",
      }}
    >
      {/* Fecha y Monto */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FaCalendarAlt color="#a0aec0" size={14} />
          <Typography variant="body2" sx={{ color: "#e0e6f0" }}>
            {formatDate(expense.date)}
          </Typography>
        </Box>
        
        {/* Badge del monto */}
        <Box 
          sx={{
            background: "linear-gradient(90deg, #2d3748 0%, #1a202c 100%)",
            color: "#fff",
            borderRadius: "12px",
            padding: "8px 16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            display: "inline-block",
            fontWeight: "bold",
            minWidth: "110px",
            textAlign: "center"
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.5, textAlign: "center" }}>
            {formatAmount(expense.amount)}
          </Typography>
        </Box>
      </Box>

      {/* Categoría y Subcategoría */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        {categoryIcon && <Box sx={{ mr: 0.5 }}>{categoryIcon}</Box>}
        <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600 }}>
          {expense.category}
        </Typography>
        {expense.subcategory && (
          <Typography variant="body2" sx={{ color: '#ccc', ml: 1 }}>
            {expense.subcategory}
          </Typography>
        )}
      </Box>

      {/* Local */}
      <CardContent sx={{ pt: 0, pb: 1 }}>
        {expense.local && (
          <Box 
            sx={{
              display: "flex", 
              alignItems: "center", 
              gap: 1.5,
              backgroundColor: "rgba(6, 78, 59, 0.3)",
              borderRadius: "6px",
              padding: "6px 12px",
              width: "fit-content",
              mb: 1
            }}
          >
            <FaMapMarkerAlt color="#10b981" size={14} />
            <Typography variant="body2" sx={{ color: "#d1fae5", fontWeight: 500 }}>
              {expense.local}
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Métodos de pago y acciones */}
      <CardActions
        disableSpacing
        sx={{ justifyContent: "space-between", px: 2, pt: 0 }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          {expense.paymentMethod && (
            <Chip
              label={expense.paymentMethod}
              size="small"
              sx={{
                backgroundColor:
                  expense.paymentMethod === "Crédito"
                    ? "#e3f0ff"
                    : expense.paymentMethod === "Efectivo"
                    ? "#e5f8e5"
                    : expense.paymentMethod === "Contado"
                    ? "#e5f8e5"
                    : expense.paymentMethod === "Débito"
                    ? "#fff8e1"
                    : expense.paymentMethod === "Transferencia"
                    ? "#e8eaf6"
                    : expense.paymentMethod === "MercadoPago"
                    ? "#e1f5fe"
                    : "#e0e0e0",
                color:
                  expense.paymentMethod === "Crédito"
                    ? "#205080"
                    : expense.paymentMethod === "Efectivo"
                    ? "#1b5e20"
                    : expense.paymentMethod === "Contado"
                    ? "#1b5e20"
                    : expense.paymentMethod === "Débito"
                    ? "#bf8f00"
                    : expense.paymentMethod === "Transferencia"
                    ? "#3949ab"
                    : expense.paymentMethod === "MercadoPago"
                    ? "#0288d1"
                    : "#424242",
                fontWeight: 500,
                fontSize: "0.75rem",
              }}
            />
          )}
          {expense.paidBy && (
            <Chip
              label={expense.paidBy}
              size="small"
              sx={{
                backgroundColor:
                  expense.paidBy === "José"
                    ? "#e1fbe7"
                    : expense.paidBy === "Maru"
                    ? "#f3e1fb"
                    : "#ececec",
                color:
                  expense.paidBy === "José"
                    ? "#1a6d3b"
                    : expense.paidBy === "Maru"
                    ? "#6d1a6d"
                    : "#333",
                fontWeight: 500,
                fontSize: "0.75rem",
              }}
            />
          )}
        </Box>
        <Box>
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
        </Box>
      </CardActions>
    </Card>
  );
}
