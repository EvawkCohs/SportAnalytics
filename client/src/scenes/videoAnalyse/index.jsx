import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  useTheme,
  Grid,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Divider,
  TextField,
} from "@mui/material";
import Header from "components/Header";
import ReactPlayer from "react-player";
import SimpleButton from "components/SimpleButton";
import { useGetGameModelQuery } from "state/api";
import { gameExampleData } from "scenes/details/gameExample";

function VideoAnalyse() {
  const { id } = useParams();
  const theme = useTheme();
  // const gameData = useGetGameModelQuery(id);
  const gameData = gameExampleData;
  const [videoUrl, setVideoUrl] = useState(null);
  const [eventData, setEventData] = useState([]);
  //referenz zum Videoplayer
  const videoRef = useRef(null);

  //Startzeiten setzen
  const [gameStart, setGameStart] = useState("");
  const [secondHalfStart, setSecondHalfStart] = useState("");
  const [error, setError] = useState({
    firstHalfTime: false,
    secondHalfTime: false,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const validateTime = (time) => {
    const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/; // HH:MM format
    return regex.test(time);
  };

  useEffect(() => {
    if (
      !gameData ||
      !gameData.data ||
      !gameData.data.summary ||
      !gameData.data.events
    )
      return;

    // Setze eventData, wenn die Daten vorhanden sind
    setEventData(gameData.data.events);
  }, [gameData]);

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
    if (videoRef.current) {
      videoRef.current.seekTo(startTimeSeconds + diffInSeconds, "seconds");
    }
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
          justifyContent="center"
        >
          <List>
            <ListSubheader
              sx={{
                fontWeight: "medium",
                letterSpacing: 0,
                fontSize: 20,
                color: theme.palette.secondary[200],
                textAlign: "center",
                backgroundColor: theme.palette.background.default,
              }}
            >
              Events
            </ListSubheader>
            <Divider
              variant="fullwidth"
              sx={{
                bgcolor: theme.palette.secondary[200],
                opacity: 0.6,
                borderBottomWidth: 2,
              }}
            />
            {eventData && eventData.length > 0 ? (
              eventData.map((event, index) => (
                <React.Fragment key={index}>
                  <ListItemText
                    primary={`${event.time} | ${event.message}${
                      event.score !== null
                        ? ` | ${String(event.score).slice(0, 2)} : ${String(
                            event.score
                          ).slice(3, 5)}`
                        : ""
                    }`}
                    primaryTypographyProps={{
                      variant: "h4",
                      letterSpacing: 0,
                      textAlign: "left",
                      color: theme.palette.secondary[100],
                      ml: "0.5rem",
                    }}
                    sx={{
                      "&:hover": {
                        backgroundColor: theme.palette.background.alt,
                      },
                      cursor: videoUrl ? "pointer" : "default",
                    }}
                    onClick={() => {
                      if (videoUrl) {
                        handleEventClick(event);
                      }
                    }}
                  />

                  <Divider variant="fullwidth" sx={{ borderBottomWidth: 2 }} />
                </React.Fragment>
              ))
            ) : (
              <ListItemText text="Keine Events vorhanden" />
            )}
          </List>
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
        {/*Button Box für Hinzufügen Startzeiten */}
        <Box
          display="flex"
          gridColumn="2/3"
          gap="2rem"
          marginTop="1rem"
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
