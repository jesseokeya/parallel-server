class NotificationService {
    constructor(options = {}) {
        this.options = options
    }

    async slack(context) {
        try {
            const {
                domain,
                otherDomain,
                similarityScore,
                depth
            } = context
            console.log(`${domain} and ${otherDomain} has a ${similarityScore}% match`)
            console.log({
                domain,
                comparison,
                similarityScore,
                depth
            })
        } catch (err) {
            throw err
        }
    }
}

module.exports = NotificationService