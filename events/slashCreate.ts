import { Interaction } from "discord.js";
import { CustomClient } from "..";
import { errLog, intLog } from '../handlers/logger.ts';

module.exports = {
    name: "interactionCreate",

    async execute (interaction: Interaction) {
        const client = interaction.client as CustomClient
        if (!interaction.isChatInputCommand()) return
        const command = client.slashCommands.get(interaction.commandName)
        if (!command) return
        try {
            intLog(interaction);
            await command.execute(interaction)
        } catch (error: any) {
            errLog(interaction.client as CustomClient, error);
            await interaction.reply({
                content: "Insert Error 😊",
                ephemeral:true
            })
        }
    }
}