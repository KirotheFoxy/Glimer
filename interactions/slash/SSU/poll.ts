import { ChatInputCommandInteraction, SlashCommandBuilder, TextChannel, EmbedBuilder } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Poll For SSU'),

        async execute(interaction: ChatInputCommandInteraction) {
            await interaction.deferReply({ ephemeral: false });
            const pembed = new EmbedBuilder()
                .setTitle(`SSU Poll`)
                .setDescription(`Would you like an SSU!`)
                .addFields(
                    { name: `For SSU React With`, value: `✅` },
                    { name: 'If you Dont Want SSU React With', value: '❌' },
                )
                .setTimestamp();
        
            await interaction.editReply({ content: 'Poll Active ✅'});
            await (interaction.guild!.channels.cache.get(process.env.SSU!) as TextChannel).send({embeds: [pembed]})

        }
        
};