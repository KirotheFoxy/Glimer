import log from '../../../handlers/logger.ts';
import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, TextChannel } from "discord.js";
import { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus, entersState } from '@discordjs/voice';

let player: any;

async function joinVC (interaction: any) {
    return joinVoiceChannel({
        guildId: interaction.guildId,
        channelId: interaction.member.voice.channelId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
    });
};

module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("say")
		.setDescription(
			"Text to speech for voice chat."
		)
        .addStringOption((optional) => optional
            .setName("text")
            .setDescription("Text to speak.")
            .setRequired(true)
        ),


	async execute(interaction: ChatInputCommandInteraction) {
        // Get information from the command
        let user  = (interaction.guild!.members.cache.get(interaction.member!.user.id) as GuildMember);
        let displayNameRaw = (interaction.member! as GuildMember).displayName;
        let tchannel = interaction.channelId;
        let channel = (interaction.member! as GuildMember).voice.channel;
        let args = interaction.options.getString("text");
        
        // Make sure user doesn't have blacklist role
        if (user.roles.cache.find((r: { name: string; }) => r.name === "TTS Blacklisted")) {
            await interaction.reply({ content: "You are blacklisted from using TTS.", ephemeral: true });
            log.info(`Slash Command | say | called by ${user.displayName} but they are blacklisted.`);
            return;
        };
        
        // Make sure the command was ran in stream-chat
        if (tchannel != process.env.STREAM_CHAT) {
            await interaction.reply({ content: 'This command can only be used in no mic', ephemeral: true });
            return;
        };

        // Make sure the user is in a voice channel
        if (channel === null) {
            await interaction.reply({ content: "You must be in a voice channel to use this command.", ephemeral: true });
            return;
        };

        if(!args![0]) return interaction.reply({ content: "Please provide something to say.", ephemeral: true });

        if (args!.length > 200) {
            await interaction.reply({ content: "Your message is too long. Please keep it under 200 characters.", ephemeral: true });
            await (interaction.guild!.channels.cache.get(process.env.COMMAND_LOGS!) as TextChannel).send({ content: `was rejected as it was over 200 chars (was ` + args!.length + `)` });
            log.info(`Slash Command | say (rejected - over 200 chars) | called by ${user.displayName}`);
            return;
        };

        // Join the voice channel
        let connection = await joinVC(interaction);

        if (connection.state.status == VoiceConnectionStatus.Destroyed || connection.state.status == VoiceConnectionStatus.Disconnected || connection.state.status == VoiceConnectionStatus.Signalling) {
            try {
                await Promise.race([
                    entersState(connection, VoiceConnectionStatus.Signalling, 1000),
                    entersState(connection, VoiceConnectionStatus.Connecting, 1000),
                ]);
            } catch {
                connection.destroy();
                connection = await joinVC(interaction);
            };
        };

        // Create the audio player
        player = createAudioPlayer();
        connection.subscribe(player);

        // Handle user name segment
        let displayname = displayNameRaw.split(',');
        let name = displayname.join(" ").replace(/[^\x00-\x7F]/g, '')
        name = name.replace(/[%#]/g, '');
        name = name.replace(/&/g, 'and')
        name = name.replace(/(<a?:)(.+?)(:[0-9]+>)/g, `$2`)


        // Handle the message
        let message = args!.split(',');
        let text = message.join(" ").replace(/[^\x00-\x7F]/g, '')
        text = text.replace(/[%#]/g, '');
        text = text.replace(/&/g, 'and')
        text = text.replace(/(<a?:)(.+?)(:[0-9]+>)/g, `$2`)

        const resource = createAudioResource(`https://api.streamelements.com/kappa/v2/speech?voice=Matthew&text=${name} Said - ${text}`);
        player.play(resource);

        await interaction.reply({ content: `TTS - '${args}'` });
    }
};