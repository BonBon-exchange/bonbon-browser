import { v4 } from "uuid";
import { ChatRunner, ChatRunnerId } from "types/chat";

export const createRunner = (runnerInfo: ChatRunner): [ChatRunnerId, ChatRunner] => {
    const runnerId = v4()

    return [runnerId, runnerInfo]
}