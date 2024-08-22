import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  Box,
  FormControl,
} from "@mui/material";

export const ConfirmDeleteDialog = ({ open, onClose, onConfirm, text }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Bestätigung erforderlich</DialogTitle>
      <DialogContent>{text}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button onClick={onConfirm} color="error">
          Löschen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const ConfirmReloadDialog = ({ open, onClose, onConfirm, text }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Bestätigung erforderlich</DialogTitle>
      <DialogContent>{text}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button onClick={onConfirm} color="success">
          Laden
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const AddEventDialog = ({
  open,
  onClose,
  onConfirm,
  onChangeTeam,
  onChangeType,
  onChangeTextField,
  type,
  team,
  error,
  helperText,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Neues Event hinzufügen</DialogTitle>
      <DialogContent>
        <Box display="flex" gap="1rem" justifyContent="center" mt="1rem">
          <FormControl sx={{ minWidth: 100 }}>
            <Select
              labelId="type-select"
              id="type-select"
              value={type}
              label="Art"
              onChange={onChangeType}
              autoWidth
              defaultValue="Technischer Fehler"
            >
              <MenuItem value={"Technischer Fehler"}>
                Technischer Fehler
              </MenuItem>
              <MenuItem value={"Assist"}>Assist</MenuItem>
              <MenuItem value={"Fehlwurf"}>Fehlwurf</MenuItem>
            </Select>
          </FormControl>
          <TextField
            id="Trikotnummer"
            label="Trikotnummer"
            variant="outlined"
            onChange={onChangeTextField}
            error={error}
            helperText={helperText}
            sx={{
              minHeight: "80px",
              minWidth: "150px",
              "& .MuiFormHelperText-root": {
                height: "20px",
                width: "150px",
              },
            }}
          />
          <FormControl sx={{ minWidth: 100 }}>
            <Select
              labelId="team-select"
              id="team-select"
              value={team}
              label="Team"
              onChange={onChangeTeam}
              autoWidth
              defaultValue="Home"
            >
              <MenuItem value={"Home"}>Heim</MenuItem>
              <MenuItem value={"Away"}>Auswärts</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button onClick={onConfirm} color="success">
          Hinzufügen
        </Button>
      </DialogActions>
    </Dialog>
  );
};
