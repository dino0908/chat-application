import axios from "axios";

export const startConversation = async (recipientId: number): Promise<{ conversation_id: number }> => {
  const { data } = await axios.post(`http://localhost:5000/api/startConversation`,
    { recipientId },
    { withCredentials: true }
  );

  return data.data;
};

export const markMessagesAsRead = async (conversationId: number): Promise<void> => {
  await axios.post(
    `http://localhost:5000/api/markMessagesAsRead`,
    { conversationId },
    { withCredentials: true }
  );
};
