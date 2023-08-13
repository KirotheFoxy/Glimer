import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, User } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('blacklist')
		.setDescription('Blacklists A User')
		.addUserOption(user => user
			.setName('user')
			.setDescription('User That Is Getting Blacklisted')
			.setRequired(true)
		)
		.addStringOption(option => option
			.setName('reason')
			.setDescription('Reason For The Blacklist')
			.setRequired(true)
		),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply()
		let target = interaction.options.getUser("user") as User
		let reason = interaction.options.getString("reason") as string
		const blacklistEmbed = new EmbedBuilder()
		.setColor(0xFF0000)
		.setTitle('Blacklisted Added')
		.setAuthor({ name: 'Kail Bot', iconURL: 'https://cdn.discordapp.com/avatars/1112284541483229214/e5c466b23cfe0381bf4a04e712638fe0.webp?size=2048'})
		.setDescription(`<@${target.id}> Has Been Blacklisted`)
		 .addFields(
		    { name: 'Blacklisted Reason', value: reason },
            { name: 'Responsible User For Blacklist', value: `${target.id}` },
		//     { name: '\u200B', value: '\u200B' },
		    { name: 'Responsible User For Blacklist', value: `<@${interaction.user.id}>` },
		//     { name: 'Inline field title', value: 'Some value here', inline: true },
		 )
		// .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
		.setTimestamp()
		.setFooter({ text: 'User Blacklisted'});
        
		await interaction.reply({embeds: [blacklistEmbed]});
	},
};