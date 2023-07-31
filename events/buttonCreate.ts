import { Interaction } from "discord.js";
import { CustomClient } from "..";

module.exports = {
    name: "interactionCreate",

    async execute (interaction: Interaction) {
        const client = interaction.client as CustomClient
        if (!interaction.isButton()) return
        const command = client.buttonCommands.get(interaction.customId)
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