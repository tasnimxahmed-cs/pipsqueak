const Commando = require('discord.js-commando')

module.exports = class PollCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'poll',
            aliases: [],
            group: 'admin tools',
            memberName: 'poll',
            description: 'cast a poll',
            argsType: 'multiple',
            userPermissions: ['ADMINISTRATOR'],
            ownerOnly: false,
        });
    };

    async run(message, args)
    {
        var ques = '';
        var comp = false;
        var opt = [];
        var optStr = '';
        console.log(args);

        if(args.length < 2 || !args.includes('-o'))
        {
            message.reply('please use the appropriate arguments!');
            return;
        }
        
        for(var i=0;i<args.length;i++)
        {
            if(args[i] === '-o')
            {
                if(comp)
                {
                    optStr = optStr.substring(1);
                    opt.push(optStr);
                    optStr = '';
                }
                else
                {
                    ques = ques.substring(1);
                    ques += '?';
                    comp = true;
                }
            }
            else
            {
                if(comp)
                {
                    optStr += ' '+args[i];
                    if(i == args.length-1) opt.push(optStr);
                }
                else
                {
                    ques += ' '+args[i];
                }
            }
        }

        var allEmojis =
        [
            '⚪', '⚫', '🔴', '🔵', '🟠', '🟡', '🟢', '🟣', '🟤', '⬛', '⬜', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫'
        ];
        var randEmojis = [];

        if(opt.length > 18)
        {
            message.channel.send('Please give less than 18 options!');
            return;
        }

        for(i=0;i<opt.length;i++)
        {
            var randEmoji = allEmojis[Math.floor(Math.random() * allEmojis.length)];
            while(randEmojis.includes(randEmoji))
            {
                randEmoji = allEmojis[Math.floor(Math.random() * allEmojis.length)];
            }
            randEmojis.push(randEmoji);
        }

        var poll = '**' +ques + '**' + '\n\n';
        for(i=0;i<opt.length;i++)
        {
            poll += randEmojis[i] + ': ' + opt[i];
            if(i!=opt.length-1) poll+='\n';
        }

        message.delete();

        message.channel.send(poll).then( (message) => {
            for(i=0;i<opt.length;i++)
            {
                message.react(randEmojis[i]);
            }
        });
    }
};