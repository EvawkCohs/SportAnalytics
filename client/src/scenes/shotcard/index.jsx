import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Button, FormControl, useTheme, MenuItem } from "@mui/material";
import Header from "components/Header";
import Handballtor from "./Handballtor.jpg";
import { CustomSelect } from "components/CustomSelect";
import { CustomInputLabel } from "components/CustomInputLabel";
import {
  SportsSoccerOutlined,
  HighlightOffOutlined,
  DoNotDisturbOnOutlined,
  DeleteOutlineOutlined,
} from "@mui/icons-material";
import html2canvas from "html2canvas";
import SimpleButton from "components/SimpleButton";
import {
  usePostUserGameMutation,
  useGetGameModelQuery,
  useGetUserProfileQuery,
  useGetUserGamesQuery,
} from "state/api";
import { skipToken } from "@reduxjs/toolkit/query";

const ShotCard = () => {
  const theme = useTheme();
  const location = useLocation();
  const gameId = location.state?.gameId;
  const player = location.state?.player;
  const { data: profile } = useGetUserProfileQuery();
  const gameData = useGetGameModelQuery(gameId);
  const [selectedShot, setSelectedShot] = useState("Goals");
  const [positions, setPositions] = useState([]);
  const imageRef = useRef(null);

  const [postUserGame] = usePostUserGameMutation();
  const [userGameData, setUserGameData] = useState({
    userId: "",
    summary: {},
    lineup: {},
    events: [],
  });
  const [lineupData, setLineupData] = useState({});
  const shouldFetch = profile?.username && gameId;
  const { data: specificGameData, isErrorUserGame } = useGetUserGamesQuery(
    shouldFetch ? { gameId: gameId, userId: profile.username } : skipToken
  );
  const iconMap = {
    Goals: (
      <SportsSoccerOutlined
        sx={{ color: theme.palette.secondary[200], fontSize: 60 }}
      />
    ),
    MissedShots: (
      <HighlightOffOutlined
        sx={{ color: theme.palette.red[600], fontSize: 60 }}
      />
    ),
    SevenMeterGoals: (
      <SportsSoccerOutlined
        sx={{ color: theme.palette.green[100], fontSize: 60 }}
      />
    ),
    SevenMeterMissed: (
      <DoNotDisturbOnOutlined
        sx={{ color: theme.palette.red[600], fontSize: 60 }}
      />
    ),
  };

  useEffect(() => {
    if (!gameData || !gameData?.data?.events) return;
    setUserGameData((prevData) => ({
      ...prevData,
      summary: gameData.data.summary,
      lineup: gameData.data.lineup,
      events: gameData.data.events,
    }));
    setLineupData(gameData.data.lineup);
    if (!shouldFetch) return;
    if (specificGameData && Object.keys(specificGameData.length > 0)) {
      setUserGameData((prevData) => ({
        ...prevData,
        userId: profile.username,
        summary: specificGameData.summary,
        lineup: specificGameData.lineup,
        events: specificGameData.events,
      }));
      setLineupData(specificGameData.lineup);
      setPositions(
        specificGameData.lineup.home.find((play) => play.id === player.id)
          .shotPositions
      );
    } else if (isErrorUserGame) {
      console.error(
        "Kein benutzerdefiniertes Spiel gefunde, verwende Handball.net",
        isErrorUserGame
      );
    }
  }, [
    profile,
    gameId,
    specificGameData,
    isErrorUserGame,

    gameData,
    shouldFetch,
  ]);

  const handleClick = (event) => {
    if (!selectedShot) return;

    const rect = event.target.getBoundingClientRect();
    const newPosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      type: selectedShot,
    };
    setPositions((prevPositions) => [...prevPositions, newPosition]);
    let lineupCopy = JSON.parse(JSON.stringify(lineupData));
    const UpdatedPlayer = lineupCopy["home"].find(
      (ply) => ply.id === player.id
    );
    if (UpdatedPlayer) {
      UpdatedPlayer["shotPositions"] = [
        ...UpdatedPlayer["shotPositions"],
        newPosition,
      ];

      setLineupData(lineupCopy);
    }
  };

  const handleSelectionChange = (event) => {
    setSelectedShot(event.target.value);
  };
  const handleSaveImage = async () => {
    if (imageRef.current) {
      const canvas = await html2canvas(imageRef.current);
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "shot-analysis.png";
      setTimeout(() => {
        link.click();
      }, 0);
    }
  };
  const handleDeleteShot = () => {
    let lineupCopy = JSON.parse(JSON.stringify(lineupData));
    const UpdatedPlayer = lineupCopy["home"].find(
      (ply) => ply.id === player.id
    );
    if (UpdatedPlayer) {
      UpdatedPlayer["shotPositions"] = UpdatedPlayer["shotPositions"].slice(
        0,
        -1
      );
      setLineupData({ ...lineupCopy });
    }
    const newPositions = positions.slice(0, -1);
    setPositions(newPositions);
  };
  const handleSaveShotCard = async () => {
    const updatedGameData = {
      ...userGameData,
      summary: userGameData.summary,
      events: userGameData.events,
      userId: profile.username,
      lineup:
        Object.keys(lineupData).length > 0 ? lineupData : userGameData.lineup,
    };
    console.log(updatedGameData);
    try {
      await postUserGame(updatedGameData).unwrap();
      alert("Daten Upload erfolgreich!");
    } catch (err) {
      if (!profile) {
        alert("Daten Upload fehlgeschlagen! Bitte loggen sie sich zuerst ein!");
      }
      alert("Uploadfehler: ", err);
    }
  };
  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="WURFBILDANALYSE"
        subtitle={`Wurfbildanalyse von: ${player.firstname} ${player.lastname}`}
      />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems={"center"}
        mt="2rem"
      >
        {/*Wurfbild Grid */}
        <Box
          ref={imageRef}
          sx={{
            backgroundImage: `url(${Handballtor})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",

            position: "relative",
            width: "1100px",
            height: "635px",
            borderRadius: "0.55rem",
          }}
          onClick={handleClick}
        >
          {positions.map((pos, index) => (
            <Box
              key={index}
              sx={{
                position: "absolute",
                top: pos.y - 12,
                left: pos.x - 12,
              }}
            >
              {" "}
              {iconMap[pos.type]}
            </Box>
          ))}
        </Box>
        {/*Select für Fehlwurf/Tor Auwahl */}
        <Box
          display={"flex"}
          justifyContent={"space-evenly"}
          flexDirection={"row"}
          gap="2rem"
          mt="2rem"
        >
          <FormControl sx={{ width: "300px" }}>
            <CustomInputLabel id="Wurfauswahl">Wurfauswahl</CustomInputLabel>
            <CustomSelect
              value={selectedShot}
              onChange={handleSelectionChange}
              lable="selectedShot"
              labelId="Wurfauswahl"
            >
              <MenuItem value="Goals">Tor (Feld)</MenuItem>
              <MenuItem value="MissedShots">Fehlwurf (Feld)</MenuItem>
              <MenuItem value="SevenMeterGoals">Tor (7m)</MenuItem>
              <MenuItem value="SevenMeterMissed">Fehlwurf (7m)</MenuItem>
            </CustomSelect>
          </FormControl>
          <SimpleButton
            text={"Letztes Event löschen"}
            onClick={handleDeleteShot}
            Icon={DeleteOutlineOutlined}
          />
          <SimpleButton text={"Download"} onClick={handleSaveImage} />
          <SimpleButton
            text={"Wurfbild speichern"}
            onClick={handleSaveShotCard}
          />
        </Box>
      </Box>
    </Box>
  );
};
export default ShotCard;
