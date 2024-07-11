import { v4 } from "uuid";
import { ChatRunner, ChatRunnerId } from "types/chat";
import { getStateAt, setStateAt } from "../BonBon_Global_State";

export const createRunner = (runnerInfo: ChatRunner): [ChatRunnerId, ChatRunner] => {
    const runnerId = v4()

    setStateAt(`chat.runners.${runnerId}`, runnerInfo)

    return [runnerId, runnerInfo]
}

export const getRunner = (runnerId: ChatRunnerId) => {
    return getStateAt(`chat.runners.${runnerId}`)
}