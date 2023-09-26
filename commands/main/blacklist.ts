import { Message } from 'discord.js';
import { blacklistDB } from '../../handlers/db';

module.exports = {
  name: 'blacklist',
  description: 'Debugging command.',
  args: true,
  ownerOnly: true,

  async execute(message: Message, args: any) {
    await message.delete();
    let reason = args.slice(1).join(' ');
    await blacklistDB.create({ userID: args[0], reason: reason });
    await message.channel.send({ content: 'Blacklisted user ✅' });
  },
};