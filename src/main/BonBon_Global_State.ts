let state: Record<string, any> = {
    isChatActive: false
}

export const setState = (key: string, value: any) => {
    state = { ...state, [key]: value }
}
export const getState = (key: string) => state[key]