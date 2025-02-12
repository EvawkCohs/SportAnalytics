import React from "react";
import Header from "components/Header";
import { Box, Typography, useTheme, Divider } from "@mui/material";
import { AccountCircleOutlined } from "@mui/icons-material";
import { useGetUserProfileQuery } from "state/api";
import { ErrorMessageServer } from "components/ErrorMessageServer";

const ProfilePage = () => {
  //Profil
  const { data: profile, error } = useGetUserProfileQuery();

  const theme = useTheme();
  console.log(error);
  if (error) {
    return error.status === "FETCH_ERROR" ? (
      <ErrorMessageServer />
    ) : (
      <Box m="1.5rem 2.5rem">
        <Header title="PROFIL" />
        <Typography variant="h5" sx={{ color: theme.palette.secondary[200] }}>
          Sie sind derzeit nicht eingeloggt.
        </Typography>
      </Box>
    );
  }
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="PROFIL ÜBERSICHT" subtitle={""} />
      {profile ? (
        <Box
          display="flex"
          alignItems="flex-start"
          flexDirection="column"
          gap="1rem"
        >
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            gap="1.5rem"
          >
            <AccountCircleOutlined
              sx={{ color: theme.palette.secondary[200] }}
              fontSize="large"
            />
            <Typography
              variant="h2"
              sx={{ color: theme.palette.secondary[200] }}
            >
              {profile.username}
            </Typography>
          </Box>
          <Divider orientation="horizontal" flexItem />

          <Typography variant="h3" sx={{ color: theme.palette.secondary[100] }}>
            Persönliche Daten:
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="center"
            gap="1rem"
            mt="0.5rem"
          >
            <Typography
              variant="h4"
              sx={{ color: theme.palette.secondary[200] }}
            >
              Name: {profile.vorname} {profile.nachname}
            </Typography>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="flex-start"
              gap="0.5rem"
            >
              <Typography
                variant="h4"
                sx={{ color: theme.palette.secondary[200] }}
              >
                Anschrift:
              </Typography>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="flex-start"
                gap="0.5rem"
              >
                <Typography
                  variant="h4"
                  sx={{ color: theme.palette.secondary[200] }}
                >
                  {profile.strasse}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ color: theme.palette.secondary[200] }}
                >
                  {profile.plz} {profile.stadt}
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="h4"
              sx={{ color: theme.palette.secondary[200] }}
            >
              E-Mail: {profile.email}
            </Typography>
            <Typography
              variant="h4"
              sx={{ color: theme.palette.secondary[200] }}
            >
              Lieblingsteam: {profile.mannschaft}
            </Typography>
            <Typography
              variant="h4"
              sx={{ color: theme.palette.secondary[200] }}
            >
              Account erstellt am:{" "}
              {new Date(profile.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          <Divider orientation="horizontal" flexItem />
        </Box>
      ) : (
        <div>Profil wird geladen...</div>
      )}
    </Box>
  );
};
export default ProfilePage;
