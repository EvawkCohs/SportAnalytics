import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  Box,
  FormControl,
  useTheme,
} from "@mui/material";

export const ConfirmDeleteDialog = ({ open, onClose, onConfirm }) => {
  const theme = useTheme();
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ color: theme.palette.secondary[400], fontSize: 20 }}>
        Bestätigung erforderlich !
      </DialogTitle>
      <DialogContent sx={{ color: theme.palette.secondary[200] }}>
        Möchtest du die ausgewählten Events wirklich löschen ?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Abbrechen
        </Button>
        <Button onClick={onConfirm} color="success">
          Löschen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const ConfirmReloadDialog = ({ open, onClose, onConfirm }) => {
  const theme = useTheme();
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ color: theme.palette.secondary[400], fontSize: 20 }}>
        Bestätigung erforderlich !
      </DialogTitle>
      <DialogContent sx={{ color: theme.palette.secondary[200] }}>
        Möchtest du die ursprünglichen Eventdaten neu laden?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="warning">
          Abbrechen
        </Button>
        <Button onClick={onConfirm} color="success">
          Laden
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export const ConfirmSaveDialog = ({ open, onClose }) => {
  const theme = useTheme();
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ color: theme.palette.secondary[400], fontSize: 20 }}>
        Speichern der Eventdaten
      </DialogTitle>
      <DialogContent sx={{ color: theme.palette.secondary[200] }}>
        Daten wurden erfolgreich lokal gespeichert!
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="warning">
          Schließen
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
  const theme = useTheme();
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ color: theme.palette.secondary[200] }}>
        Neues Event hinzufügen
      </DialogTitle>
      <DialogContent>
        <Box display="flex" gap="1rem" justifyContent="center" mt="1rem">
          <FormControl sx={{ minWidth: 100 }}>
            <InputLabel
              id="event-select-label"
              sx={{
                "&.Mui-focused": { color: theme.palette.secondary[200] },
                color: theme.palette.secondary[200],
              }}
            >
              Event
            </InputLabel>
            <Select
              value={type}
              label="Event"
              onChange={onChangeType}
              autoWidth
              defaultValue=""
              sx={{
                "&.MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: theme.palette.secondary[200], // Standardborderfarbe
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.secondary[500], // Farbe beim Hovern
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.secondary[500], // Farbe beim Fokussieren
                  },
                },
                "& .MuiSelect-select": {
                  color: theme.palette.secondary[200],
                },
                "& .MuiSelect-select.MuiSelect-select": {
                  color: theme.palette.secondary[200],
                },
              }}
            >
              <MenuItem value={"technicalFault"}>Technischer Fehler</MenuItem>
              <MenuItem value={"assist"}>Assist</MenuItem>  
              <MenuItem value={"save"}>Parade</MenuItem>
              <MenuItem value={"fastbreak"}>Gegenstoß</MenuItem>
              <MenuItem value={"missedShotCloseRange"}>Fehlwurf (nah)</MenuItem>
              <MenuItem value={"missedShotDistance"}>Fehlwurf (fern)</MenuItem>
              <MenuItem value={"offensiveFoul"}>Stürmerfoul</MenuItem>
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
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: theme.palette.secondary[200],
                },
                "&:hover fieldset": {
                  borderColor: theme.palette.secondary[500],
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.secondary[500],
                },
              },
              "& .MuiInputLabel-root": {
                color: theme.palette.secondary[200],
              },
              "&:hover .MuiInputLabel-root": {
                color: theme.palette.secondary[200],
              },
              "& .Mui-focused .MuiInputLabel-root": {
                color: theme.palette.secondary[200],
              },
            }}
          />
          <FormControl sx={{ minWidth: 100 }} variant="outlined">
            <InputLabel
              id="team-select-label"
              sx={{
                "&.Mui-focused": { color: theme.palette.secondary[200] },
                color: theme.palette.secondary[200],
              }}
            >
              Team
            </InputLabel>
            <Select
              label="Team"
              value={team}
              onChange={onChangeTeam}
              autoWidth
              defaultValue="Home"
              sx={{
                "&.MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: theme.palette.secondary[200], // Standardborderfarbe
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.secondary[500], // Farbe beim Hovern
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.secondary[500], // Farbe beim Fokussieren
                  },
                },
                "& .MuiSelect-select": {
                  color: theme.palette.secondary[200],
                },
                "& .MuiSelect-select.MuiSelect-select": {
                  color: theme.palette.secondary[200],
                },
              }}
            >
              <MenuItem
                value={"Home"}
                sx={{ color: theme.palette.secondary[200] }}
              >
                Heim
              </MenuItem>
              <MenuItem
                value={"Away"}
                sx={{ color: theme.palette.secondary[200] }}
              >
                Auswärts
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0, 2rem",
        }}
      >
        <Button onClick={onClose} color="error">
          Abbrechen
        </Button>
        <Button onClick={onConfirm} color="success">
          Hinzufügen
        </Button>
      </DialogActions>
    </Dialog>
  );
};
