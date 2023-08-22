import { EmbedBuilder, GuildMember, Guild, TextChannel } from "discord.js";
import { inviteDB, userDB } from '../handlers/db.ts';
import { CustomClient } from "../index.ts";
import { errLog } from "../handlers/logger.ts";

module.exports = {
	name: "guildMemberAdd",
	once: false,

	async execute(member: GuildMember, client: CustomClient) {

		var cTimestampR = member.user.createdTimestamp.toString().substring(0, member.user.createdTimestamp.toString().length - 3);
		var cTimestamp = `<t:` + cTimestampR + `:R>`;

        // Cache invites on the server
		const guild: Guild | undefined = client.guilds.cache.get(process.env.TEST_GUILD_ID!);
		if (!guild) return errLog(client, "Guild not found.", false);
        const guildInvites = await guild.invites.fetch();

        // Test each cached invites against the database for differences in uses
		let userData: any;
		let inviteData: any;
		try {
			userData = await userDB.create({ userID: member.id });
		} catch {
			userData = await userDB.findOne({ where: { userID: member.id } });
			userData.joinCount += 1;
			userData.VRTime = 0;
			await userData.save();
		};

		guildInvites.forEach(async (invite) => {
			inviteData = await inviteDB.findOne({ where: { code: invite.code } });
			if (inviteData.uses != invite.uses) {
				inviteData.uses = invite.uses;
				await inviteData.save();
				userData.inviterID = inviteData.authorID;
				await userData.save();
			};
		});

		// log join
		const joinLog = new EmbedBuilder()
			.setTitle(`${member.user.username} - User Joined`)
			.setDescription(`<@${member.id}>`)
			.setColor("#00ff00")
			.setThumbnail(`https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png?size=1024`)
			.addFields(
				{ name: "Account Created", value: `${cTimestamp}` },
			)
			.setTimestamp()
			.setFooter({ text: `User ID: ${member.id}` });

		if (userData.inviterID != null) {
			joinLog.addFields({ name: "Inviter", value: `<@${userData.inviterID}>` });
		};

		(client.channels.cache.get(process.env.INVITE_LOGS!) as TextChannel).send({ embeds: [joinLog] });
	},
};