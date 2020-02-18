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
            console.log({
                domain,
                otherDomain,
                similarityScore,
                depth
            })
        } catch (err) {
            throw err
        }
    }
}

module.exports = NotificationService