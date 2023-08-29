import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, User } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('globalban')
		.setDescription('Bans A User')
		.addUserOption(user => user
			.setName('user')
			.setDescription('User That Is Getting Banned')
			.setRequired(true)
		)
		.addStringOption(option => option
			.setName('reason')
			.setDescription('Reason For The Ban')
			.setRequired(true)
		),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply()
		let target = interaction.options.getUser("user") as User
		let reason = interaction.options.getString("reason") as string
		const banEmbed = new EmbedBuilder()
		.setColor(0xFF0000)
		.setTitle('Ban Added')
		.setDescription(`<@${target.id}> Has Been Global Banned`)
		 .addFields(
			{ name: 'User Id', value: `${target.id}` },
			{ name: 'Global Ban Reason', value: reason },
			{ name: 'Responsible Admin For Global Ban', value: `<@${interaction.user.id}>` },
		//     { name: 'Inline field title', value: 'Some value here', inline: true },
		 )
		// .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
		.setTimestamp()
		.setFooter({ text: 'User Banned'});
		let guildarray = process.env.GUILD_LIST!.split(","); // Server List
		for (let guild of guildarray) {
			try {
			let guildobject = await interaction.client.guilds.fetch(guild)
			await guildobject.bans.create(target, {deleteMessageSeconds: 604800 , reason: reason})
			} catch {
				"Insert Error"
			}
		}
			
		await interaction.editReply({embeds: [banEmbed]});
	},
};