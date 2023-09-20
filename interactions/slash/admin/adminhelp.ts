import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('adminhelp')
		.setDescription('What Command do your need help with!')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction: ChatInputCommandInteraction) {
		const r1 = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('alist')
                    .setLabel('Admin List')
                    .setStyle(ButtonStyle.Primary)
            )
		await interaction.reply({ content: "Here you go!", components: [r1]});
	},
}