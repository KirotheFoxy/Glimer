import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('crash')
		.setDescription('Replies with Pong!'),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply({ content: "Crashing Please Wait..."});
    process.exit(0)
  },
};