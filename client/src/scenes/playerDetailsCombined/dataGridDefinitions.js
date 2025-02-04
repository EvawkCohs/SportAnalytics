export const columnsDataGrid = [
  {
    field: "opponent",
    headerName: "Gegner",
    flex: 2,
  },
  {
    field: "goals",
    headerName: "Tore",
    flex: 1,
  },

  {
    field: "penaltyGoals",
    headerName: "7m Tore",
    flex: 1,
  },
  {
    field: "penaltyMissed",
    headerName: "7m Fehlwürfe",
    flex: 1,
  },
  {
    field: "penalties",
    headerName: "2min Strafen",
    flex: 1,
  },
  {
    field: "redCards",
    headerName: "Rote Karte",
    flex: 1,
  },
  {
    field: "technicalFault",
    headerName: "Technische Fehler",
    flex: 1,
    renderCell: (params) => params.value ?? 0,
  },
  {
    field: "missedShot",
    headerName: "Fehlwürfe",
    flex: 1,
    renderCell: (params) => params.value ?? 0,
  },
  {
    field: "assist",
    headerName: "Assists",
    flex: 1,
    renderCell: (params) => params.value ?? 0,
  },
];
