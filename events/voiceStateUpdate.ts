import { EmbedBuilder, TextChannel, VoiceState } from "discord.js";
import { CustomClient } from "..";
import { getVoiceConnection } from "@discordjs/voice";

module.exports = {
	name: "voiceStateUpdate",

	async execute(oldState: VoiceState, newState: VoiceState, client: CustomClient) {
        if (newState.guild.id !== process.env.TEST_GUILD_ID) return;
        if (newState.member!.user.bot) return;

        if (oldState.channelId === null && newState.channelId !== null) {
            const joinMSG = new EmbedBuilder()
                .setTitle("Voice - Channel Joined")
                .setColor("#00ff00")
                .setDescription(`<@${newState.id}> joined <#${newState.channelId}>`)
                .setTimestamp()
                .setFooter({ text: `${newState.id}` });
            await (client.channels.cache.get(process.env.VOICE_LOGS!) as TextChannel).send({ embeds: [joinMSG] });
        } else if (oldState.channelId !== null && newState.channelId === null) {
            const leaveMSG = new EmbedBuilder()
                .setTitle("Voice - Channel Left")
                .setColor("#ff0000")
                .setDescription(`<@${newState.id}> left <#${oldState.channelId}>`)
                .setTimestamp()
                .setFooter({ text: `${newState.id}` });
            await (client.channels.cache.get(process.env.VOICE_LOGS!) as TextChannel).send({ embeds: [leaveMSG] });

            if (oldState.channel!.members.size === 1 && oldState.channel!.members.firstKey() === process.env.CLIENT_ID) {
                var connection = getVoiceConnection(oldState.guild!.id);
                if (connection === undefined) return;
                await (client.channels.cache.get(process.env.STREAM_CHAT!) as TextChannel).send({ content: "Everyone left the VC 👋" });
                connection.destroy();
            };
        };
    }
};