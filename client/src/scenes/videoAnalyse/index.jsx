import React, { useState, useEffect } from "react";
import { Box, useTheme, Grid, Typography, Button } from "@mui/material";
import Header from "components/Header";
import ReactPlayer from "react-player";

function VideoAnalyse() {
  const [videoUrl, setVideoUrl] = useState(null);
  const theme = useTheme();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoUrl(URL.createObjectURL(file));
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setVideoUrl(URL.createObjectURL(file));
    }
  };

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
                <Button
                  sx={{ backgroundColor: theme.palette.primary.main }}
                  variant="contained"
                  onClick={() => document.getElementById("file-input").click()}
                >
                  Choose a video
                </Button>
              </label>
            </Box>
          )}
        </Box>
        <Box gridColumn="2/3">
          {/* Platz für weitere Elemente rechts vom Video-Player */}
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
        <Button variant="contained">Button 1</Button>
        <Button variant="contained">Button 2</Button>
        <Button variant="contained">Button 3</Button>
      </Box>
    </Box>
  );
}

export default VideoAnalyse;
