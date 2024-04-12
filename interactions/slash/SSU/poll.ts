import { ChatInputCommandInteraction, SlashCommandBuilder, TextChannel, EmbedBuilder } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Poll For SSU'),

        async execute(interaction: ChatInputCommandInteraction) {
            await interaction.deferReply({ ephemeral: false });
            const embed = new EmbedBuilder()
                .setTitle(`SSU Poll`)
                .setDescription(`Would you like an SSU!`)
                .addFields(
                    { name: `For SSU React With`, value: `✅` },
                    { name: 'If you Dont Want SSU React With', value: '❌' },
                )
                .setTimestamp();
            
            const message = await interaction.fetchReply();
            message.react('✅');
            message.react('❌');
        
            await interaction.editReply({ content: 'Poll Active ✅'});
            await (interaction.guild!.channels.cache.get(process.env.SSU!) as TextChannel).send({embeds: [embed]})

        }
        
};