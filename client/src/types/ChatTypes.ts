export interface ChatType {   // left hand side where user sees all the active chats they are in
  conversation_id: number;
  id: number; // id of person client is talking to (not client's id)
  username: string; // username of person client is talking to (not client's username)
  online: boolean;
  lastMessage: string;
  time: string;
  unread: number;
}
