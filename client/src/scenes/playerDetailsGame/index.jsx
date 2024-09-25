import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Divider, Typography, Tooltip } from "@mui/material";
import { useTheme } from "@emotion/react";
import SimpleStatBox from "components/SimpleStatBox";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import SportsSoccerOutlinedIcon from "@mui/icons-material/SportsSoccerOutlined";
import "index.css";
import twoMinutes from "./Icons/twoMinutes.png";
import redCard from "./Icons/redCard.png";
import yellowCard from "./Icons/yellowCard.png";
import penaltyMissed from "./Icons/penaltyMissed.png";
import Fade from "@mui/material/Fade";
const PlayerDetailsGame = () => {
  const location = useLocation();
  const theme = useTheme();
  const mvp = location.state?.mvp;
  const player = location.state?.player;
  const opponent = location.state?.opponent;
  const events = location.state?.events;
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

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
        <Typography variant="h3" sx={{ color: theme.palette.secondary[200] }}>
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
              borderBottomColor: theme.palette.grey[600],
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
                      ? (parseInt(event.time.slice(0, 2)) * 100) / 60 + 1
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
                            {event.type} {event.time}
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
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            sx={{ color: theme.palette.secondary[300] }}
                          />
                        ) : event.type === "TwoMinutePenalty" ? (
                          <img
                            src={twoMinutes}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            alt="Two Minute Penalty"
                          />
                        ) : event.type === "Warning" ? (
                          <img
                            src={yellowCard}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            alt="Warning"
                          />
                        ) : event.type === "Disqualification" ? (
                          <img
                            src={redCard}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            alt="Disqualification"
                          />
                        ) : event.type === "SevenMeterMissed" ? (
                          <img
                            src={penaltyMissed}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            alt="penaltyMissed"
                          />
                        ) : null}
                      </Tooltip>
                    </>
                  ) : (
                    // Render Complete Event
                    <Tooltip
                      title={
                        <Typography
                          variant="h5"
                          sx={{ color: theme.palette.secondary[200] }}
                        >
                          {event.type} {event.time}
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
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          sx={{ color: theme.palette.secondary[300] }}
                        />
                      ) : event.type === "TwoMinutePenalty" ? (
                        <img
                          src={twoMinutes}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          alt="Two Minute Penalty"
                        />
                      ) : event.type === "Warning" ? (
                        <img
                          src={yellowCard}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          alt="Warning"
                        />
                      ) : event.type === "Disqualification" ? (
                        <img
                          src={redCard}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          alt="Disqualification"
                        />
                      ) : event.type === "SevenMeterMissed" ? (
                        <img
                          src={penaltyMissed}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          alt="penaltyMissed"
                        />
                      ) : null}

                      <Box
                        sx={{
                          width: 3,
                          height: 66,
                          backgroundColor: theme.palette.grey[600],
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
                  backgroundColor: theme.palette.grey[600],
                }}
              />
              <Typography
                fontSize="14px"
                sx={{ color: theme.palette.secondary[200] }}
              >
                {minutes}. min
              </Typography>
            </Box>
          ))}
        </Box>
        {/*Statistiken */}
        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          mt="1.5rem"
          gap="1rem"
          flexWrap="wrap"
        >
          <Box width="300px" className="fade-in" height="150px">
            <SimpleStatBox title={"Position"} value={player.position} />
          </Box>
          <Box width="300px" className="fade-in" height="150px">
            <SimpleStatBox title={"Tore"} value={player.goals} />
          </Box>
          <Box width="300px" className="fade-in" height="150px">
            <SimpleStatBox title={"7m-Tore"} value={player.penaltyGoals} />
          </Box>
          <Box width="300px" className="fade-in" height="150px">
            <SimpleStatBox
              title={"7m-Versuche"}
              value={player.penaltyGoals + player.penaltyMissed}
            />
          </Box>
          <Box width="300px" className="fade-in" height="150px">
            <SimpleStatBox title={"Gelbe Karten"} value={player.yellowCards} />
          </Box>
          <Box width="300px" className="fade-in" height="150px">
            <SimpleStatBox title={"Zeitstrafen"} value={player.penalties} />
          </Box>
          <Box width="300px" className="fade-in" height="150px">
            <SimpleStatBox title={"Rote Karten"} value={player.redCards} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default PlayerDetailsGame;
