const appRoot = require('app-root-path');
const chrome = require('selenium-webdriver/chrome');
const {
    Builder
} = require('selenium-webdriver');
const {
    ServiceBuilder
} = require('selenium-webdriver/chrome');

class ChromeDriver {
    constructor(options = {}) {
        this.options = options
        this.chromeDriverPath = process.platform === 'darwin' ? `${appRoot.path}/chromedriver` : '/usr/lib/chromium/chromedriver'

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
            await this.driver.sleep(7000)
            const snapshot = await this.driver.executeScript(this._script())
            const screenshot = await this.driver.takeScreenshot()
            return {
                snapshot,
                screenshot
            }
        } catch (err) {
            throw err
        }
    }

    async quit() {
        try {
            return this.driver.quit();
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