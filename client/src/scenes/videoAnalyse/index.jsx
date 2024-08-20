import React, { useState, useEffect } from "react";
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

  //Startzeiten setzen
  const [gameStart, setGameStart] = useState("");
  const [secondHalfStart, setSecondHalfStart] = useState("");

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
            <ReactPlayer url={videoUrl} controls />
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
            <Divider />
            {eventData && eventData.length > 0 ? (
              eventData.map((event) => (
                <ListItemText
                  primary={`${event.time} | ${event.message}`}
                  primaryTypographyProps={{
                    variant: "h6",
                    letterSpacing: 0,
                    textAlign: "left",
                    color: theme.palette.secondary[200],
                    ml: "0.5rem",
                  }}
                  sx={{
                    "&:hover": {
                      backgroundColor: theme.palette.background.alt,
                    },
                    cursor: videoUrl ? "pointer" : "default",
                  }}
                />
              ))
            ) : (
              <ListItemText text="Keine Events vorhanden" />
            )}
          </List>
        </Box>
      </Box>
      <Box
        marginTop="1rem"
        display="flex"
        justifyContent="flex-start"
        gap="2rem"
        ml="2rem"
        gridColumn="1/2"
      >
        <SimpleButton
          sx={{
            backgroundColor: theme.palette.secondary.light,
            color: theme.palette.background.alt,
            fontSize: "14px",
            fontWeight: "bold",
          }}
          text="SimpleButton 1"
        ></SimpleButton>
        <SimpleButton
          sx={{
            backgroundColor: theme.palette.secondary.light,
            color: theme.palette.background.alt,
            fontSize: "14px",
            fontWeight: "bold",
          }}
          text="SimpleButton 2"
        ></SimpleButton>
        <SimpleButton
          sx={{
            backgroundColor: theme.palette.secondary.light,
            color: theme.palette.background.alt,
            fontSize: "14px",
            fontWeight: "bold",
          }}
          text="SimpleButton 3"
        ></SimpleButton>
      </Box>
    </Box>
  );
}

export default VideoAnalyse;
