import React from "react";
import { Box, Card, useTheme, CardContent, Typography } from "@mui/material";

export const StatCard = ({
  title,
  stat1,
  stat2,
  stat3,
  value1,
  value2,
  value3,
  logo,
}) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        backgroundColor: theme.palette.grey[600],
        borderRadius: "0.25rem",
        minWidth: "500px",
        border: `1px solid #2f2b38`,
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
          padding: "0 !important",
          marginBottom: "0 !important",
        }}
      >
        <Box
          display="flex"
          width="100%"
          justifyContent="flex-start"
          alignItems="center"
          backgroundColor={theme.palette.grey[600]}
          borderBottom={`1px solid ${theme.palette.grey[300]}`}
        >
          <Box m="0rem 1rem">{logo}</Box>
          <Typography
            sx={{ color: theme.palette.secondary[100] }}
            variant="h2"
            textAlign="center"
          >
            {title}
          </Typography>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
          width="100%"
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            backgroundColor={theme.palette.background.alt}
            width="50%"
            className="data-display"
            border="1px solid #2f2b38"
            sx={{}}
          >
            <Typography
              variant="h3"
              sx={{
                color: theme.palette.secondary[100],
              }}
              textAlign="center"
            >
              {stat1}:
            </Typography>
            <Typography
              variant="h2"
              sx={{
                color: theme.palette.secondary[100],
              }}
              textAlign="center"
            >
              {value1}
            </Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            backgroundColor={theme.palette.background.alt}
            width="50%"
            className="data-display"
            border="1px solid #2f2b38"
          >
            <Typography
              variant="h3"
              sx={{
                color: theme.palette.secondary[100],
              }}
              textAlign="center"
            >
              {stat2}:
            </Typography>
            <Typography
              variant="h2"
              sx={{
                color: theme.palette.secondary[100],
              }}
              textAlign="center"
            >
              {value2}
            </Typography>
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          backgroundColor={theme.palette.background.alt}
          borderRadius="0.25rem"
          width="100%"
          border="1px solid #2f2b38"
          m="0"
          p="0"
        >
          <Typography
            variant="h3"
            sx={{
              color: theme.palette.secondary[100],
            }}
            textAlign="center"
          >
            {stat3 && `${stat3}:`}
          </Typography>
          <Typography
            variant="h2"
            sx={{
              color: theme.palette.secondary[100],
              mb: 0,
            }}
            textAlign="center"
          >
            {value3}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
