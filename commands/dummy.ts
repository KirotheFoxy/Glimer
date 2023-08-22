import { Message } from "discord.js";

module.exports = {
    name: "eval",
    description: 'Debugging command.',

    async execute(message: Message) {
        console.log(message);
    }
};