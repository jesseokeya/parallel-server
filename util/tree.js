/**
 * Finds the depth of an n-ary tree with multiple children
 * @param {Object} node - root node of tree
 * @throws {Error} if exception occurs at runtime
 * @returns {number} depth of tree
 * @example
 * const depth = depthOfTree(node)
 */
const depthOfTree = (node) => {
    try {
        let maxDepth = 0
        if (!node) return maxDepth
        for (const child of node.children) {
            maxDepth = Math.max(maxDepth, depthOfTree(child))
        }
        return maxDepth + 1
    } catch (err) {
        throw err
    }
}

/**
 * Recursive function that checks 2 tree nodes are identical or not
 * @param {Object} firstNode - root node of first tree
 * @param {Object} secondNode - root node of second tree
 * @throws {Error} if exception occurs at runtime
 * @returns {Boolean} if trees are identical or not
 * @example
 * const isIdentical = identicalTrees(firstNode, secondNode)
 */
const identicalTrees = (firstNode, secondNode) => {
    try {
        let result = true
        if (!firstNode && !secondNode) return true
        if (!firstNode || !secondNode) return false
        const firstNodeChildren = firstNode.children
        const secondNodeChildren = secondNode.children
        if (!firstNodeChildren || !secondNodeChildren) return false
        const firstNodeLength = firstNodeChildren.length
        const secondNodeLength = secondNodeChildren.length
        if (firstNodeLength !== secondNodeLength) return false
        const length = Math.max(firstNodeLength, secondNodeLength)
        for (let i = 0; i < length; i++) {
            result = result && firstNode.name === secondNode.name && identicalTrees(firstNodeChildren[i], secondNodeChildren[i])
        }
        return result
    } catch (err) {
        throw err
    }
}

/**
 * Generates percentage similarity score based on certian variables
 * @param {number} totalMatches - number of nodes that are similar in 2 trees
 * @param {Object} numberOfNodes - sum of the total number of nodes in the 2 trees
 * @throws {Error} if exception occurs at runtime
 * @returns {number} percentage similarity score 
 * @example
 * const percentage = generateSimilarityScore(totalMatches, numberOfNodes, isIdentical)
 */
const generateSimilarityScore = (totalMatches, numberOfNodes, isIdentical) => {
    try {
        if (numberOfNodes <= 0) return 0
        const result = Math.floor(((totalMatches * 2) / numberOfNodes) * 100)
        if ((result >= 100 && isIdentical) || isIdentical) return 100
        return result
    } catch (err) {
        throw err
    }
}

/**
 * Counts number of nodes in tree
 * @param {node} root - root node
 * @returns {number} number of nodes in tree
 * @example
 * const numberOfNodes = countNode(root)
 */
const countNode = (root) => {
    let count = 1
    if (!root) return 0
    if (root && !root.children) return count
    for (const child of root.children) {
        count += countNode(child)
    }
    return count
}

/**
 * Counts total number of nodes in 2 trees
 * @param {node} firstNode - root node of first tree
 * @param {node} secondNode - root node of second tree
 * @returns {number} number of nodes in tree
 * @example
 * const totalNumberOfNodes = countNodes(firstNode, secondNode)
 */
const countNodes = (firstNode, secondNode) => {
    if (!firstNode && !secondNode) return 0
    if (firstNode && !secondNode) return countNode(firstNode)
    if (!firstNode && secondNode) return countNode(secondNode)
    return countNode(firstNode) + countNode(secondNode)
}

/**
 * Checks if an object is undefined, null or empty
 * @param {Object} obj - object to check
 * @returns {Boolean} if object is empty or not
 * @example
 * const totalNumberOfNodes = countNodes(firstNode, secondNode)
 */
const isEmpty = (obj) => Object.entries(obj).length === 0 && obj.constructor === Object

/**
 * Compares 2 object and check if they have exactly the same key value pairs
 * @param {Object} first - first object to check
 * @param {Object} second - second object to check
 * @returns {Boolean} if object key value pairs are similar or not
 * @example
 * const isSimilar = hasSimilarAttributes(first, second)
 */
const hasSimilarAttributes = (first, second) => {
    let result = true,
        countSimilar = 0
    if (isEmpty(first) || isEmpty(second)) return false
    for (const attr in first) {
        result = result && second.hasOwnProperty(attr) && second[attr] === first[attr]
        if (result) countSimilar++
    }
    if (countSimilar > Object.keys(first).length / 2) return true
    return result
}

/**
 * Compares one node to an entire tree counting the number of similarities
 * @param {Object} comparator - single node used to comapare with the entire tree
 * @param {Object} secondNode - root node of the tree to be compared
 * @returns {number} number of matches found
 * @example
 * const matches = countSimilarNodes(comparator, secondNode)
 */
const countSimilarNodes = (comparator, secondNode) => {
    let counter = 0
    const arr = [secondNode]
    while (arr.length > 0) {
        const node = arr.shift()
        if (node && node.children) arr.push(...node.children)
        if (comparator.name === secondNode.name && hasSimilarAttributes(secondNode.attributes, comparator.attributes)) counter++
    }
    return counter
}

/**
 * Compares two trees and returns a percentage similarity score
 * @param {Object} firstNode - root of the first tree to be compared and analyzed
 * @param {Object} secondNode - root of the second tree to be compared and analyzed
 * @param {Boolean} isIdentical - boolean that signifies if the trees have similar structure
 * @returns {number} percentage similarity score
 * @throws {Error} if exception occurs at runtime
 * @example
 * const score = compareTrees(firstNode, secondNode, isIdentical)
 */
compareTrees = (firstNode, secondNode, isIdentical) => {
    try {
        let totalMatches = 0
        const arr = [firstNode]
        while (arr.length > 0) {
            const node = arr.shift()
            if (node && node.children) arr.push(...node.children)
            totalMatches += countSimilarNodes(node, secondNode)
        }
        return generateSimilarityScore(totalMatches, countNodes(firstNode, secondNode), isIdentical)
    } catch (err) {
        throw err
    }
}

const getAttributes = attributes => {
    const results = {}
    if (!attributes) return results
    for (const key in attributes) {
        results[key] = attributes[key]
    }
    return results
}

const extractContext = children => {
    const results = []
    if (children && children.length > 0) {
        for (const child of children) {
            const invalid = ['script', 'noscript', 'meta', 'style', 'link']
            const name = child.name
            if (!invalid.includes(name) && child.type !== 'text' && name) {
                results.push({
                    name,
                    attributes: getAttributes(child.attribs),
                    children: [...extractContext(child.children)]
                })
            }
        }
    }
    return results
}

const inOrderTraversal = root => {
    if (!root) throw new Error('root node cannot be null. it is required for traversal')
    const node = root[0]
    const results = {
        name: node.name,
        attributes: getAttributes(node.attribs),
        children: [...extractContext(node.children)]
    }
    return results
}

module.exports = {
    depthOfTree,
    identicalTrees,
    compareTrees,
    isEmpty,
    inOrderTraversal
}