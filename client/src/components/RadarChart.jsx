import { ResponsiveRadar } from "@nivo/radar";
import { useTheme, Typography, Box } from "@mui/material";

const RadarChart = ({ data, keys }) => {
  const theme = useTheme();
  <Box height="500px" width="500px">
    <Typography
      variant="h3"
      sx={{ color: theme.palette.secondary[200] }}
      textAlign="center"
    >
      Torverlauf
    </Typography>

    <ResponsiveRadar
      data={data}
      keys={keys}
      indexBy="stat"
      valueFormat=" >-.2f"
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      borderColor="black"
      gridLabelOffset={0}
      dotColor={{ theme: theme.palette.secondary[200] }}
      dotBorderWidth={2}
      colors={{ scheme: "category10" }}
      blendMode="multiply"
      motionConfig="slow"
      animate={false}
    />
  </Box>;
};

export default RadarChart;
