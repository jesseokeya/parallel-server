const {
    WebClient
} = require('@slack/web-api');
const {
    createEventAdapter
} = require('@slack/events-api');

class NotificationService {
    constructor(options = {}) {
        this.options = options
        const token = process.env.SLACK_TOKEN;
        this.slack = new WebClient(token);
        // Initialize using signing secret from environment variables
        const {
            createEventAdapter
        } = require('@slack/events-api');
        const slackEvents = createEventAdapter(token);
        const port = process.env.PORT || 3000;

        // Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
        slackEvents.on('message', (event) => {
            console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
        });

        // Handle errors (see `errorCodes` export)
        slackEvents.on('error', console.error);

        // Start a basic HTTP server
        slackEvents.start(port).then(() => {
            // Listening on path '/slack/events' by default
            // console.log(`Slack erver running on port ${port}`);
        });
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
            console.log({
                domain,
                otherDomain,
                otherDepth,
                similarityScore,
                depth
            })
            const channel = 'parallel'
            // Post a message to the channel, and await the result.
            // Find more arguments and details of the response: https://api.slack.com/methods/chat.postMessage
            const equalDepth = depth === otherDepth
            const text = equalDepth ?
                `${domain} and ${otherDomain} both have a depth of ${depth}` :
                `${domain} has a depth of ${depth} and ${otherDomain} has a depth of ${otherDepth}`
            await this.slack.chat.postMessage({
                channel,
                attachments: [{
                    footer: `<http://www.google.ca| Click To View Analysis> `,
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