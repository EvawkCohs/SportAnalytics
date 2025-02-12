import React, { useState } from "react";
import { useRegisterUserMutation } from "state/api";
import {
  Box,
  TextField,
  Typography,
  useTheme,
  Button,
  CircularProgress,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Header from "components/Header";
import { useNavigate } from "react-router-dom";
import { useGetTeamModelQuery } from "state/api";
import { LoadingCircle } from "components/LoadingCircle";
import { ErrorMessageServer } from "components/ErrorMessageServer";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    vorname: "",
    nachname: "",
    strasse: "",
    plz: "",
    stadt: "",
    username: "",
    email: "",
    password: "",
    passwordWdh: "",
    mannschaft: "",
  });
  const {
    data: teamData,
    isLoadingTeam,
    errorTeamModel,
  } = useGetTeamModelQuery();
  const filteredTeams = teamData || [];
  const theme = useTheme();
  const Navigate = useNavigate();
  const handleNavigate = () => {
    Navigate(`/einloggen`);
  };
  const [registerUser, { isLoading, isSuccess, isError, error }] =
    useRegisterUserMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.vorname.length === 0) {
      alert("Bitte geben Sie einen Vornamen an!");
      return;
    }
    if (formData.nachname.length === 0) {
      alert("Bitte geben Sie einen Nachnamen an!");
      return;
    }
    if (formData.strasse.length === 0) {
      alert("Bitte geben Sie eine Straße an!");
      return;
    }
    if (formData.plz.length === 0) {
      alert("Bitte geben Sie eine Postleitzahl an!");
      return;
    }
    if (formData.stadt.length === 0) {
      alert("Bitte geben Sie eine Stadt an!");
      return;
    }
    if (!formData.email.includes("@")) {
      alert("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return;
    }

    if (formData.password.length < 6) {
      alert("Das Passwort muss mindestens 6 Zeichen lang sein.");
      return;
    }
    if (formData.username.length < 6) {
      alert("Der Nutzername muss mindestens 6 Zeichen lang sein.");
      return;
    }
    if (formData.password !== formData.passwordWdh) {
      alert("Die Passwörter stimmen nicht überein!");
      return;
    }
    try {
      await registerUser(formData).unwrap(); // Mutation ausführen
      alert("Registrierung erfolgreich! Bitte loggen Sie sich ein.");
      Navigate(`/einloggen`);
      setFormData({ username: "", email: "", password: "" }); // Felder zurücksetzen
    } catch (err) {
      console.error("Registrierungsfehler:", err);
    }
  };
  if (isLoadingTeam) {
    return <LoadingCircle />;
  }
  if (errorTeamModel) {
    return <ErrorMessageServer />;
  }

  return (
    <Box m="1.25rem 2.5rem">
      <Header
        title="REGISTRIERUNG"
        subtitle="Registrieren Sie sich als neuer Nutzer"
      />
      <Box display="flex" flexDirection="column" gap="1rem" alignItems="center">
        <Box
          display="flex"
          flexDirection="row"
          gap="1rem"
          alignItems="flex-start"
          mt="2rem"
          justifyContent="center"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="flex-start"
            gap="1rem"
          >
            <Typography
              variant="h4"
              sx={{ color: theme.palette.secondary[200] }}
            >
              Persönliche Daten:
            </Typography>
            <Divider orientation="horizontal" flexItem />
            <TextField
              name="vorname"
              label="Vorname"
              variant="outlined"
              value={formData.vorname}
              onChange={handleChange}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: theme.palette.grey[400],
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.secondary[300],
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.secondary[300],
                  },
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.grey[400],
                },
                "&:hover .MuiInputLabel-root": {
                  color: theme.palette.secondary[200],
                },
                "& .Mui-focused .MuiInputLabel-root": {
                  color: theme.palette.secondary[200],
                },
              }}
            />
            <TextField
              name="nachname"
              label="Nachname"
              variant="outlined"
              value={formData.nachname}
              onChange={handleChange}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: theme.palette.grey[400],
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.secondary[300],
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.secondary[300],
                  },
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.grey[400],
                },
                "&:hover .MuiInputLabel-root": {
                  color: theme.palette.secondary[200],
                },
                "& .Mui-focused .MuiInputLabel-root": {
                  color: theme.palette.secondary[200],
                },
              }}
            />
            <TextField
              name="strasse"
              label="Straße + Hausnummer"
              variant="outlined"
              value={formData.strasse}
              onChange={handleChange}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: theme.palette.grey[400],
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.secondary[300],
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.secondary[300],
                  },
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.grey[400],
                },
                "&:hover .MuiInputLabel-root": {
                  color: theme.palette.secondary[200],
                },
                "& .Mui-focused .MuiInputLabel-root": {
                  color: theme.palette.secondary[200],
                },
              }}
            />
            <TextField
              name="plz"
              label="PLZ"
              variant="outlined"
              value={formData.plz}
              onChange={handleChange}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: theme.palette.grey[400],
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.secondary[300],
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.secondary[300],
                  },
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.grey[400],
                },
                "&:hover .MuiInputLabel-root": {
                  color: theme.palette.secondary[200],
                },
                "& .Mui-focused .MuiInputLabel-root": {
                  color: theme.palette.secondary[200],
                },
              }}
            />
            <TextField
              name="stadt"
              label="Stadt"
              variant="outlined"
              value={formData.stadt}
              onChange={handleChange}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: theme.palette.grey[400],
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.secondary[300],
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.secondary[300],
                  },
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.grey[400],
                },
                "&:hover .MuiInputLabel-root": {
                  color: theme.palette.secondary[200],
                },
                "& .Mui-focused .MuiInputLabel-root": {
                  color: theme.palette.secondary[200],
                },
              }}
            />
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="flex-start"
            gap="1rem"
          >
            <Typography
              variant="h4"
              sx={{ color: theme.palette.secondary[200] }}
            >
              Nutzerdaten:{" "}
            </Typography>
            <Divider orientation="horizontal" flexItem />
            <TextField
              name="username"
              label="Benutzername"
              variant="outlined"
              value={formData.username}
              onChange={handleChange}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: theme.palette.grey[400],
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.secondary[300],
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.secondary[300],
                  },
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.grey[400],
                },
                "&:hover .MuiInputLabel-root": {
                  color: theme.palette.secondary[200],
                },
                "& .Mui-focused .MuiInputLabel-root": {
                  color: theme.palette.secondary[200],
                },
              }}
            />
            <TextField
              name="email"
              label="E-mail"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: theme.palette.grey[400],
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.secondary[300],
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.secondary[300],
                  },
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.grey[400],
                },
                "&:hover .MuiInputLabel-root": {
                  color: theme.palette.secondary[200],
                },
                "& .Mui-focused .MuiInputLabel-root": {
                  color: theme.palette.secondary[200],
                },
              }}
            />
            <TextField
              name="password"
              label="Passwort"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              required
              type="password"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: theme.palette.grey[400],
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.secondary[300],
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.secondary[300],
                  },
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.grey[400],
                },
                "&:hover .MuiInputLabel-root": {
                  color: theme.palette.secondary[200],
                },
                "& .Mui-focused .MuiInputLabel-root": {
                  color: theme.palette.secondary[200],
                },
              }}
            />
            <TextField
              name="passwordWdh"
              label="Passwort wiederholen"
              variant="outlined"
              value={formData.passwordWdh}
              onChange={handleChange}
              required
              type="password"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: theme.palette.grey[400],
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.secondary[300],
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.secondary[300],
                  },
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.grey[400],
                },
                "&:hover .MuiInputLabel-root": {
                  color: theme.palette.secondary[200],
                },
                "& .Mui-focused .MuiInputLabel-root": {
                  color: theme.palette.secondary[200],
                },
              }}
            />
            <FormControl fullWidth>
              <InputLabel
                id="Mannschaftsauswahl"
                sx={{
                  "&.Mui-focused": {
                    color: theme.palette.secondary[300],
                  },
                  color: theme.palette.secondary[200],
                }}
              >
                Lieblingsmannschaft
              </InputLabel>
              <Select
                name="mannschaft"
                value={formData.mannschaft}
                label="Lieblingsmannschaft"
                onChange={handleChange}
                variant="outlined"
                fullWidth
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
                {isLoadingTeam ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : (
                  filteredTeams.map((team) => (
                    <MenuItem key={team.name} value={team.name}>
                      {team.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? <CircularProgress size={24} /> : "Registrieren"}
        </Button>

        <Typography
          variant="h5"
          sx={{
            color: theme.palette.secondary[100],
            ":hover": {
              cursor: "pointer",
              color: theme.palette.secondary[100],
              textDecoration: "underline",
            },
          }}
          onClick={handleNavigate}
        >
          Bereits ein Benutzerkonto? Hier einloggen
        </Typography>
      </Box>
      {isSuccess && (
        <Typography color="success.main" align="center">
          Registrierung erfolgreich! Bitte loggen Sie sich ein.
        </Typography>
      )}
      {isError && (
        <Typography color="error.main" align="center">
          Fehler:{" "}
          {error?.status === "FETCH_ERROR"
            ? "Server derzeit nicht erreichbar"
            : "Es ist etwas schief gelaufen."}
        </Typography>
      )}
    </Box>
  );
};
export default RegisterPage;
