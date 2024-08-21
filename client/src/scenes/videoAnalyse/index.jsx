import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  useTheme,
  Grid,
  Typography,
  IconButton,
  TextField,
} from "@mui/material";
import Header from "components/Header";
import ReactPlayer from "react-player";
import SimpleButton from "components/SimpleButton";
import LightTooltip from "components/LightTooltip";
import { useGetGameModelQuery } from "state/api";
import { gameExampleData } from "scenes/details/gameExample";
import { DataGrid } from "@mui/x-data-grid";
import CustomColumnMenu from "components/DataGridCustomColumnMenu";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import ConfirmDeleteDialog from "components/DialogDeletion";
import ConfirmReloadDialog from "components/DialogReload";

function VideoAnalyse() {
  const { id } = useParams();
  const theme = useTheme();
  // const gameData = useGetGameModelQuery(id);
  const gameData = gameExampleData;
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

  //Startzeiten validieren
  const validateTime = (time) => {
    const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/; // HH:MM format
    return regex.test(time);
  };

  //Eventdata setzen bzw. validieren, ob gameData bereits geladen wurde
  useEffect(() => {
    if (
      !gameData ||
      !gameData.data ||
      !gameData.data.summary ||
      !gameData.data.events
    )
      return;

    // Setze eventData, wenn die Daten vorhanden sind
    setEventData(gameData.data.events.slice());
  }, [gameData]);
  //Col + Row Definitions für DataGrid
  const cols = [
    {
      field: "message",
      headerName: "Events",
      headerAlign: "center",
      align: "left",
      flex: 1,
      renderCell: (params) => {
        return `${params.row.time} | ${params.row.message}${
          params.row.score !== null
            ? ` | ${String(params.row.score).slice(0, 2)} : ${String(
                params.row.score
              ).slice(3, 5)}`
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
  };

  //Dialog Handler für Löschen der Daten
  const [openDialogDeletion, setOpenDialogDeletion] = useState(false);

  const handleOpenDialogDeletion = () => {
    setOpenDialogDeletion(true);
  };

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
    setEventData(gameData.data.events);
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

  return (
    <Box m="1.5rem  2.5rem">
      <Header title="VIDEOANALYSE" subtitle="Schaue und analysiere das Video" />
      <Box display="grid" gridTemplateColumns="2fr 1fr" gap="1rem" mt="1rem">
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
              border={`2px dashed ${theme.palette.secondary[200]}`}
              position="relative"
              sx={{
                cursor: "pointer",
                "&:hover": { borderColor: theme.palette.primary.main },
                aspectRatio: "16/9", // Stellt sicher, dass die Box ein 16:9-Verhältnis beibehält
                width: "100%", // Nimmt die gesamte Breite der Elternbox ein
                height: "auto",
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
          maxHeight="710px"
          overflow="auto"
          borderRadius="0.55rem"
          border={`1px solid ${theme.palette.secondary[200]}`}
          sx={{
            "& .MuiDataGrid-cell": {
              cursor: videoUrl ? "pointer" : "default",
              fontSize: 16,
              color: theme.palette.secondary[100],
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
          />
        </Box>

        {/*Button Box für Hinzufügen von Events */}
        <Box
          marginTop="1rem"
          display="flex"
          justifyContent="flex-start"
          gap="2rem"
          ml="2rem"
          gridColumn="1/2"
        >
          <SimpleButton text="SimpleButton 1"></SimpleButton>
          <SimpleButton text="SimpleButton 2"></SimpleButton>
          <SimpleButton text="SimpleButton 3"></SimpleButton>
        </Box>
        {/*Button zum Löschen von Events */}
        <Box
          display="flex"
          gridColumn="2/3"
          gap="0.5rem"
          ml="0.55rem"
          justifyContent="flex-start"
        >
          <LightTooltip title="Ausgewählte Events löschen">
            <IconButton
              aria-label="delete"
              color="error"
              onClick={() => {
                if (rowDeletionIds.length > 0) {
                  handleOpenDialogDeletion();
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
            text={"Möchtest du die ausgewählten Events wirklich löschen?"}
          />

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
            text={"Möchtest du die ursprünglichen Eventdaten neu laden?"}
          />
        </Box>
        {/*Button Box für Hinzufügen Startzeiten */}
        <Box
          display="flex"
          gridColumn="2/3"
          gap="2rem"
          justifyContent="flex-start"
        >
          <TextField
            id="start-ersteHZ"
            label="Startzeit 1. HZ"
            variant="outlined"
            onChange={(e) => setGameStart(e.target.value)}
            error={error.firstHalfTime}
            helperText={error.firstHalfTime ? errorMessage : ""}
          />
          <TextField
            id="start-zweiteHZ"
            label="Startzeit 2. HZ"
            variant="outlined"
            onChange={(e) => setSecondHalfStart(e.target.value)}
            error={error.secondHalfTime}
            helperText={error.secondHalfTime ? errorMessage : ""}
          />
          <SimpleButton text="Speichern" onClick={handleTimeSave} />
        </Box>
      </Box>
    </Box>
  );
}

export default VideoAnalyse;
