require('dotenv').config();
const { redis, redisKeyPrefix } = require('../../bot.js');
const Commando = require('discord.js-commando')

module.exports = class MuteCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            aliases: [],
            group: 'admin tools',
            memberName: 'mute',
            description: 'mute a user',
            argsType: 'multiple',
            argsCount: 3,
            userPermissions: ['MANAGE_ROLES'],
            ownerOnly: false,
        });
    };

    async run(message, args)
    {
        const syntax = process.env.PREFIX+'mute `user` `duration` `unit(m, h, d, or life)`';

        const duration = args[1];
        const durationType = args[2];

        if(args.length != 3)
        {
            message.reply('please use the appropriate syntax!');
            return;
        }
        
        if(isNaN(duration))
        {
            message.reply('please use the appropriate syntax!');
            return;
        }

        const durations =
        {
            m: 60,
            h: 60 * 60,
            d: 60 * 60 * 24,
            life: -1
        }

        if(!durations[durationType])
        {
            message.reply('please use the appropriate syntax!');
            return;
        }

        const seconds = duration * durations[durationType];

        const target = message.mentions.users.first();

        if(!target)
        {
            message.reply('please use the appropriate syntax!');
            return;
        }

        const role = message.guild.roles.cache.find(role => role.name === 'muted')
        if(role)
        {
            message.guild.members.cache.get(target.id).roles.add(role);
        }

        const redisClient = await redis();
        try
        {
            const redisKey = `${redisKeyPrefix}${target.id}-${message.guild.id}`;

            if(seconds > 0)
            {
                redisClient.set(redisKey, 'true', 'EX', seconds);
            }
            else
            {
                redisClient.set(redisKey, 'true');
            }

            message.reply(`muted <@${target.id}>.`);
        }
        finally
        {
            redisClient.quit()
        }
    }
};