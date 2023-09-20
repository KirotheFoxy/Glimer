import { ButtonInteraction, EmbedBuilder } from "discord.js"

module.exports = {
    id: "alist",

    async execute(interaction: ButtonInteraction) {
        await interaction.deferReply()
        const Embed = new EmbedBuilder()
        .setColor(0xff6f00)
        .setTitle('Admin Help Commands')
        .setDescription('Default Admin Commands')
        .setFields(
            { name: 'Kick', value: 'Kicks a User'},
            { name: 'Ban', value: 'Bans a User'},
            { name: 'Global Ban', value: 'Bans user from Multiple Servers'},
            { name: 'Unban', value: 'Unbans a User'},
            { name: 'Blacklist', value: 'Blacklists a User'},
        )
        await interaction.editReply({ embeds: [Embed] })
    }
}