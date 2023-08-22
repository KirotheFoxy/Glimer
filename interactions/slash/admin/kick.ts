import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, TextChannel } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server.')
        .addUserOption(user => user
			.setName('user')
			.setDescription('User That Is Getting Banned')
			.setRequired(true)
		).addStringOption(option => option
			.setName('reason')
			.setDescription('Reason For The Ban')
			.setRequired(true)
		),

        async execute(interaction: ChatInputCommandInteraction) {
            await interaction.deferReply();
            let target = interaction.options.getUser('user', true);
            let reason = interaction.options.getString("reason") as string

            const kickEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Kick Added')
            .setDescription(`<@${target.id}> Has Been Kicked`)
             .addFields(
                { name: 'User Id', value: `${target.id}` },
                { name: 'Kick Reason', value: reason },
                { name: 'Responsible Admin For Kick', value: `<@${interaction.user.id}>` },
            //     { name: 'Inline field title', value: 'Some value here', inline: true },
             )
            // .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
            .setTimestamp()
            .setFooter({ text: 'User Kicked'});
            
            await interaction.guild?.members.cache.get(target.id)?.kick(reason);
            
            await interaction.editReply({ content: 'Kicked ✅'});
            await (interaction.guild!.channels.cache.get(process.env.EVENT_LOGS!) as TextChannel).send({embeds: [kickEmbed]});
        }
};