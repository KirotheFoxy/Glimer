// Require the necessary discord.js classes
import { Client, Collection, GatewayIntentBits, REST, Routes } from "discord.js"
import * as fs from "fs"
import log from "./handlers/logger";

export interface CustomClient extends Client {
    commands: Collection<string, any>;
    slashCommands: Collection<string, any>;
	buttonCommands: Collection<string, any>;
    cooldowns: Collection<string, any>;
};

// Create a new client instance
const client: any = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildModeration,
	GatewayIntentBits.GuildInvites,
	GatewayIntentBits.GuildVoiceStates,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.DirectMessages,
	GatewayIntentBits.MessageContent,
] });

client.commands = new Collection();
client.slashCommands = new Collection();
client.buttonCommands = new Collection();
client.cooldowns = new Collection();

// Event Handler

const eventFiles = fs
	.readdirSync("./events")
	.filter((file: any) => file.endsWith(".ts"));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	try {
		if (event.once) {
			client.once(event.name, (...args: any) => event.execute(...args, client))
		} else {
			client.on(event.name, async (...args: any) => await event.execute(...args, client))
		}
	} catch (error: any) {
		throw(error)
	}
}

// Message-Based  Command Handler

const commandFolders = fs.readdirSync("./commands");

for (const folder of commandFolders) {
	const commandFiles = fs
		.readdirSync(`./commands/${folder}`)
		.filter((file) => file.endsWith(".ts"));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

// Slash Command Handler

const slashCommands = fs.readdirSync("./interactions/slash");

for (const module of slashCommands) {
    const commandFiles = fs
        .readdirSync(`./interactions/slash/${module}`)
        .filter((file) => file.endsWith(".ts"));

    for (const commandFile of commandFiles) {
        const command = require(`./interactions/slash/${module}/${commandFile}`);
        client.slashCommands.set(command.data.name, command);
    }
}

// Button Command Handler

const buttonCommands = fs.readdirSync("./interactions/buttons");

for (const module of buttonCommands) {
    const commandFiles = fs
        .readdirSync(`./interactions/buttons/${module}`)
        .filter((file) => file.endsWith(".ts"));

    for (const commandFile of commandFiles) {
        const command = require(`./interactions/buttons/${module}/${commandFile}`);
        client.buttonCommands.set(command.id, command);
    }
}

// Command Registration

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN!);

const commandJsonData = [
    ...Array.from(client.slashCommands.values()).map((c: any) => c.data.toJSON()),
];

(async () => {
    try {
        log.info("Started refreshing application (/) commands.");

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.TEST_GUILD_ID!),
            { body: commandJsonData }
        );

        log.info("Successfully reloaded application (/) commands.");
    } catch (error: any) {
        throw(error);
    }
})();

// Log in to Discord with your client's token
client.login(process.env.TOKEN);