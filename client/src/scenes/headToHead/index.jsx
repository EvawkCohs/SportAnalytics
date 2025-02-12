import Header from "components/Header";
import React from "react";
import { useGetTeamModelQuery } from "state/api";
import { Box, Divider } from "@mui/material";

import { LoadingCircle } from "components/LoadingCircle";
import { ErrorMessageServer } from "components/ErrorMessageServer";

import { HeadToHeadComponent } from "./HeadToHeadComponent";
const HeadToHead = () => {
  const { data: teamData, isLoading, errorTeamModel } = useGetTeamModelQuery();

  if (isLoading) {
    return <LoadingCircle />;
  }
  if (errorTeamModel || !teamData) {
    return <ErrorMessageServer />;
  }
  return (
    <Box m="1.5rem 1.5rem">
      <Header title="HEAD TO HEAD" />
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-evenly"
        alignItems="flex-start"
        mt="2rem"
      >
        <HeadToHeadComponent teamData={teamData} />
        {/*Divider */}
        <Divider orientation="vertical" flexItem textAlign="center">
          VS
        </Divider>
        <HeadToHeadComponent teamData={teamData} />
      </Box>
    </Box>
  );
};
export default HeadToHead;
