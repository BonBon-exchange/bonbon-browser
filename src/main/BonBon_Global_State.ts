let state: Record<string, any> = {
    isChatActive: false
}

export const setState = (key: string, value: any) => {
    state = { ...state, [key]: value }
}
export const getState = (key: string) => state[key]

export const getStateAt = (path: string) => {
    const keys = path.split('.')
    const stateAt = keys.reduce((acc, val) => {
        return acc[val]
    }, state)
    return stateAt
}

export const setStateAt = (path: string, value: any) => {
    const keys = path.split('.');
    const lastKey = keys.pop();
    if (!lastKey) return;

    let nested = state;
    for (const key of keys) {
        if (!nested[key]) {
            nested[key] = {};
        }
        nested = nested[key];
    }

    nested[lastKey] = value;
};
