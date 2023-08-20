import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, Role, SlashCommandBuilder } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove-role')
		.setDescription('Remove a Role to a User')
		.addUserOption(user => user
			.setName('user')
			.setDescription('User That Is Losing the Role')
			.setRequired(true)
		)
		.addRoleOption(role => role
			.setName('role')
			.setDescription('Role Selector')
			.setRequired(true)
		),
        async execute(interaction: ChatInputCommandInteraction) {
            await interaction.deferReply()
            let target = (await interaction.guild?.members.fetch(interaction.options.getUser("user", true).id) as GuildMember);
            let role = interaction.options.getRole("role") as Role
            const temproleEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Role Removed')
            .setDescription(`<@${target.id}> Has Been Lost a Role `)
             .addFields(
                { name: 'User Id', value: `${target.id}` },
                { name: 'Role Name', value: `${role}`},
                { name: 'Responsible Admin For Role', value: `<@${interaction.user.id}>` },
            //     { name: 'Inline field title', value: 'Some value here', inline: true },
             )
            // .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
            .setTimestamp()
            .setFooter({ text: 'Role Update'});
        await  target.roles.remove(role)

		await interaction.editReply({embeds: [temproleEmbed]});
	},
};