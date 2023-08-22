import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, Role, SlashCommandBuilder, TextChannel } from "discord.js";
import { tempRoleDB } from "../../../handlers/db";
import { CustomClient } from "../../..";
import log from "../../../handlers/logger";

async function remRole(client: CustomClient, target: string, role: string) {
    var guild = await client.guilds.cache.get(process.env.TEST_GUILD_ID!);
    if (!guild) return log.error(`Could not fetch guild`);
    var user = await guild.members.fetch(target);
    if (!user) return log.error(`Could not fetch user ${target}`);

    log.info(role);
    await user.roles.remove(role);
    await tempRoleDB.destroy({where: {user: target, role: role}});
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-role')
		.setDescription('Adds a Role to a User')
		.addUserOption(user => user
			.setName('user')
			.setDescription('User That Is Getting Role')
			.setRequired(true)
		)
		.addRoleOption(role => role
			.setName('role')
			.setDescription('Role Selector')
			.setRequired(true)
		)
        .addStringOption(str => str
            .setName('duration')
            .setDescription('How long to add this role to this user.') 
            .setChoices(
                { name: '5min', value: '5m'},
                { name: '10min', value: '10m'},
                { name: '30min', value: '30m'},
                { name: '1hour', value: '1h'},
                { name: '3hour', value: '3h'},
                { name: '5hour', value: '5h'},
                { name: '10hour', value: '10h'},
                { name: '15hour', value: '15h'},
                { name: '1day', value: '1d'},
            ) 
        ),
        async execute(interaction: ChatInputCommandInteraction) {
            await interaction.deferReply()
            let target = (await interaction.guild?.members.fetch(interaction.options.getUser("user", true).id) as GuildMember);
            let role = interaction.options.getRole("role", true) as Role
            let duration = interaction.options.getString('duration', false);
            if (duration) {
                let durationMS: number;
                switch (duration) {
                    case '5m':
                        durationMS = 300000;
                    break;
                    case '10m':
                        durationMS = 600000;
                    break;
                    case '30m':
                        durationMS = 1800000;
                    break;
                    case '1h':
                        durationMS = 3600000;
                    break;
                    case '3h':
                        durationMS = 10800000;
                    break;
                    case '5h':
                        durationMS = 18000000;
                    break;
                    case '10h':
                        durationMS = 36000000;
                    break;
                    case '15h':
                        durationMS = 54000000;
                    break;
                    case '1d':
                        durationMS = 86400000;
                    break;
                };

                await tempRoleDB.create({
                    user: target.id,
                    role: role.id,
                    whenAdded: Date.now(),
                    whenToRemove: Date.now()+durationMS!,
                });

                log.info(durationMS!);
                setTimeout(remRole, durationMS!, interaction.client, target.id, role.id);
            };

            if (role.name === '@everyone') return interaction.editReply({content: 'No. Just No.'});
            const roleEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('Role Added')
            .setDescription(`<@${target.id}> Has Been Given a Role `)
             .addFields(
                { name: 'User Id', value: `${target.id}` },
                { name: 'Role Name', value: `${role}`},
                { name: 'Responsible Admin For Role', value: `<@${interaction.user.id}>` },
            //     { name: 'Inline field title', value: 'Some value here', inline: true },
             )
            // .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
            .setTimestamp()
            .setFooter({ text: 'Role Update'});
        await  target.roles.add(role)

        await interaction.editReply({ content: 'Role Added ✅'});
        await (interaction.guild!.channels.cache.get(process.env.ROLE_LOGS!) as TextChannel).send({embeds: [roleEmbed]})
	},
};