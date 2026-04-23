export interface MessageType {
    id: number
    text: string
    time: string
    self: boolean
    senderId?: number
    conversationId?: number
}