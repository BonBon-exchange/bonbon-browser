export type ChatRunnerId = string

export type ChatRunner = {
    action: "contact"
    context: any
}

export type ChatState = {
    username: string,
    magic: string,
    runners?: Record<ChatRunnerId, ChatRunner>
    visibleRunner: null | string
    isChatActive: boolean
    userIsCloseToChatBar: boolean
}

export type ChatView = "" | "home" | "meet" | "contact" | ReturnType<(runnerId: string, hostView: string) => `${hostView}:runner-${runnerId}`>