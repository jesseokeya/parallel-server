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
                otherDepth,
                similarityScore,
                depth,
            } = context
            const channel = process.env.SLACK_CHANNEL
            // Post a message to the channel, and await the result.
            // Find more arguments and details of the response: https://api.slack.com/methods/chat.postMessage
            const equalDepth = depth === otherDepth
            const text = equalDepth ?
                `${domain} and ${otherDomain} both have a depth of ${depth}` :
                `${domain} has a depth of ${depth} and ${otherDomain} has a depth of ${otherDepth}`
            await this.slack.chat.postMessage({
                channel,
                attachments: [{
                    footer: `<https://irdeto-parallel.herokuapp.com/?domain=${domain}&otherDomain=${otherDomain}| Click To View Analysis> `,
                    text,
                    title: `Parallel found ${similarityScore}% match between ${domain} and ${otherDomain} please verify`,
                    color: 'warning'
                }],
                response_type: 'in_channel'
            });

        } catch (err) {
            throw err
        }
    }
}

module.exports = NotificationService