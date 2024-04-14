import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, TextChannel, User } from "discord.js";

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
                { name: 'Roblox', value: 'Blacklisted From Roblox'},
				{ name: 'DPS', value: 'Blacklisted From DPS'},
				{ name: 'GCSO', value: 'Blacklisted From GCSO'},
				{ name: 'EEPD', value: 'Blacklisted From EEPD'},
				{ name: 'GCFR', value: 'Blacklisted From GCFR'},
				{ name: 'GT', value: 'Blacklisted From GT'},
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
		
        await interaction.editReply({ content: 'Blacklist Added ✅'});
        await (interaction.guild!.channels.cache.get(process.env.BLACKLIST_LOGS!) as TextChannel).send({embeds: [blacklistEmbed]})
	},
};