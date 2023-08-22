import { Message } from "discord.js";
import log from "../../handlers/logger";

module.exports = {
    name: "eval",
    description: 'Debugging command.',

    async execute(message: Message) {
        log.info(message);
    }
};