import { ChatInputCommandInteraction, SlashCommandBuilder,EmbedBuilder, TextChannel } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ssd')
        .setDescription('Server Shutdown Command'),

        async execute(interaction: ChatInputCommandInteraction) {
            await interaction.deferReply({ ephemeral: false });
            const sdembed = new EmbedBuilder()
                .setTitle(`[SSD] Server Shutdown`)
                .setDescription(`Thank you for the people who joined the [SSU]`)
                .addFields(
                    { name: "We ask that you do not rejoin the server while it is shut down", value: "As there will be no staff members online"},
                )
                .setFooter({ text: "We hope to see you in the next server Startup!"})
                .setTimestamp();
            

        await interaction.editReply({ content: 'SSD Active ✅'});
        await (interaction.guild!.channels.cache.get(process.env.SSU!) as TextChannel).send({embeds: [sdembed]})
        }
};