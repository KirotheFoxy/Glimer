import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, TextChannel, GuildMember, PermissionFlagsBits } from 'discord.js';


module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeouta')
        .setDescription('Times out a User')
        .addUserOption(user => user
			.setName('user')
			.setDescription('User That got Timed Out')
			.setRequired(true)
		)
		.addStringOption(option => option
			.setName('reason')
			.setDescription('Reason For The Timeout')
			.setRequired(true)
		)
        .addStringOption(str => str
            .setName('duration')
            .setDescription('How long to timeout this user.') 
            .setRequired(true)
            .setChoices(
                { name: '5min', value: '300000'},
                { name: '10min', value: '600000'},
                { name: '30min', value: '1800000'},
                { name: '1hour', value: '3600000'},
                { name: '3hour', value: '10800000h'},
                { name: '5hour', value: '18000000'},
                { name: '10hour', value: '36000000'},
                { name: '15hour', value: '54000000'},
                { name: '1day', value: '86400000'},
            ) 
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true });
        let target = (await interaction.guild?.members.fetch(interaction.options.getUser("user", true).id) as GuildMember);
        let duration = Number(interaction.options.getString('duration', true));

        const timeEmbed = new EmbedBuilder()
            .setTitle(`User Timed out`)
            .setDescription(`<@${target.id}> has been timed out!`)
            .addFields(
                { name: 'User Id', value: `${target.id}` },
                { name: 'Timeouted For', value: `<t:${Math.round((Date.now() + duration) / 1000)}> `},
                { name: 'Responsible Admin For Timeout', value: `<@${interaction.user.id}>` },
            //     { name: 'Inline field title', value: 'Some value here', inline: true },
            )
            // .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
            .setTimestamp()
            .setFooter({ text: 'Time Out Created'});
            
        await interaction.editReply({ content: 'Timeout Added ✅'});
        await (interaction.guild!.channels.cache.get(process.env.TIMEOUT_LOGS!) as TextChannel).send({embeds: [timeEmbed]})
        await target.timeout(duration)
    }
};