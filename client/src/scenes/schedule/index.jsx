import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  FormControl,
  MenuItem,
  InputLabel,
  Fade,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "components/Header";
import { useSelector } from "react-redux";
import CustomColumnMenu from "components/DataGridCustomColumnMenu";
import useFetchSchedule from "./useFetchSchedule";
import useFetchGameIDs from "./useFetchGameID";
import { useNavigate } from "react-router-dom";
import { useGetTeamModelQuery } from "state/api";
import { useDispatch } from "react-redux";
import { setId, setTeamName, setGenderMode } from "state";
import Select from "@mui/material/Select";
import handleAddGame from "scenes/details/usePostGameData";
import useFetchAllGamesDetails from "./useFetchAllGamesDetails";
import { LoadingCircle } from "components/LoadingCircle";
import { ErrorMessageServer } from "components/ErrorMessageServer";
function Schedule() {
  //Teamdaten aus MongoDB auslesen
  const { data: teamData, isLoading, errorTeamModel } = useGetTeamModelQuery();
  const [team, setTeam] = React.useState("");
  const [group, setGroup] = useState("SW");
  const [gender, setGender] = useState("male");
  //Id aus GlobalState einlesen
  const dispatch = useDispatch();
  const teamId = useSelector((state) => state.global.teamId);
  const teamName = useSelector((state) => state.global.teamName);
  const theme = useTheme();
  const navigate = useNavigate();

  //Change Handle für Dropdown-Auswahl
  const handleTeamChange = (event) => {
    setTeam(event.target.value);
    const selectedTeam = event.target.value;
    dispatch(setId(selectedTeam));
    dispatch(
      setTeamName(teamData.find((team) => team.id === selectedTeam).name)
    );
    dispatch(setGenderMode(gender));
  };

  const handleGroupChange = (event) => {
    setGroup(event.target.value);
  };
  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const filteredTeams = (teamData || [])
    .filter((team) => team.group === group)
    .filter((team) => team.gender === gender)
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

  //Spielplan fetchen
  const { schedule, loading, error } = useFetchSchedule(teamId);

  //Zugehörigen gameIDs fetchen
  const { gameIDs, errorGameIDs } = useFetchGameIDs(teamId);

  //Daten mit GameIDs versehen
  const dataWithIDs = schedule.map((item, index) => ({
    ...item,
    gameID: gameIDs[index] || "N/A",
  }));
  const allGamesDetails = useFetchAllGamesDetails(gameIDs);
  const [isChecked, setIsChecked] = useState(false);
  useEffect(() => {
    setIsChecked(true);
    if (!allGamesDetails) return;
    if (allGamesDetails.length !== 30 && allGamesDetails.length !== 22) return;
    handleAddGame(allGamesDetails);
  }, [allGamesDetails, dispatch]);

  if (loading || isLoading) {
    return <LoadingCircle />;
  }

  if (error || errorTeamModel || errorGameIDs) {
    return <ErrorMessageServer />; // Fehlermeldung Rendern (später anpassen)
  }

  const cols = [
    {
      field: "team1",
      headerName: "Heimmannschaft",
      flex: 1,
      renderCell: (params) => {
        const { Heimspiel, Gegner } = params.row;
        if (!teamData || !Array.isArray(teamData)) {
          // Fallback-Wert, falls teamData nicht verfügbar ist
          return Heimspiel === "true" ? "Keine Daten verfügbar" : Gegner;
        }
        const Heimmannschaft = teamData.find((team) => team.id === teamId);
        if (Heimspiel === "true") {
          return Heimmannschaft.name;
        } else {
          return Gegner;
        }
      },
    },
    {
      field: "team2",
      headerName: "Gastmannschaft",
      flex: 1,
      renderCell: (params) => {
        const { Heimspiel, Gegner } = params.row;
        if (!teamData || !Array.isArray(teamData)) {
          // Fallback-Wert, falls teamData nicht verfügbar ist
          return Heimspiel === "true" ? "Keine Daten verfügbar" : Gegner;
        }
        const Heimmannschaft = teamData.find((team) => team.id === teamId);
        if (Heimspiel === "false") {
          return Heimmannschaft.name;
        } else {
          return Gegner;
        }
      },
    },
    {
      field: "Datum",
      headerName: "Datum",
      flex: 1,
    },
    {
      field: "Uhrzeit",
      headerName: "Uhrzeit",
      flex: 1,
    },
    {
      field: "Adresse",
      headerName: "Ort",
      flex: 1,
    },
  ];

  const row = dataWithIDs.map((row, index) => ({
    id: index,
    ...row,
    flex: 1,
  }));

  //OnClick zu GameDetails
  const handleCellClick = (param) => {
    navigate(`/details/${param.row.gameID}`);
  };

  //Log für die Entwicklung
  //console.log(schedule);

  return (
    <Box m="1.5rem  2.5rem">
      <Header
        title="SPIEPLAN"
        subtitle={`Spielplan von ${teamName}`}
        gridColumn="1/3"
      />
      {/*Staffelauswahl Dropdown*/}
      <Box display="flex" justifyContent="space-evenly" flexDirection="column">
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
          mt="2rem"
          mb="1rem"
          flex="1 1 100%"
          gap="1rem"
          borderRadius="0.55rem"
        >
          {/*Geschlecht Dropdown */}
          <FormControl sx={{ width: "300px" }}>
            <InputLabel
              id="Geschlechtauswahl"
              sx={{
                "&.Mui-focused": {
                  color: theme.palette.secondary[300],
                },
                color: theme.palette.secondary[200],
              }}
            >
              Geschlecht
            </InputLabel>
            <Select
              value={gender}
              onChange={handleGenderChange}
              label="gender"
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
              <MenuItem value="male">Männer</MenuItem>
              <MenuItem value="female">Damen</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ width: "300px" }}>
            <InputLabel
              id="Staffelauswahl"
              sx={{
                "&.Mui-focused": {
                  color: theme.palette.secondary[300],
                },
                color: theme.palette.secondary[200],
              }}
            >
              Staffel
            </InputLabel>
            <Select
              value={group}
              onChange={handleGroupChange}
              label="group"
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
              {gender === "male"
                ? [
                    <MenuItem value="SW">3. Liga Staffel Süd-West</MenuItem>,
                    <MenuItem value="S">3. Liga Staffel Süd</MenuItem>,
                    <MenuItem value="NO">3. Liga Staffel Nord-Ost</MenuItem>,
                    <MenuItem value="NW">3. Liga Staffel Nord-West</MenuItem>,
                  ]
                : [
                    <MenuItem value="N">3. Liga Staffel Nord</MenuItem>,
                    <MenuItem value="M">3. Liga Staffel Mitte</MenuItem>,
                    <MenuItem value="S">3. Liga Staffel Süd</MenuItem>,
                  ]}
            </Select>
          </FormControl>

          {/*Teamauswahl Dropdown*/}

          <FormControl sx={{ width: "300px" }}>
            <InputLabel
              id="Mannschaftsauswahl"
              sx={{
                "&.Mui-focused": {
                  color: theme.palette.secondary[300],
                },
                color: theme.palette.secondary[200],
              }}
            >
              Mannschaft
            </InputLabel>
            <Select
              value={team}
              label="mannschaft"
              onChange={handleTeamChange}
              variant="outlined"
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
              {isLoading ? (
                <MenuItem disabled>Loading...</MenuItem> // Anzeige während des Ladens
              ) : (
                filteredTeams?.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Box>
        <Fade in={isChecked} timeout={500}>
          <Box
            backgroundColor={theme.palette.background.alt}
            borderRadius="0.55rem"
            className="data-display"
            maxHeight="75vh"
            overflow="auto"
            sx={{
              "& .MuiDataGrid-root": {
                borderBottom: "none",
              },
              "& .MuiDataGrid-cell": {
                color: theme.palette.secondary[200],
                fontSize: 14,
              },

              "& .MuiDataGrid-columnHeaders": {
                color: theme.palette.secondary[200],
                borderBottom: "none",
                fontSize: 20,
              },

              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `${theme.palette.secondary[400]} !important`,
              },
              "& .MuiDataGrid-row": {
                "&:hover": {
                  backgroundColor: theme.palette.primary[600],
                  cursor: "pointer",
                },
              },
              "& .MuiDataGrid-footerContainer": {
                display: "none", // Ausblenden des Footers
              },
            }}
          >
            <DataGrid
              rows={row || []}
              columns={cols}
              components={{ ColumnMenu: CustomColumnMenu }}
              onCellClick={handleCellClick}
            />
          </Box>
        </Fade>
      </Box>
    </Box>
  );
}

export default Schedule;
