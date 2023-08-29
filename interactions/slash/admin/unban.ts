import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, User } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Unbans A User')
		.addUserOption(user => user
			.setName('user')
			.setDescription('User That Is Getting Unbanned')
			.setRequired(true)
		)
		.addStringOption(option => option
			.setName('reason')
			.setDescription('Reason For The Unban')
			.setRequired(true)
		),
        async execute(interaction: ChatInputCommandInteraction) {
            await interaction.deferReply()
            let target = interaction.options.getUser("user") as User
            let reason = interaction.options.getString("reason") as string
            const unbanEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Ban Removed')
            .setDescription(`<@${target.id}> Has Been Unbanned`)
             .addFields(
                { name: 'User Id', value: `${target.id}` },
                { name: 'Unban Reason', value: reason },
                { name: 'Responsible Admin For Unban', value: `<@${interaction.user.id}>` },
            //     { name: 'Inline field title', value: 'Some value here', inline: true },
             )
            // .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
            .setTimestamp()
            .setFooter({ text: 'User Unbanned'});
		await interaction.guild?.bans.remove(target),
			
		await interaction.editReply({embeds: [unbanEmbed]});
	},
};