import React from "react";
import {
  Box,
  FormControl,
  useTheme,
  InputLabel,
  MenuItem,
  Typography,
} from "@mui/material";
import Select from "@mui/material/Select";
import { useGetTeamModelQuery, useGetTeamQuery } from "state/api";
import { DataGrid } from "@mui/x-data-grid";
import Header from "components/Header";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setId } from "state";

function GameIDs() {
  const [team, setTeam] = React.useState("");
  const dispatch = useDispatch();
  const theme = useTheme();
  const teamId = useSelector((state) => state.global.teamId);
  const handleChange = (event) => {
    setTeam(event.target.value);
    const selectedTeam = event.target.value;
    dispatch(setId(selectedTeam));
  };

  const { data, isLoading } = useGetTeamQuery(teamId);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Mannschaften" subtitle="Liste aller Mannschaften" />

      <Box>
        <FormControl fullWidth>
          <InputLabel id="Mannschaftsauswahl">Mannschaft</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={team}
            label="team"
            onChange={handleChange}
          >
            <MenuItem value={"sportradar.dhbdata.489-1648"}>
              Bergische Panther
            </MenuItem>
            <MenuItem value={"sportradar.dhbdata.1893-1648"}>
              HLZ Friesenheim-Hochdorf II
            </MenuItem>
            <MenuItem value={"sportradar.dhbdata.885-1648"}>
              VTV Mundenheim 1883
            </MenuItem>
            <MenuItem value={"sportradar.dhbdata.420-1648"}>
              HSG Dutenhofen-Münchholzhausen II
            </MenuItem>
            <MenuItem value={"sportradar.dhbdata.453-1648"}>
              Longericher SC Köln
            </MenuItem>
            <MenuItem value={"sportradar.dhbdata.417-1648"}>
              HSG Rodgau Nieder-Roden
            </MenuItem>
            <MenuItem value={"sportradar.dhbdata.513-1648"}>
              TSG Haßloch
            </MenuItem>
            <MenuItem value={"sportradar.dhbdata.516-1648"}>
              HG Saarlouis
            </MenuItem>
            <MenuItem value={"sportradar.dhbdata.411-1648"}>
              TV Gelnhausen
            </MenuItem>
            <MenuItem value={"sportradar.dhbdata.438-1648"}>
              Saase3Leutershausen
            </MenuItem>
            <MenuItem value={"sportradar.dhbdata.2715-1648"}>
              TuS 1882 Opladen
            </MenuItem>
            <MenuItem value={"sportradar.dhbdata.3506-1648"}>
              TV Aldekerk 07
            </MenuItem>
            <MenuItem value={"sportradar.dhbdata.426-1648"}>HSG Hanau</MenuItem>
            <MenuItem value={"sportradar.dhbdata.3899-1648"}>
              TV Korschenbroich
            </MenuItem>
            <MenuItem value={"sportradar.dhbdata.2700-1648"}>
              HSG Krefeld Niederrhein
            </MenuItem>
            <MenuItem value={"sportradar.dhbdata.1881-1648"}>
              TV Kirchzell
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box>
        <Typography variant="h2">{teamId}</Typography>
      </Box>
    </Box>
  );
}
export default GameIDs;
