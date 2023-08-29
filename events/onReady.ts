import { EmbedBuilder, Guild, TextChannel } from "discord.js";
import { CustomClient } from "..";
import { log, errLog } from "../handlers/logger";


module.exports = {
    name: "ready",
    once: true,

    async execute(client: CustomClient) {
        const guild: Guild | undefined = client.guilds.cache.get(process.env.TEST_GUILD_ID!);
        if (!guild) return errLog(client, "Guild not found.", false);
        log.info(`${client.user?.username} Is Online`);
        var onlineTimestamp = Math.round(Date.now()*0.001);
        const restartEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('Bot Restart')
            .setDescription('Bot has Been Restarted')
            .addFields(
                 { name: 'Started', value: `<t:${onlineTimestamp}:R>` },
            //     { name: '\u200B', value: '\u200B' },
            //     { name: 'Inline field title', value: 'Some value here', inline: true },
            //     { name: 'Inline field title', value: 'Some value here', inline: true },
            )
            // .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
            .setTimestamp()
            .setFooter({ text: 'Time Restarted'});

            client.user!.setPresence({ activities: [{ name: 'Over Stuff', type:3 }], status: 'dnd' });

        (client.channels.cache.get(process.env.RESTART_ID!) as TextChannel).send({ embeds: [restartEmbed]})
    }
}