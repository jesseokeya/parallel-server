const {
    isEmpty
} = require('lodash')
const {
    WebClient
} = require('@slack/web-api');

class NotificationService {
    constructor(options = {}) {
        this.options = options
        const token = process.env.SLACK_TOKEN;
        this.slack = new WebClient(token);
    }

    async slackNotify(context) {
        try {
            const {
                domain,
                otherDomain,
                similarityScore,
                depth
            } = context
            console.log({
                domain,
                otherDomain,
                similarityScore,
                depth
            })
            const channel = 'parallel'
            // Post a message to the channel, and await the result.
            // Find more arguments and details of the response: https://api.slack.com/methods/chat.postMessage
            const result = await this.slack.chat.postMessage({

                channel,
                attachments: [{
                    // footer: '<https://icanhazdadjoke.com/j/08EQZ8EQukb|permalink> - <https://icanhazdadjoke.com|icanhazdadjoke.com>',
                    text: `Parallel found a ${similarityScore}% match  between http://${domain}/ and http://${otherDomain}/`,
                    title: 'Similar domains found',
                    color: 'good',
                    image_url: 'https://image.flaticon.com/icons/svg/2535/2535501.svg'
                }],
                response_type: 'in_channel'
            });

        } catch (err) {
            throw err
        }
    }
}

module.exports = NotificationService