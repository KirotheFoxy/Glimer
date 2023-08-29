import { ButtonInteraction, EmbedBuilder } from "discord.js";

module.exports = {
    id: "tmspeak",

    async execute(interaction: ButtonInteraction) {
        await interaction.deferReply({ephemeral: true})
        const Embed = new EmbedBuilder()
        .setColor(0x0000FF)
        .setTitle('TeamSpeak Connection Help')
        .setDescription('Step 1\nOpen TeamSpeak and open connections tab')
        .setImage('https://cdn.discordapp.com/attachments/1107450936433070192/1146129044266557460/image.png')

        const qEmbed = new EmbedBuilder()
        .setColor(0x0000FF)
        .setDescription('Step 2\nClick connect then type info for server \nServer Address: hideout.ts3index.com \nServer Password: N/A')
        .setImage('https://cdn.discordapp.com/attachments/1107450936433070192/1146129159966441552/image.png')

        const wEmbed = new EmbedBuilder()
        .setColor(0x0000FF)
        .setDescription('Step 3\nAfter that click Connect and should connect you to the server')
        .setImage('https://cdn.discordapp.com/attachments/1107450936433070192/1146129434085163139/image.png')

        await interaction.editReply({ embeds: [Embed , qEmbed, wEmbed] })
    }
}