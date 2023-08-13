import { EmbedBuilder, TextChannel } from "discord.js";
import { CustomClient } from "..";

module.exports = {
    name: "ready",
    once: true,

    async execute(client: CustomClient) {
        console.log(`${client.user?.username} Is Online`);
        const restartEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Bot Restart')
            .setAuthor({ name: 'Kail Bot', iconURL: 'https://cdn.discordapp.com/avatars/1112284541483229214/e5c466b23cfe0381bf4a04e712638fe0.webp?size=2048'})
            .setDescription('Bot has Been Restarted')
            // .addFields(
            //     { name: 'Regular field title', value: 'Some value here' },
            //     { name: '\u200B', value: '\u200B' },
            //     { name: 'Inline field title', value: 'Some value here', inline: true },
            //     { name: 'Inline field title', value: 'Some value here', inline: true },
            // )
            // .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
            .setTimestamp()
            .setFooter({ text: 'Time Restarted'});

            client.user!.setPresence({ activities: [{ name: 'Over Stuff', type:3 }], status: 'dnd' });

        (client.channels.cache.get(process.env.RESTART_ID!) as TextChannel).send({ embeds: [restartEmbed]})
    }
}