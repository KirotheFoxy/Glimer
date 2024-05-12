import { Message } from 'discord.js';

module.exports = {
  name: 'ssu',
  description: 'Debugging command.',
  ownerOnly: true,

  async execute(message: Message) {
    await message.delete();

    await message.channel.send(`<@&1073419405930799162> Please start an SSU`);
  },
};