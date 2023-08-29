import { ButtonInteraction, EmbedBuilder } from "discord.js";

module.exports = {
    id: "fivem",

    async execute(interaction: ButtonInteraction) {
        await interaction.deferReply({ephemeral: true})
        const Embed = new EmbedBuilder()
        .setColor(0xff6f00)
        .setTitle('FiveM Connection Help')
        .setDescription('Step 1\nPress F8 to pull up console')
        .setImage('https://cdn.discordapp.com/attachments/1141481698362662952/1145966123427303464/image.png')

        const qEmbed = new EmbedBuilder()
        .setColor(0xff6f00)
        .setDescription('Step 2\nType connect mkvk3a into console, press enter then press F8 again')
        .setImage('https://cdn.discordapp.com/attachments/1141481698362662952/1145965921538670612/image.png')
        await interaction.editReply({ embeds: [Embed , qEmbed] })
    }
}