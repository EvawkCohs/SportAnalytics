import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  useTheme,
  Typography,
  IconButton,
  TextField,
} from "@mui/material";
import Header from "components/Header";
import ReactPlayer from "react-player";
import SimpleButton from "components/SimpleButton";
import LightTooltip from "components/LightTooltip";
import { useGetGameModelQuery, usePostUserGameMutation } from "state/api";
import { DataGrid } from "@mui/x-data-grid";
import CustomColumnMenu from "components/DataGridCustomColumnMenu";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import {
  AddEventDialog,
  ConfirmDeleteDialog,
  ConfirmReloadDialog,
  ConfirmSaveDialog,
} from "components/Dialogs";
import axios from "axios";

function VideoAnalyse() {
  const { id } = useParams();
  const theme = useTheme();
  const gameData = useGetGameModelQuery(id);

  const [videoUrl, setVideoUrl] = useState(null);
  const [eventData, setEventData] = useState([]);
  //Referenz zum Videoplayer
  const videoRef = useRef(null);

  //Startzeiten setzen
  const [gameStart, setGameStart] = useState("");
  const [secondHalfStart, setSecondHalfStart] = useState("");
  const [error, setError] = useState({
    firstHalfTime: false,
    secondHalfTime: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [profile, setProfile] = useState(null);
  const [errorProfile, setErrorProfile] = useState("");
  const [
    postUserGame,
    {
      isLoadingPostUserGame,
      isSuccessPostUserGame,
      isErrorPostUserGame,
      errorPostUserGame,
    },
  ] = usePostUserGameMutation();
  //Startzeiten validieren
  const validateTime = (time) => {
    const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/; // HH:MM format
    return regex.test(time);
  };
  const [userGameData, setUserGameData] = useState({
    userId: "",
    summary: {},
    lineup: {},
    events: [],
  });
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setErrorProfile(
            `Sie sind derzeit nicht eingeloggt! Bitte loggen Sie sich ein, um das Profil zu sehen.`
          );
          return;
        }
        const apiUrl = process.env.API_URL || "http://localhost:5001";
        const response = await axios.get(`${apiUrl}/users/profile`, {
          headers: { Authorization: `bearer ${token}` },
        });

        setProfile(response.data);
      } catch (err) {
        setErrorProfile(
          "Fehler beim Abrufen des Profils: " + err.response?.data?.message ||
            err.message
        );
      }
    };

    fetchProfile();
  }, []); // Dieser Effekt wird nur beim ersten Rendern ausgeführt

  useEffect(() => {
    if (!profile || !profile.username || !id) return;

    const fetchGame = async (gameId, userId) => {
      try {
        const response = await axios.get(
          `http://localhost:5001/userGames/findUserGames`,
          { params: { gameId, userId } }
        );
        const specificGameData = response.data;
        setUserGameData((prevData) => ({
          ...prevData,
          summary: specificGameData.summary,
          lineup: specificGameData.lineup,
          events: specificGameData.events,
        }));
        setEventData(specificGameData.events);
      } catch (err) {
        console.error(
          "Kein benutzerdefiniertes Spiel gefunden, verwende Handball.net",
          err
        );
        setUserGameData((prevData) => ({
          ...prevData,
          summary: gameData.data.summary,
          lineup: gameData.data.lineup,
        }));
        setEventData(gameData.data.events);
      }
    };

    fetchGame(id, profile.username);
  }, [profile, id]); // Der Effekt wird erneut ausgeführt, wenn sich `profile` oder `id` ändert

  //Col + Row Definitions für DataGrid
  const cols = [
    {
      field: "message",
      headerName: "Events",
      headerAlign: "center",
      align: "left",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return `${params.row.time !== "" ? `${params.row.time} | ` : ""}${
          params.row.message
        }${
          params.row.score !== "" && params.row.score !== null
            ? ` | ${String(params.row.score).split("-")[0]} : ${
                String(params.row.score).split("-")[1]
              }`
            : ""
        }`;
      },
    },
  ];
  const row = eventData.map((row, index) => ({
    id: index,
    ...row,
    flex: 1,
  }));

  //Variablen für delete-handler
  const [rowDeletionIds, setRowDeletionIds] = useState([]);

  //DateiInputHandle
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoUrl(URL.createObjectURL(file));
    }
  };
  //Drag-and-Drop Handle
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setVideoUrl(URL.createObjectURL(file));
    }
  };
  //Drag-Over Handle
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  //Anfangszeiten speichern
  const handleTimeSave = () => {
    const isFirstHalfTimeValid = validateTime(gameStart);
    const isSecondHalfTimeValid = validateTime(secondHalfStart);

    if (isFirstHalfTimeValid && isSecondHalfTimeValid) {
      // Zeit speichern

      setError({ gameStart: false, secondHalfStart: false });
      setErrorMessage("");
    } else {
      // Fehlerzustand aktivieren
      setError({
        firstHalfTime: !isFirstHalfTimeValid,
        secondHalfTime: !isSecondHalfTimeValid,
      });
      setErrorMessage("Bitte geben Sie die Zeit im Format HH:MM:SS ein.");
    }
  };

  //Umwandeln von event.time-timestrings in Sekunden
  function timeToSeconds(timeString) {
    const [minutes, seconds] = timeString.split(":").map(Number);
    return minutes * 60 + seconds;
  }

  //Eventclick handler
  const handleEventClick = (event) => {
    if (gameStart === "" || secondHalfStart === "") {
      alert("Bitte setzen sie erst die Startzeiten!");
      return;
    }

    const eventTimestamp = event.timestamp;
    let diffInSeconds = 0;
    let [hours, minutes, seconds] = [0, 0, 0];
    let startTimeSeconds = 0;

    //1.HZ
    if (event.time !== "") {
      if (timeToSeconds(event.time) < timeToSeconds("30:00")) {
        const gameStartTimestamp = eventData[eventData.length - 1].timestamp;
        [hours, minutes, seconds] = gameStart.split(":").map(Number);
        startTimeSeconds = hours * 3600 + minutes * 60 + seconds;
        // Berechne die Differenz in Sekunden
        diffInSeconds = (eventTimestamp - gameStartTimestamp) / 1000;
      }
      //2.HZ
      else if (timeToSeconds(event.time) >= timeToSeconds("30:00")) {
        const secondHalfTimeTimestamp = eventData.find(
          (event) => event.type === "StartPeriod" && event.time === "30:00"
        ).timestamp;
        [hours, minutes, seconds] = secondHalfStart.split(":").map(Number);
        startTimeSeconds = hours * 3600 + minutes * 60 + seconds;
        // Berechne die Differenz in Sekunden
        diffInSeconds = (eventTimestamp - secondHalfTimeTimestamp) / 1000;
      }
      //Event genau auf der Grenze
      else if (timeToSeconds(event.time) === timeToSeconds("30:00")) {
        //2.HZ beginnt
        if (event.type === "StartPeriod") {
          const secondHalfTimeTimestamp = eventData.find(
            (event) => event.type === "StartPeriod" && event.time === "30:00"
          ).timestamp;
          [hours, minutes, seconds] = secondHalfStart.split(":").map(Number);
          startTimeSeconds = hours * 3600 + minutes * 60 + seconds;
          // Berechne die Differenz in Sekunden
          diffInSeconds = (eventTimestamp - secondHalfTimeTimestamp) / 1000;
        }
        //1.HZ endet
        else {
          const gameStartTimestamp = eventData[eventData.length - 1].timestamp;
          [hours, minutes, seconds] = gameStart.split(":").map(Number);
          startTimeSeconds = hours * 3600 + minutes * 60 + seconds;
          // Berechne die Differenz in Sekunden
          diffInSeconds = (eventTimestamp - gameStartTimestamp) / 1000;
        }
      }
      //Videoplayer an entsprechende Stelle springen lassen
      if (videoRef.current) {
        videoRef.current.seekTo(startTimeSeconds + diffInSeconds, "seconds");
      }
    } else {
      if (videoRef.current) {
        videoRef.current.seekTo(event.currentTime);
      }
    }
  };

  //Dialog Handler für Löschen der Daten
  const [openDialogDeletion, setOpenDialogDeletion] = useState(false);

  const handleCloseDialogDeletion = () => {
    setOpenDialogDeletion(false);
  };

  //Dialog Handler für Neuladen der Daten
  const [openDialogReloadData, setOpenDialogReloadData] = useState(false);

  const handleOpenDialogReloadData = () => {
    setOpenDialogReloadData(true);
  };
  const handleCloseDialogReloadData = () => {
    setOpenDialogReloadData(false);
  };

  //Handler zum Neuladen der Daten
  const handleReloadEventData = () => {
    if (userGameData.events.length > 0) {
      setEventData(userGameData.events);
    } else {
      setEventData(gameData.data.events);
    }
    setOpenDialogReloadData(false);
  };
  //Handler zum Löschen der ausgewählten Events
  const handleDeleteEvents = () => {
    const updatedEventData = eventData.filter(
      (event) => !rowDeletionIds.includes(event.id)
    );
    setEventData(updatedEventData);
    handleCloseDialogDeletion();
  };

  //Handler zum Eventhinzufügen
  const [openDialogAddEvent, setOpenDialogAddEvent] = useState(false);
  const [type, setType] = useState("");
  const [team, setTeam] = useState("Home");
  const [jerseyNumber, setJerseyNumber] = useState("");
  let timestampEvent = 0;

  const handleOpenDialogAddEvent = () => {
    setOpenDialogAddEvent(true);
  };
  const handleCloseDialogAddEvent = () => {
    setOpenDialogAddEvent(false);
  };
  const handleAddEvent = () => {
    let currentPlayerTime = 0;
    const gameStartTimestamp = eventData[eventData.length - 1].timestamp;
    const secondHalftimeTimestamp = eventData.find(
      (e) => e.type === "StartPeriod" && e.time === "30:00"
    ).timestamp;
    //1st Half start in seconds
    let [hoursFirst, minutesFirst, secondsFirst] = gameStart
      .split(":")
      .map(Number);
    const startTimeFirstHalfSeconds =
      hoursFirst * 3600 + minutesFirst * 60 + secondsFirst;
    //2nd Half start in seconds
    let [hoursSecond, minutesSecond, secondsSecond] = secondHalfStart
      .split(":")
      .map(Number);
    const startTimeSecondHalfSeconds =
      hoursSecond * 3600 + minutesSecond * 60 + secondsSecond;

    if (videoRef.current) {
      currentPlayerTime = videoRef.current.getCurrentTime();
      if (currentPlayerTime < startTimeSecondHalfSeconds) {
        timestampEvent = parseInt(
          gameStartTimestamp +
            (currentPlayerTime * 1000 - startTimeFirstHalfSeconds * 1000)
        );
      } else {
        timestampEvent = parseInt(
          secondHalftimeTimestamp +
            (currentPlayerTime * 1000 - startTimeSecondHalfSeconds * 1000)
        );
      }
    }

    const event = {
      id: eventData.reduce((maxId, e) => Math.max(maxId, e.id), -Infinity) + 1,
      message: `${type} von Trikotnummer ${jerseyNumber} ${
        team === "Home"
          ? `(${gameData.data.summary.homeTeam.name})`
          : `(${gameData.data.summary.awayTeam.name})`
      } `,
      timestamp: timestampEvent,
      type: type,
      currentTime: currentPlayerTime,
      team: team,
      playerId:
        gameData.data.lineup[team.toLowerCase()].find(
          (player) => player.number.toString() === jerseyNumber
        )?.id || null,
      time: "",
      score: "",
    };

    setOpenDialogAddEvent(false);
    setEventData((prevEventData) => {
      const newEventData = [...prevEventData, event];
      return newEventData.sort((a, b) => b.timestamp - a.timestamp);
    });
  };
  const handleSelectionChangeType = (e) => {
    setType(e.target.value);
  };
  const handleSelectionChangeTeam = (e) => {
    setTeam(e.target.value);
  };
  const [openDialogSave, setOpenDialogSave] = useState(false);
  const handleOpenDialogSave = () => {
    setOpenDialogSave(true);
  };
  const handleCloseDialogSave = () => {
    setOpenDialogSave(false);
  };
  const handleSaveEvents = async () => {
    const updatedGameData = {
      ...userGameData,
      events: eventData,
      userId: profile.username,
    };

    try {
      await postUserGame(updatedGameData).unwrap();
      alert("Daten Upload erfolgreich!");
    } catch (err) {
      console.error("Uploadfehler: ", err);
    }
  };

  return (
    <Box m="1.5rem  2.5rem">
      <Header title="VIDEOANALYSE" subtitle="Schaue und analysiere das Video" />
      <Box display="grid" gridTemplateColumns="2fr 1fr" gap="1rem" mt="1rem">
        {/*Button Box für Hinzufügen Startzeiten */}
        <Box
          display="flex"
          gap="1rem"
          gridColumn="2/3"
          justifyContent="flex-end"
        >
          <TextField
            id="start-ersteHZ"
            label="Startzeit 1. HZ"
            variant="outlined"
            onChange={(e) => setGameStart(e.target.value)}
            error={error.firstHalfTime}
            helperText={error.firstHalfTime ? errorMessage : ""}
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
            id="start-zweiteHZ"
            label="Startzeit 2. HZ"
            variant="outlined"
            onChange={(e) => setSecondHalfStart(e.target.value)}
            error={error.secondHalfTime}
            helperText={error.secondHalfTime ? errorMessage : ""}
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

          <SimpleButton text="Speichern" onClick={handleTimeSave} />
        </Box>
        <Box
          gridColumn="1/2"
          flexDirection="column"
          p="0 2rem"
          flex="1 1 100%"
          borderRadius="0.55rem"
        >
          {videoUrl ? (
            //Video Player
            <React.Fragment>
              <ReactPlayer
                url={videoUrl}
                controls
                ref={videoRef}
                width="100%"
                height="auto"
              />
            </React.Fragment>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              border={`2px dashed ${theme.palette.grey[700]}`}
              position="relative"
              sx={{
                cursor: "pointer",
                "&:hover": { borderColor: theme.palette.secondary[300] },
                aspectRatio: "16/9", // Stellt sicher, dass die Box ein 16:9-Verhältnis beibehält
                width: "100%", // Nimmt die gesamte Breite der Elternbox ein
                height: "100%",
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById("file-input").click()}
            >
              <Typography
                variant="h3"
                sx={{ color: theme.palette.secondary[200] }}
                textAlign="center"
                mb="1rem"
              >
                Drag and drop a video here or click to select
              </Typography>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="file-input"
              />
              <label htmlFor="file-input">
                <SimpleButton
                  onClick={() => document.getElementById("file-input").click()}
                  text="Choose a video"
                ></SimpleButton>
              </label>
            </Box>
          )}
        </Box>
        {/* Event-Box */}
        <Box
          gridColumn="2/3"
          overflow="auto"
          borderRadius="0.55rem"
          maxHeight="850px"
          minHeight="710px"
          border={`1px solid ${theme.palette.secondary[200]}`}
          sx={{
            "& .MuiDataGrid-cell": {
              cursor: videoUrl ? "pointer" : "default",
              fontSize: 16,
              color: theme.palette.secondary[200],
            },
            "& .MuiDataGrid-columnHeaders": {
              color: theme.palette.secondary[200],
              fontSize: 24,
            },
          }}
        >
          <DataGrid
            columns={cols}
            rows={row || []}
            components={{ ColumnMenu: CustomColumnMenu }}
            hideFooter
            onCellClick={(params) => {
              if (videoUrl) {
                handleEventClick(params.row);
              }
            }}
            checkboxSelection
            onRowSelectionModelChange={(index) => {
              setRowDeletionIds(index);
            }}
            sx={{
              "& .MuiDataGrid-row.Mui-selected": {
                backgroundColor: theme.palette.grey[800],
                "&:hover": {
                  backgroundColor: theme.palette.grey[800],
                },
              },
              "& .MuiDataGrid-checkbox": {
                color: theme.palette.secondary[300], // Farbe des Auswahlkästchens
              },
              "& .Mui-checked": {
                color: theme.palette.secondary[300], // Farbe des Häkchens in der Checkbox
              },
              "& .MuiDataGrid-row": {
                "&:hover": {
                  backgroundColor: theme.palette.grey[800],
                },
              },
            }}
          />
        </Box>

        {/*Button zum Löschen von Events */}
        <Box
          display="flex"
          gridColumn="2/3"
          ml="0.55rem"
          justifyContent="flex-start"
        >
          <LightTooltip title="Ausgewählte Events löschen">
            <IconButton
              aria-label="delete"
              color="error"
              onClick={() => {
                if (rowDeletionIds.length > 0) {
                  setOpenDialogDeletion(true);
                }
              }}
            >
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          </LightTooltip>
          <ConfirmDeleteDialog
            open={openDialogDeletion}
            onClose={handleCloseDialogDeletion}
            onConfirm={handleDeleteEvents}
          />
          {/*Button zum Neuladen von Eventdaten */}
          <LightTooltip title="Neuladen der Eventdaten">
            <IconButton
              aria-label="reload"
              color="secondary"
              onClick={handleOpenDialogReloadData}
            >
              <ReplayOutlinedIcon />
            </IconButton>
          </LightTooltip>
          <ConfirmReloadDialog
            open={openDialogReloadData}
            onClose={handleCloseDialogReloadData}
            onConfirm={handleReloadEventData}
          />
          {/*Button zum Hinzufügen von Eventdaten */}
          <LightTooltip title="Neues Event hinzufügen">
            <IconButton
              aria-label="add"
              color="success"
              onClick={handleOpenDialogAddEvent}
            >
              <AddOutlinedIcon />
            </IconButton>
          </LightTooltip>
          {/*Button zum Speichern von Eventdaten */}
          <LightTooltip title="Eventdaten speichern">
            <IconButton
              aria-label="save"
              onClick={handleSaveEvents}
              color="secondary"
            >
              <SaveOutlinedIcon />
            </IconButton>
          </LightTooltip>
          <ConfirmSaveDialog
            open={openDialogSave}
            onClose={handleCloseDialogSave}
          />
          <AddEventDialog
            open={openDialogAddEvent}
            onClose={handleCloseDialogAddEvent}
            onConfirm={handleAddEvent}
            onChangeType={handleSelectionChangeType}
            onChangeTeam={handleSelectionChangeTeam}
            onChangeTextField={(e) => setJerseyNumber(e.target.value)}
            value={type}
            error={!/^\d{1,2}$/.test(jerseyNumber) && jerseyNumber !== ""}
            helperText={
              !/^\d{1,2}$/.test(jerseyNumber) && jerseyNumber !== ""
                ? "Bitte geben Sie eine ein- oder zweistellige Nummer ein"
                : ""
            }
          />
        </Box>
      </Box>
    </Box>
  );
}

export default VideoAnalyse;
