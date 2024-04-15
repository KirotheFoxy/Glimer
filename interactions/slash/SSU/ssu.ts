import { ChatInputCommandInteraction, SlashCommandBuilder,EmbedBuilder, TextChannel } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ssu')
        .setDescription('Server Start Up Command'),

        async execute(interaction: ChatInputCommandInteraction) {
            await interaction.deferReply({ ephemeral: false });
            const suembed = new EmbedBuilder()
                .setTitle(`Server Start Up`)
                .setDescription(`[SSU] Server Start-Up! Let's get active! Code: Gilmer`)
                .addFields(
                    { name: 'Server Code', value: 'Gilmer' },
                    { name: 'Please listen to staff at the start of patrol.', value: "Let's get some roleplays started"},
                )
                .setTimestamp();
        await interaction.editReply({ content: 'SSU Active ✅'});
        await (interaction.guild!.channels.cache.get(process.env.SSU!) as TextChannel).send({embeds: [suembed]})
        }
};