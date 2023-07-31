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
		.setColor(0x0099FF)
		.setTitle('User Banned')
		.setAuthor({ name: 'Kail Bot', iconURL: 'https://cdn.discordapp.com/avatars/1112284541483229214/e5c466b23cfe0381bf4a04e712638fe0.webp?size=2048'})
		.setDescription(`${target.username} Has Been Banned`)
		// .addFields(
		//     { name: 'Regular field title', value: 'Some value here' },
		//     { name: '\u200B', value: '\u200B' },
		//     { name: 'Inline field title', value: 'Some value here', inline: true },
		//     { name: 'Inline field title', value: 'Some value here', inline: true },
		// )
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
			
		await interaction.editReply({ content: 'User Has Been Banned', embeds: [banEmbed]});
	},
};