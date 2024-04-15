import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, GuildMember, TextChannel } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeoutr')
        .setDescription('Removes Timeout From Someone')
        .addUserOption(user => user
			.setName('user')
			.setDescription('User That got Timed Out')
			.setRequired(true)
		)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

        async execute(interaction: ChatInputCommandInteraction) {
            await interaction.deferReply({ ephemeral: true });
            let target = (await interaction.guild?.members.fetch(interaction.options.getUser("user", true).id) as GuildMember);
            const removetoembed = new EmbedBuilder()
                .setTitle(`Timeout Removed`)
                .setDescription(`<@${target.id}>'s timed out has been Removed`)
                .addFields(
                    { name: 'User Id', value: `${target.id}` },
                    { name: 'Responsible Admin For Timeout Removal', value: `<@${interaction.user.id}>` },
                )
                .setTimestamp()
                .setFooter({ text: 'Timeout Removed'});
            
            await interaction.editReply({ content: 'Timeout Removed ✅'});
            await (interaction.guild!.channels.cache.get(process.env.TIMEOUT_LOGS!) as TextChannel).send({embeds: [removetoembed]})
            await target.timeout(null)
            
        }
};