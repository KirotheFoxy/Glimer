import { ChatInputCommandInteraction, SlashCommandBuilder,EmbedBuilder, TextChannel } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ssd')
        .setDescription('Server Shutdown Command'),

        async execute(interaction: ChatInputCommandInteraction) {
            await interaction.deferReply({ ephemeral: false });
            const embed = new EmbedBuilder()
                .setTitle(`[SSD] Server Shutdown`)
                .setDescription(`Thank you for the people who joined the [SSU]`)
                .setTimestamp();
            

        if ( interaction.channelId = '1127656845968932864') return interaction.editReply({ content: 'SSD Active ✅'});
        await (interaction.guild!.channels.cache.get(process.env.SSU!) as TextChannel).send({embeds: [embed]})
        }
};