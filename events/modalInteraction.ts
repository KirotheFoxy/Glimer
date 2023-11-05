import { Interaction } from 'discord.js';
import { errLog, intLog } from '../handlers/logger.ts';
import { CustomClient } from '../index.ts';
import { blacklistCheck } from '../handlers/db.ts';

module.exports = {
  name: 'interactionCreate',

  async execute(interaction: Interaction) {
    // Deconstructed client from interaction object.
    const client = interaction.client as CustomClient;

    // Checks if the interaction is a modal interaction (to prevent weird bugs)
    if (!interaction.isModalSubmit()) return;

    const command = client.modalCommands.get(interaction.customId);

    // If the interaction is not a command in cache, return error message.
    if (!command) {
      await require('../messages/defaultModalError').execute(interaction);
      return;
    }

    // A try to execute the interaction.

    var isBlacklisted = await blacklistCheck(interaction.user.id);
    if (isBlacklisted) {
      await interaction.reply({
        content: 'You are blacklisted from interacting with me!',
        ephemeral: true,
      });
      return;
    }

    try {
      intLog(interaction);
      await command.execute(interaction);
      return;
    } catch (err: any) {
      errLog(client, err);
      await interaction.reply({
        content: 'There was an issue while executing this modal!',
        ephemeral: true,
      });
      return;
    }
  },
};