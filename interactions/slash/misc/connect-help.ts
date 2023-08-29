import { ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder  } from "discord.js";

const { } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('connect-help')
		.setDescription('Replies with Pong!'),
	async execute(interaction: ChatInputCommandInteraction) {

        const fivem = new ButtonBuilder()
            .setCustomId('fivem')
            .setLabel('FiveM Direct Connect')
            .setDisabled(false)
            .setStyle(ButtonStyle.Primary);

        const redm = new ButtonBuilder()
            .setCustomId('redm')
            .setLabel('RedM Direct Connect')
            .setDisabled(true)
            .setStyle(ButtonStyle.Danger);

        const tmspeak = new ButtonBuilder()
            .setCustomId('tmspeak')
            .setLabel('TeamSpeak Connnect')
            .setDisabled(false)
            .setStyle(ButtonStyle.Success);

        const fivem2 = new ButtonBuilder()
            .setLabel('FiveM Quick Connect')
            .setURL(`https://cfx.re/join/mkvk3a`)
            .setDisabled(false)
            .setStyle(ButtonStyle.Link);

        const redm2 = new ButtonBuilder()
            .setLabel('RedM Quick Connect')
            .setURL('https://cfx.re/join/pkvgym')
            .setDisabled(false)
            .setStyle(ButtonStyle.Link);  

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(fivem, fivem2, redm, redm2, tmspeak)

		await interaction.reply({ content: "What do you need help connecting to?", ephemeral: true, components: [row]});
	},
};