import React from "react";
import { useLocation } from "react-router-dom";
import { Box, Divider, Typography, Tooltip } from "@mui/material";
import { useTheme } from "@emotion/react";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import SportsSoccerOutlinedIcon from "@mui/icons-material/SportsSoccerOutlined";
import "index.css";
import twoMinutes from "./Icons/twoMinutes.png";
import redCard from "./Icons/redCard.png";
import yellowCard from "./Icons/yellowCard.png";
import penaltyMissed from "./Icons/penaltyMissed.png";
import turnover from "./Icons/turnover.png";
import Fade from "@mui/material/Fade";
import { StatCard } from "./StatCard";

const PlayerDetailsGame = () => {
  const location = useLocation();
  const theme = useTheme();
  const mvp = location.state?.mvp;
  const player = location.state?.player;
  const opponent = location.state?.opponent;
  const events = location.state?.events;
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
  const eventMessageTypes = {
    Goal: "Tor",
    SevenMeterGoal: "7m-Tor",
    TwoMinutePenalty: "2min Strafe",
    Warning: "Gelbe Karte",
    Disqualification: "Rote Karte",
    SevenMeterMissed: "7m-Fehlwurf",
  };

  return (
    <Box
      m="1.5rem 2.5rem"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      gap="2rem"
    >
      <FlexBetween>
        <Header
          title={`${player.firstname} ${player.lastname} # ${player.number} 
            `}
          subtitle={`Statistiken gegen ${opponent}`}
          mvp={mvp}
        />
      </FlexBetween>
      {/*Zeitstrahl */}
      <Box width="100%">
        <Typography variant="h3" sx={{ color: theme.palette.secondary[100] }}>
          SPIELVERLAUF
        </Typography>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            mt: "20px",
            minHeight: "200px",
          }}
        >
          <Divider
            sx={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              borderBottomWidth: 3,
              borderBottomColor: theme.palette.primary[600],
            }}
          />
          {events.map((event, index) => {
            const isOverlapping =
              index > 0 &&
              event.time.slice(0, 2) === events[index - 1]?.time.slice(0, 2); // Check if the current event overlaps with the previous one

            return (
              <Box
                key={index}
                sx={{
                  position: "absolute",
                  left: `${
                    isOverlapping && index > 0
                      ? (parseInt(event.time.slice(0, 2)) * 100) / 60 - 1
                      : (parseInt(event.time.slice(0, 2)) * 100) / 60
                  }%`,
                  top: 0,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Box
                  display="flex"
                  justifyContent="center"
                  flexDirection="column"
                >
                  {index > 0 && isOverlapping ? (
                    // Render only Icon
                    <>
                      <Tooltip
                        title={
                          <Typography
                            variant="h5"
                            sx={{ color: theme.palette.secondary[200] }}
                          >
                            {eventMessageTypes[event.type] || event.type}{" "}
                            {event.time}
                          </Typography>
                        }
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        placement="top"
                        arrow={true}
                      >
                        {event.type === "Goal" ||
                        event.type === "SevenMeterGoal" ? (
                          <SportsSoccerOutlinedIcon
                            fontSize="large"
                            sx={{ color: theme.palette.secondary[300] }}
                          />
                        ) : event.type === "TwoMinutePenalty" ? (
                          <img src={twoMinutes} alt="Two Minute Penalty" />
                        ) : event.type === "Warning" ? (
                          <img src={yellowCard} alt="Warning" />
                        ) : event.type === "Disqualification" ? (
                          <img src={redCard} alt="Disqualification" />
                        ) : event.type === "SevenMeterMissed" ? (
                          <img src={penaltyMissed} alt="penaltyMissed" />
                        ) : null}
                      </Tooltip>
                    </>
                  ) : (
                    // Render Complete Event
                    <Tooltip
                      title={
                        <Typography
                          variant="h5"
                          sx={{ color: theme.palette.secondary[100] }}
                        >
                          {eventMessageTypes[event.type] || event.type}{" "}
                          {event.time}
                        </Typography>
                      }
                      placement="top"
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                      arrow={true}
                    >
                      {event.type === "Goal" ||
                      event.type === "SevenMeterGoal" ? (
                        <SportsSoccerOutlinedIcon
                          fontSize="large"
                          sx={{ color: theme.palette.secondary[300] }}
                        />
                      ) : event.type === "TwoMinutePenalty" ? (
                        <img src={twoMinutes} alt="Two Minute Penalty" />
                      ) : event.type === "Warning" ? (
                        <img src={yellowCard} alt="Warning" />
                      ) : event.type === "Disqualification" ? (
                        <img src={redCard} alt="Disqualification" />
                      ) : event.type === "SevenMeterMissed" ? (
                        <img src={penaltyMissed} alt="penaltyMissed" />
                      ) : null}

                      <Box
                        sx={{
                          width: 3,
                          height: 66,
                          backgroundColor: theme.palette.primary[600],
                          marginLeft: "13px",
                        }}
                      />
                    </Tooltip>
                  )}
                </Box>
              </Box>
            );
          })}
          {minutes.map((minutes) => (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              position="absolute"
              top="48%"
              sx={{ left: `${(minutes * 100) / 60}%` }}
            >
              <Box
                sx={{
                  width: 4,
                  height: 12,
                  backgroundColor: theme.palette.primary[600],
                }}
              />
              <Typography
                fontSize="14px"
                sx={{ color: theme.palette.secondary[100] }}
              >
                {minutes}. min
              </Typography>
            </Box>
          ))}
        </Box>

        {/*Statistiken */}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          mt="1.5rem"
          gap="1rem"
        >
          {player.position === "TW" ? (
            <>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                mt="1.5rem"
                gap="2rem"
                flexWrap="wrap"
              >
                <StatCard
                  title="Überblick"
                  stat1="Position"
                  value1={player.position}
                  stat2="Rückennummer"
                  value2={player.number}
                  stat3="Mannschaft"
                  value3={player.team}
                />
                <StatCard
                  title="Tore, Assists, Paraden"
                  stat1="Tore"
                  value1={player.goals}
                  stat2="Assists"
                  value2={player.assist || 0}
                  stat3="Paraden"
                  value3={player.save || 0}
                  logo={<img src={penaltyMissed} alt="PenaltyMissed" />}
                />
              </Box>
            </>
          ) : (
            <>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                mt="1.5rem"
                gap="2rem"
                flexWrap="wrap"
              >
                <StatCard
                  title="Überblick"
                  stat1="Position"
                  value1={player.position}
                  stat2="Rückennummer"
                  value2={player.number}
                  stat3="Mannschaft"
                  value3={player.team}
                />
                <StatCard
                  title="Tore & Assists"
                  stat1="Tore"
                  value1={player.goals}
                  stat2="7m-Tore"
                  value2={player.penaltyGoals}
                  stat3="Assists"
                  value3={player.assist || 0}
                  logo={
                    <SportsSoccerOutlinedIcon
                      fontSize="large"
                      sx={{ color: theme.palette.secondary[300] }}
                    />
                  }
                />
                <StatCard
                  title="Fehlwürfe"
                  stat1="7m-Fehlwurf"
                  value1={player.penaltyMissed}
                  stat2="Fehlwürfe (nah)"
                  value2={player.missedShotCloseRange || 0}
                  stat3="Fehlwürfe (fern)"
                  value3={player.missedShotDistance || 0}
                  logo={<img src={penaltyMissed} alt="PenaltyMissed" />}
                />
                <StatCard
                  title="Strafen"
                  stat1="Gelbe Karte"
                  value1={player.yellowCards}
                  stat2="Zeitstrafen"
                  value2={player.penalties}
                  stat3="Rote Karte"
                  value3={player.redCards}
                  logo={<img src={twoMinutes} alt="TwoMinutes" />}
                />
                <StatCard
                  title="Turnover"
                  stat1="Technische Fehler"
                  value1={player.technicalFault || 0}
                  stat2="Stürmerfouls"
                  value2={player.offensiveFoul || 0}
                  logo={<img src={turnover} height="24px" alt="Turnover" />}
                />
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};
export default PlayerDetailsGame;
