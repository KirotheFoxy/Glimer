import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bans A User'),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply('User Has Been Banned');
	},
};