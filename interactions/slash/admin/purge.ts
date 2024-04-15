import { ChatInputCommandInteraction, Collection, Message, SlashCommandBuilder, TextChannel, PermissionFlagsBits } from 'discord.js';
import { MessageDB } from '../../../handlers/db';

module.exports = {
  // The data needed to register slash commands to Discord.
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Purge Messages. (Up to 14 days.)')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('any')
        .setDescription('Purge any message.')
        .addIntegerOption((int) => int.setName('amount').setDescription('Amount of messages to purge. (Max 100)').setRequired(true)),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('user')
        .setDescription('Purge Messages from a specific user.')
        .addUserOption((user) => user.setName('user').setDescription('User to purge messages from.').setRequired(true))
        .addIntegerOption((int) => int.setName('amount').setDescription('Amount of messages to purge. (Max 100)').setRequired(true)),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    let msgs: Collection<string, Message>;
    let msgsToDelete: string[] = [];
    let msgNum = interaction.options.getInteger('amount', true);
    if (msgNum > 1000) return interaction.editReply('You can only purge up to 1000 messages at a time.');

    let command = interaction.options.getSubcommand(true);
    switch (command) {
      case 'any':
        msgs = await MessageDB.findAll({ limit: msgNum, order: [['createdAt', 'DESC']], where: { channelID: interaction.channelId } });
        break;
      case 'user':
        msgs = await MessageDB.findAll({
          limit: msgNum,
          order: [['createdAt', 'DESC']],
          where: { channelID: interaction.channelId, userID: interaction.options.getUser('user', true).id },
        });
        break;
    }
    msgs!.forEach((msg) => {
      msgsToDelete.push(msg.id);
    });

    let deletedMsgs = await (interaction.channel! as TextChannel).bulkDelete(msgsToDelete!, true);

    // Send confirmation
    await interaction.editReply(`Purged ${deletedMsgs.size} messages.`);
  },
};