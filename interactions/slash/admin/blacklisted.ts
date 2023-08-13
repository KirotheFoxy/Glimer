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
		)
        .addStringOption(area => area
			.setName('area')
			.setDescription('What Are They Blacklisted From')
			.setRequired(true)
            .addChoices(
                { name: 'Staff', value: 'Blacklisted From Staff'},
                { name: 'Community', value: 'Blacklisted From Community'},
                { name: 'FiveM', value: 'Blacklisted From FiveM'},
            )
		),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply()
		let target = interaction.options.getUser("user") as User
		let reason = interaction.options.getString("reason") as string
        let area = interaction.options.getString("area") as string
		const blacklistEmbed = new EmbedBuilder()
		.setColor(0xFF0000)
		.setTitle('Blacklisted Added')
		.setAuthor({ name: 'Kail Bot', iconURL: 'https://cdn.discordapp.com/avatars/1112284541483229214/e5c466b23cfe0381bf4a04e712638fe0.webp?size=2048'})
		.setDescription(`<@${target.id}> Has Been Blacklisted`)
		 .addFields(
            { name: 'User Id', value: `${target.id}` },
            { name: 'Blacklisted Reason', value: reason },
            { name: 'User Was Blacklisted From', value: area },
		    { name: 'Responsible User For Blacklist', value: `<@${interaction.user.id}>` },
		//     { name: 'Inline field title', value: 'Some value here', inline: true },
		 )
		// .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
		.setTimestamp()
		.setFooter({ text: 'User Blacklisted'});
        
		await interaction.editReply({embeds: [blacklistEmbed]});
	},
};