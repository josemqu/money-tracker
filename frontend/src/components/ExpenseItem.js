import React, { useState, useRef } from "react";
import { formatDateWithRelativeDay } from "../utils/dateUtils";
import Card from "@mui/material/Card";
import styles from "./ExpenseItem.module.css";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import PAYMENT_METHODS from "../constants/paymentMethods";
import USERS from "../constants/users";
import {
  FaEdit,
  FaTrashAlt,
  FaCalendarAlt,
  FaStore,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Dialog from "@mui/material/Dialog";
import Tooltip from "@mui/material/Tooltip";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

export default function ExpenseItem({
  expense,
  onEdit,
  onDelete,
  categoryIcon,
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const tooltipRef = useRef(null);

  const handleTooltipOpen = () => {
    setTooltipOpen(true);
    // Cerrar después de 2 segundos
    setTimeout(() => {
      setTooltipOpen(false);
    }, 2000);
  };

  const handleTooltipClose = () => {
    setTooltipOpen(false);
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
        <div className={styles.dateBox}>
          <FaCalendarAlt color="#a0aec0" size={14} />
          <Typography variant="body2" sx={{ color: "#e0e6f0" }}>
            {new Date(expense.date).toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            })}
          </Typography>
        </div>
        <Tooltip
          title={expense.place}
          placement="top"
          arrow
          open={tooltipOpen}
          onClose={handleTooltipClose}
          disableFocusListener
          disableHoverListener
          disableTouchListener
        >
          <div
            className={styles.localBox}
            onClick={handleTooltipOpen}
            ref={tooltipRef}
            style={{ cursor: "pointer" }}
          >
            <FaMapMarkerAlt
              color="#10b981"
              style={{
                minWidth: 14,
                minHeight: 14,
                flexShrink: 0,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: "#d1fae5",
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {expense.place}
            </Typography>
          </div>
        </Tooltip>
        {/* Badge del monto */}
        <div style={{ flex: 1 }} />
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
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    textShadow: "0 0 1px rgba(0, 0, 0, 0.2)",
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
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    textShadow: "0 0 1px rgba(0, 0, 0, 0.2)",
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
              setConfirmOpen(true);
            }}
            sx={{ color: "#b44" }}
          >
            <FaTrashAlt size={16} />
          </IconButton>

          {/* Pop-up de confirmación para borrar */}
          <Dialog
            open={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            aria-labelledby="confirm-dialog-title"
          >
            <DialogTitle id="confirm-dialog-title">
              ¿Eliminar gasto?
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                ¿Estás seguro de que deseas eliminar este gasto? Esta acción no
                se puede deshacer.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmOpen(false)} color="primary">
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  setConfirmOpen(false);
                  onDelete(expense._id);
                }}
                color="error"
                variant="contained"
                autoFocus
              >
                Eliminar
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </CardActions>
    </Card>
  );
}
