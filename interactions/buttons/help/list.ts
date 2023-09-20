import { ButtonInteraction, EmbedBuilder } from "discord.js"

module.exports = {
    id: "list",

    async execute(interaction: ButtonInteraction) {
        await interaction.deferReply()
        const Embed = new EmbedBuilder()
        .setColor(0xff6f00)
        .setTitle('Help Command')
        .setDescription('Default Help Command')
        .addFields(
            { name: 'Help', value: 'Test' }
            
        )
        await interaction.editReply({ embeds: [Embed] })
    }
}