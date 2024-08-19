const handleAddGame = async (gameData, responseData) => {
  try {
    if (responseData.data.exists) {
      alert("Game already exists in the database.");
      return; // Beende die Funktion, wenn das Spiel existiert
    }
    // Wenn das Spiel nicht existiert, dann füge es hinzu
    const response = await fetch("http://localhost:5002/gameUpload/add-game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameData),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Game added successfully!");
    } else {
      alert(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while adding the game");
  }
};

export default handleAddGame;
