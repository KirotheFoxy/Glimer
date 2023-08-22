import { userDB } from '../../../handlers/db.ts';
import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, SlashCommandBuilder } from "discord.js";
import { errLog } from '../../../handlers/logger.ts';
import { CustomClient } from '../../../index.ts';

function getUserBitFlags(bitflags: string): string {
    const bitflagsNumber = parseInt(bitflags, 10);
  
    if (isNaN(bitflagsNumber)) {return '';};
  
    const bitFlags: string[] = [];
    
    if (bitflagsNumber & (1 << 0)) {bitFlags.push('DiscordEmployee');};
    if (bitflagsNumber & (1 << 1)) {bitFlags.push('PartneredServerOwner');};
    if (bitflagsNumber & (1 << 2)) {bitFlags.push('Hypesquad');};
    if (bitflagsNumber & (1 << 3)) {bitFlags.push('BugHunterLevel1');};
    if (bitflagsNumber & (1 << 4)) {bitFlags.push('MFASMS');};
    if (bitflagsNumber & (1 << 5)) {bitFlags.push('PremiumPromoDismissed');};
    if (bitflagsNumber & (1 << 6)) {bitFlags.push('HypeSquadBravery');};
    if (bitflagsNumber & (1 << 7)) {bitFlags.push('HypeSquadBrilliance');};
    if (bitflagsNumber & (1 << 8)) {bitFlags.push('HypeSquadBalance');};
    if (bitflagsNumber & (1 << 9)) {bitFlags.push('PremiumEarlySupporter');};
    if (bitflagsNumber & (1 << 10)) {bitFlags.push('TeamPseudoUser');};


    if (bitflagsNumber & (1 << 13)) {bitFlags.push('HasUnreadUrgentMessages');};
    if (bitflagsNumber & (1 << 14)) {bitFlags.push('BugHunterLevel2');};

    if (bitflagsNumber & (1 << 16)) {bitFlags.push('VerifiedBot');};
    if (bitflagsNumber & (1 << 17)) {bitFlags.push('EarlyVerifiedBotDeveloper');};
    if (bitflagsNumber & (1 << 18)) {bitFlags.push('CertifiedModerator');};
    if (bitflagsNumber & (1 << 19)) {bitFlags.push('BotHTTPInteractions');};
    if (bitflagsNumber & (1 << 20)) {bitFlags.push('Spammer');};
    if (bitflagsNumber & (1 << 21)) {bitFlags.push('DisablePremium');};
    if (bitflagsNumber & (1 << 22)) {bitFlags.push('ActiveDeveloper');};
    

    if (bitflagsNumber & (1 << 44)) {bitFlags.push('Quarantined');};
    if (bitflagsNumber & (1 << 50)) {bitFlags.push('Collaborator');};        
    if (bitflagsNumber & (1 << 51)) {bitFlags.push('RestrictedCollaborator');};
  
    const bitFlagString = bitFlags.join(', ')
      .replace(/([A-Z])/g, ' $1')
      .trim();
  
    return bitFlagString;
};

function getGuildBitFlags(bitflags: string): string {
    const bitflagsNumber = parseInt(bitflags, 10);
  
    if (isNaN(bitflagsNumber)) {return '';};
  
    const bitFlags: string[] = [];
    
    if (bitflagsNumber & (1 << 8)) {bitFlags.push('AutomodQuarantinedBio');};
    if (bitflagsNumber & (1 << 7)) {bitFlags.push('AutomodQuarantinedUsernameOrGuildNickname');};
    if (bitflagsNumber & (1 << 2)) {bitFlags.push('BypassesVerification');};
    if (bitflagsNumber & (1 << 6)) {bitFlags.push('CompletedHomeActions');};
    if (bitflagsNumber & (1 << 1)) {bitFlags.push('CompletedOnboarding');};
    if (bitflagsNumber & (1 << 0)) {bitFlags.push('DidRejoin');};
    if (bitflagsNumber & (1 << 5)) {bitFlags.push('StartedHomeActions');};
    if (bitflagsNumber & (1 << 3)) {bitFlags.push('StartedOnboarding');};

    const bitFlagString = bitFlags.join(', ')
      .replace(/([A-Z])/g, ' $1')
      .trim();
  
    return bitFlagString;
};

module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("whois")
		.setDescription(
			"View information about yourself or another user."
		)
        .addUserOption((optional) => optional
            .setName("user")
            .setDescription("User to view information about.")
        ),


	async execute(interaction: ChatInputCommandInteraction) {
        let client = interaction.client as CustomClient;
        await interaction.deferReply({ ephemeral: true });
        let whoisTarget = undefined; 
        let userData = undefined;

        // Get information from the command
        let user = interaction.options.getUser('user');
        let member: GuildMember;

        if (user === null ) { // If the user is using the command without any options
            whoisTarget = "discord";
            member = await (interaction.member as GuildMember).fetch();
        };

        if (user != null) { // If the user is using the command with the user option
            whoisTarget = "discord";
            member = await interaction.guild!.members.fetch(user.id);
        };


        switch (whoisTarget) { // Get the user's data from the database
            case "discord":
                userData = await userDB.findOne({ where: { userID: member!.id } });
                // Get the user's data from the database
                if (!userData) {
                    try {
                        userData = await userDB.create({ userID: member!.id });
                    } catch (error: any) {
                        errLog(client, error);
                        return interaction.editReply({ content: "An error occurred while trying to fetch the user's data." });
                    };
                };
            break;
        };
;
        let cTimestamp = member!.user.createdTimestamp.toString().substring(0, member!.user.createdTimestamp.toString().length - 3);
        let jTimestamp = member!.joinedTimestamp!.toString().substring(0, member!.joinedTimestamp!.toString().length - 3);
        let roleListRaw = `<@&${member!.roles.cache.map((role: { id: any; }) => role.id).join(">, <@&")}>`;
        let lastRoleIndex = roleListRaw.lastIndexOf(", ")
        let roleList = roleListRaw.substring(0, lastRoleIndex);

        // Make sure the returned role list isn't empty
        if (roleList === "") {
            roleList = "None";
        };

        // Create the embed
        const whois = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle(`whois - ${member!.displayName}`)
            .setDescription(`AKA <@${member!.id}>`)
            .addFields(
                { name: "ID", value: member!.id, inline: false },
                { name: "Account Created", value: `<t:${cTimestamp}:R>` , inline: true },
                { name: "Joined Server" , value: `<t:${jTimestamp}:R>`, inline: true },
            )
            .setThumbnail(`https://cdn.discordapp.com/avatars/${member!.id}/${member!.user.avatar}.png?size=1024`);

            if (userData?.inviterID) {
                if (userData?.inviterID !== 'N/A') {
                    whois.addFields({ name: "Inviter", value: `<@${userData?.inviterID}>`, inline: true });
                };
            };

            if (userData!.joinCount > 0) {
                whois.addFields({ name: "Join Count", value: `${userData?.joinCount}`, inline: true });
            };

            whois.addFields(
                { name: "Roles", value: `${roleList}`, inline: false },
            );

            // Bitfield stuff

            // User
            let userFlags = getUserBitFlags(member!.user.flags!.bitfield.toString());
            if (userFlags.length > 0) {
                whois.addFields(
                    { name: "User Flags", value: userFlags, inline: false }
                );
            };

            // Guild
            let guildFlags = getGuildBitFlags(member!.flags?.bitfield.toString());
            if (guildFlags.length > 0) {
                whois.addFields(
                    { name: "Guild Flags", value: guildFlags, inline: false }
                );
            };

        await interaction.editReply({ embeds: [whois] });
    }
};