import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Divider, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import SimpleStatBox from "components/SimpleStatBox";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import SportsSoccerOutlinedIcon from "@mui/icons-material/SportsSoccerOutlined";
import "index.css";

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
          {events.map((event, index) => (
            <Box
              key={index}
              sx={{
                position: "absolute",
                left: `${(parseInt(event.time.slice(0, 2)) * 100) / 60}%`,
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
                {/* Dot */}
                <SportsSoccerOutlinedIcon
                  fontSize="large"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  sx={{ color: theme.palette.secondary[300] }}
                />

                {/* Connecting line */}
                <Box
                  sx={{
                    width: 3,
                    height: 72,
                    backgroundColor: theme.palette.grey[600],
                    marginLeft: "13px",
                  }}
                />
              </Box>
              {hoveredIndex === index && (
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    textAlign: "center",
                    color: theme.palette.secondary[200],
                  }}
                >
                  {event.type} {event.time}
                </Typography>
              )}
            </Box>
          ))}
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
