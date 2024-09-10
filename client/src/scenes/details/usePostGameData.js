const handleAddGame = async (games) => {
  try {
    const response = await fetch("http://localhost:5001/gameUpload/add-games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(games),
    });

    if (response.ok) {
      const data = await response.json();
    } else {
      console.error("Fehler beim Hochladen der Spiele:", response.statusText);
    }
  } catch (error) {
    console.error("Netzwerk- oder Serverfehler:", error);
  }
};

export default handleAddGame;
