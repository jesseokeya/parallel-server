const appRoot = require('app-root-path');
const chrome = require('selenium-webdriver/chrome');
const {
    Builder,
    By,
    Key,
    until
} = require('selenium-webdriver');
const {
    ServiceBuilder
} = require('selenium-webdriver/chrome');

class ChromeDriver {
    constructor(options = {}) {
        this.options = options
        this.chromeDriverPath = `${appRoot.path}/chromedriver` 
        this.serviceBuilder = new ServiceBuilder(this.chromeDriverPath);
        const chromeOptions = new chrome.Options().addArguments('no-sandbox', 'headless', 'disable-gpu')
        this.driver = new Builder().forBrowser('chrome')
        .setChromeService(this.serviceBuilder)
        .setChromeOptions(chromeOptions)
        .build()
    }

    async snapshot(url) {
        try {
            await this.driver.get(url);
            const snapshot = await this.driver.executeScript(this._script())
            return snapshot
        } catch (err) {
            throw err
        }
    }

    _script() {
        try {
            return `
                const getAttributes = attributes => {
                    const results = {}
                    if (!attributes) return results
                    for (let i = 0; i < attributes.length; i++) {
                        const attribute = attributes[i]
                        results[attribute.name] = attribute.value
                    }
                    return results
                }
                const extractContext = (children) => {
                    const results = []
                    if (children && children.length > 0) {
                        for (const child of children) {
                            const invalid = ['script', 'noscript', 'meta', 'style']
                            const localName = child.localName
                            if (!invalid.includes(localName)) {
                                results.push({
                                    localName,
                                    attributes: getAttributes(child.attributes),
                                    children: [...extractContext(child.children)]
                                })
                            }
                        }
                    }
                    return results
                }
                const inOrderTraversal = root => {
                    const results = {
                        localName: root.localName,
                        attributes: getAttributes(root.attributes),
                        children: [...extractContext(root.children)]
                    }
                    return results
                }
                return {
                    snapshot: inOrderTraversal(document.querySelector('body')),
                    title: document.title,
                    currentUrl: window.location.href
                }`
        } catch (err) {
            throw err
        }
    }
}

module.exports = ChromeDriver