import { Interaction } from "discord.js";
import { CustomClient } from "..";

module.exports = {
    name: "interactionCreate",

    async execute (interaction: Interaction) {
        const client = interaction.client as CustomClient
        if (!interaction.isChatInputCommand()) return
        const command = client.slashCommands.get(interaction.commandName)
        if (!command) return
        try {
            await command.execute(interaction)
        } catch (error) {
            console.warn(error)
            await interaction.reply({
                content: "Insert Error 😊",
                ephemeral:true
            })
        }
    }
}