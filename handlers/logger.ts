import * as fs from 'fs';
import winston from "winston";
import 'winston-daily-rotate-file';
import { CustomClient } from "../index";
import { AttachmentBuilder, ChatInputCommandInteraction, ContextMenuCommandInteraction, EmbedBuilder, Interaction, TextChannel } from 'discord.js';

const config = {
    levels: {
        error: 0,
        debug: 1,
        warn: 2,
        data: 3,
        info: 4,
        verbose: 5,
        silly: 6
    }
};

const { combine, timestamp, printf, colorize, json } = winston.format;

const consoleTransport = new winston.transports.Console({
    level: process.env.LOGLEVEL || 'info',
    format: combine(
        winston.format(info => {
            info.level = info.level.toUpperCase()
            return info;
        })(),
        timestamp({
          format: 'MM-DD-YYYY hh:mm:ss.SSS A',
        }),
        colorize({ all: true }),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
      ),
});

const fileRotateTransportCombined = new winston.transports.DailyRotateFile({
    level: 'silly',
    filename: './logs/combined-%DATE%.log',
    datePattern: 'MM-DD-YYYY',
    maxFiles: '14d',
    format: combine(
        timestamp(),
        json()
    )
});

const fileRotateTransportWarn = new winston.transports.DailyRotateFile({
    level: 'warn',
    filename: './logs/warn-%DATE%.log',
    datePattern: 'MM-DD-YYYY',
    maxFiles: '14d',
    format: combine(
        timestamp(),
        json()
    )
});

export const log = winston.createLogger({
    level: 'silly',
    levels: config.levels,
    transports: [consoleTransport, fileRotateTransportCombined, fileRotateTransportWarn],
});
export default log;


export async function errLog(client: CustomClient, error: string, recoverable = true) {
    log.error(error);
    let msgContent = 'Hey ya broke something.'
    function toBig(error: string) {
        if (error.length > 1000) {
            return true;
        } else {
            return false;
        };
    }
    if (toBig(error)) {
        fs.writeFile('./error.txt', error, (error) => {
            if (error) {log.error(error)};
        });
        const errorLog = new AttachmentBuilder('./error.txt', {name: 'error.txt'});
        await client.users.send(process.env.OWNER!, {content: msgContent, files: [errorLog]});
        return;
    } else {
        await client.users.send(process.env.OWNER!, {content: msgContent + '\n```js\n' + error + '\n```'});
    };
    if (!recoverable) {
        await client.users.send(process.env.OWNER!, {content: '***Nonrecoverable***'});
        process.exit(1);
    };
    return;
};

function logEmbed(title: string, interaction: Interaction, cmdName: string, data?: any) {
    const embed = new EmbedBuilder()
        .setTitle(`Executed By`)
        .setDescription(`<@${interaction.user.id}>`)
        .setColor('#00ff00')
        .setAuthor({ name: `${title} - ${cmdName}`, iconURL: interaction.user.avatarURL() || undefined})
        .setFooter({ text: `User ID: ${interaction.user.id}`})
        .setTimestamp();
    if (!data) return embed;

    if (data.length > 0) {
        embed.addFields({name: 'Options', value: ' ', inline: false});
        for (let index = 0; index < data.length; index++) {
            switch (data[index].type) {
                case 3: // string
                    if (data[index].value.length > 1000) {
                        embed.addFields({name: data[index].name, value: 'Too big to display', inline: true});
                        break;
                    } else {
                        embed.addFields({name: data[index].name, value: '`' + data[index].value + '`', inline: true});
                        break;
                    };
                case 6: // user
                    embed.addFields({name: "User", value: `<@${data[index].value}>`, inline: true});
                    break;
                case 8: // role
                    embed.addFields({name: "Role", value: `<@&${data[index].value}>`, inline: true});
                    break;
                case 7: // channel
                    embed.addFields({name: "Channel", value: `<#${data[index].value}>`, inline: true});
                    break;
                default:
                    embed.addFields({ name: data[index].name, value: data[index].value.toString(), inline: true });
                    break;
            };
        };
    };

    return embed;
};

export async function intLog(interaction: Interaction) {
    const { user, client } = interaction;
    let intType: string;
    let cmdName: string;
    let data = [];
    let consoleData = [];
    if (interaction.isChatInputCommand()) {intType = 'Slash Command'; cmdName = interaction.commandName;
        if (interaction.options.getSubcommand(false)) {
            data.push({name: 'Sub Command', value: interaction.options.getSubcommand(false), type: null});
            consoleData.push(`subcommand - ${interaction.options.getSubcommand(false)}`);
        };
    };
    if (interaction.isAnySelectMenu()) {intType = 'Select Menu'; cmdName = interaction.customId};
    if (interaction.isModalSubmit()) {intType = 'Modal'; cmdName = interaction.customId};
    if (interaction.isButton()) {intType = 'Button'; cmdName = interaction.customId};
    if (interaction.isUserContextMenuCommand()) {intType = 'Context (User)'; cmdName = interaction.commandName};
    if (interaction.isMessageContextMenuCommand()) {intType = 'context (Message)'; cmdName = interaction.commandName}; 

    // Suppression
    let suppressedInteractions: Array<string> = ["refreshMcStatus"];
    if (suppressedInteractions.includes(cmdName!)) return;

    // Normal Logging
    switch (intType!) {
        case 'Slash Command':
            let slashInteraction = interaction as ChatInputCommandInteraction;
            if (slashInteraction.options.data.length > 0) {
                let intOptions = slashInteraction.options.data;
                if (slashInteraction.options.data[0].type === 1) {
                    intOptions = slashInteraction.options.data[0].options ?? [];
                };
                for (let index = 0; index < intOptions.length; index++) {
                    if (intOptions[index].value!.toString().length > 1000) {
                        data.push({name: intOptions[index].name, value: 'Too big to display', type: null});
                        consoleData.push(`${intOptions[index].name} - Too big to display`);
                        continue;
                    } else {
                        data.push({name: intOptions[index].name, value: intOptions[index].value, type: intOptions[index].type});
                        consoleData.push(`${intOptions[index].name} - ${intOptions[index].value}`);
                    };
                };

                (client.channels.cache.get(process.env.COMMAND_LOGS!) as TextChannel).send({ embeds: [logEmbed('Slash Command', interaction, cmdName!, data)] });
                log.verbose(`${intType} | ${cmdName!} | Called by ${user.username}`, data);
            } else {
                log.verbose(`${intType} | ${cmdName!} | Called by ${user.username}`);
            };
            break;
        case 'Context (User)':
            let contextInteraction = interaction as ContextMenuCommandInteraction;
            data.push({name: 'User', value: contextInteraction.targetId, type: 6});

            (client.channels.cache.get(process.env.COMMAND_LOGS!) as TextChannel).send({ embeds: [logEmbed('Context (User)', interaction, cmdName!, data)] });
            log.verbose(`${intType!} | ${cmdName!} | Called by ${user.username} | Ran on ${user.username}`);
            break;
        default:
            (client.channels.cache.get(process.env.COMMAND_LOGS!) as TextChannel).send({ embeds: [logEmbed(intType!, interaction, cmdName!)] });
            log.verbose(`${intType!} | ${cmdName!} | Called by ${user.username}`);
            break;
    };
    return;
};