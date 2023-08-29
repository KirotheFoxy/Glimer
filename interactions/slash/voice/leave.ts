import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { getVoiceConnection } from '@discordjs/voice';	


module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("leave")
		.setDescription(
			"Have the bot leave the current voice channel."
		),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply({ content: "Leaving voice channel..." });
        let connection = getVoiceConnection(interaction.guild!.id);
		if (connection == undefined) {
			await interaction.editReply({ content: "I am not in a voice channel." });
		} else {
			connection.destroy();
			let leaveStr: string = "Left voice channel"
			if (interaction.guild!.members.me!.voice.channel != null) {
				leaveStr = leaveStr + ` <#${interaction.guild!.members.me!.voice.channel.id}>`;
			};
			await interaction.editReply({ content: leaveStr + "." });
		};
        return;
    }
};