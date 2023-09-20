import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('What Command do your need help with!'),
	async execute(interaction: ChatInputCommandInteraction) {
		const r1 = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder()
					.setCustomId("list")
					.setLabel("Help List")
					.setStyle(ButtonStyle.Primary)
			)
		await interaction.reply({ content: "Here you go!", components: [r1]});
	},
}