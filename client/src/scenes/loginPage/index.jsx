import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  CircularProgress,
  TextField,
} from "@mui/material";
import Header from "components/Header";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLogInUserMutation } from "state/api";
import { useGetTeamModelQuery } from "state/api";
import { setId, setTeamName } from "state";

const LoginPage = () => {
  const { data: teamData, isLoadingTeam } = useGetTeamModelQuery();
  const [team, setTeam] = React.useState("");
  const dispatch = useDispatch();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loginUser, { isLoading, isSuccess, isError, error }] =
    useLogInUserMutation();
  const Navigate = useNavigate();
  const handleNavigate = () => {
    Navigate(`/registrieren`);
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData).unwrap();
      const { token, user } = response;
      localStorage.setItem("token", token);
      alert(`Willkommen zurück, ${user.username}!`);
      setFormData({ username: "", password: "" });
      const newTeam = teamData.filter((team) => team.name === user.mannschaft);
      dispatch(setId(newTeam[0].id));
      dispatch(setTeamName(newTeam[0].name));
      Navigate(`/dashboard`);
    } catch (err) {
      console.error("Login-Fehler:", err);
    }
  };

  return (
    <Box m="1.25rem 2.5rem">
      <Header
        title="LOGIN"
        subtitle="Loggen sie sich ein, um weitere Funktionen der App zu nutzen"
      />
      <Box
        display="flex"
        flexDirection="column"
        gap="1rem"
        mt="2rem"
        alignItems="center"
      >
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
                borderColor: theme.palette.grey[700],
              },
              "&:hover fieldset": {
                borderColor: theme.palette.secondary[300],
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.secondary[300],
              },
            },
            "& .MuiInputLabel-root": {
              color: theme.palette.grey[700],
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
                borderColor: theme.palette.grey[700],
              },
              "&:hover fieldset": {
                borderColor: theme.palette.secondary[300],
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.secondary[300],
              },
            },
            "& .MuiInputLabel-root": {
              color: theme.palette.grey[700],
            },
            "&:hover .MuiInputLabel-root": {
              color: theme.palette.secondary[200],
            },
            "& .Mui-focused .MuiInputLabel-root": {
              color: theme.palette.secondary[200],
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading || isLoadingTeam}
          onClick={handleSubmit}
        >
          {isLoading ? <CircularProgress size={24} /> : "Login"}
        </Button>
        <Typography
          variant="h5"
          sx={{
            color: theme.palette.secondary[200],
            ":hover": {
              cursor: "pointer",
              color: theme.palette.secondary[100],
              textDecoration: "underline",
            },
          }}
          onClick={handleNavigate}
        >
          Noch kein Benutzerkonto? Hier registrieren
        </Typography>
      </Box>
      {isSuccess && (
        <Typography color="success.main" align="center" mt={2}>
          Login erfolgreich!
        </Typography>
      )}
      {isError && (
        <Typography color="error.main" align="center" mt={2}>
          Fehler: {error?.data?.message || "Ungültige Anmeldedaten."}
        </Typography>
      )}
    </Box>
  );
};
export default LoginPage;
