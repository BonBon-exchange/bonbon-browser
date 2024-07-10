export type ChatRunnerId = string

export type ChatRunner = {
    action: "contact"
    context: any
}

export type ChatState = {
    username: string,
    isMagic: boolean,
    runners?: Record<ChatRunnerId, ChatRunner>
}