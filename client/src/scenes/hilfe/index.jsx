import React from "react";
import{Box, Divider, Typography, useTheme} from "@mui/material";
import Header from "components/Header";

const HelpPage =() =>{
    const theme = useTheme();

    return(
        <Box m="1.25rem 2.5rem">
            <Header title="FAQ" subtitle="Ablauf und Funktionsweise der WebApp"/>
            <Box display="flex" flexDirection="column" gap="1rem" mt="2rem" alignItems="flex-start">
            <Divider variant="middle" sx={{bgcolor: theme.palette.secondary[500], width: '100%'}}/>
                <Typography variant="h3" sx={{color: theme.palette.secondary[200]}}>1. Auswahl einer anderen Mannschaft als der Lieblingsmannschaft:</Typography>
                <Typography mb="2rem" variant="h5" sx={{color: theme.palette.secondary[200]}}>Die Wahl einer anderen Mannschaft auf der "Spielplan"-Seite lädt und aktualisiert die WebApp auf Basis der gewählten Mannschaft.</Typography>
                
                <Typography variant="h3" sx={{color: theme.palette.secondary[200]}}>2. Videoanalyse</Typography>
                <Typography mb="2rem" variant="h5" sx={{color: theme.palette.secondary[200]}}>Analog zu Sportlounge.com kann das Video eines Spiels mit dem Liveticker so verknüpft werden, dass die Livetickerevents sich im Videoplayer aufrufen lassen. Dazu muss zuerst das Video in den Player geladen werden. Danach müssen die Startzeiten der ersten und zweiten Halbzeit gesetzt werden.</Typography>
                
                <Typography variant="h3" sx={{color: theme.palette.secondary[200]}}>3. Hinzufügen von zusätzlichen Ereignissen</Typography>
                <Typography variant="h5" sx={{color: theme.palette.secondary[200]}}>Spielanalysen können benutzerdefinierte Events hinzugefügt werden. Dies ist auf der Seite "Videoanalyse" mit Hilfe des Plus-Buttons möglich. Mit Hilfe des Speichern-Buttons werden die Daten in die Datenbank geladen und lassen sich zu einem späteren Zeitpunkt wieder abrufen.</Typography>
                <Divider variant="middle" sx={{bgcolor: theme.palette.secondary[500], width: '100%'}} />
                </Box>
        </Box>
    )
}
export default HelpPage;