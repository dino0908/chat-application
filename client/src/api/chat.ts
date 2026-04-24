import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// creates a new conversation and adds both users's id to it, returns conversation ID
export const startConversation = async (recipientId: number): Promise<{ conversation_id: number }> => {
  const { data } = await axios.post(`${API_BASE_URL}/api/startConversation`,
    { recipientId },
    { withCredentials: true }
  );

  return data.data;
};

export const markMessagesAsRead = async (conversationId: number): Promise<void> => {
  await axios.post(
    `${API_BASE_URL}/api/markMessagesAsRead`,
    { conversationId },
    { withCredentials: true }
  );
};
