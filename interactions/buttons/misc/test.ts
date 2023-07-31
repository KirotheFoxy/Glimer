import { ButtonInteraction } from "discord.js";

module.exports = {
    id: "test",

    async execute(interaction: ButtonInteraction) {
        interaction.reply({ content: "Hello"})
    }
}