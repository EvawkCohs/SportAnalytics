import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

const ConfirmDeleteDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Bestätigung erforderlich</DialogTitle>
      <DialogContent>
        Möchtest du die ausgewählten Events wirklich löschen?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button onClick={onConfirm} color="error">
          Löschen
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmDeleteDialog;
