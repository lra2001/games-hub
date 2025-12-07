import { useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../auth/AuthContext.jsx";

export default function useLibraryActions() {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState(null);

  async function addToLibrary(game, status) {
    if (!user) {
      setFeedback({
        type: "error",
        text: "Please login or register to add games to your library.",
      });
      return false;
    }

    try {
      await api.post("library/add-from-rawg/", {
        game_id: game.id,
        status,
      });
      setFeedback({
        type: "success",
        text: `${game.name} added to your ${status} list.`,
      });
      return true;
    } catch (err) {
      console.error(err);
      setFeedback({
        type: "error",
        text:
          err.response?.data?.error ||
          "Failed to add game to your library.",
      });
      return false;
    }
  }

  return { addToLibrary, feedback, setFeedback };
}