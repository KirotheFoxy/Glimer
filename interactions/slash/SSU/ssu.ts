import { ChatInputCommandInteraction, SlashCommandBuilder,EmbedBuilder, TextChannel } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ssu')
        .setDescription('Server Start Up Command'),

        async execute(interaction: ChatInputCommandInteraction) {
            await interaction.deferReply({ ephemeral: false });
            const embed = new EmbedBuilder()
                .setTitle(`Server Start Up`)
                .setDescription(`[SSU] Server Start-Up! Let's get active! Code: Gilmer`)
                .setTimestamp()
                .setFooter({ text:"Let's get some amazing roleplays started!"});

        await interaction.editReply({ content: 'SSU Active ✅'});
        await (interaction.guild!.channels.cache.get(process.env.SSU!) as TextChannel).send({embeds: [embed]})
        }
};