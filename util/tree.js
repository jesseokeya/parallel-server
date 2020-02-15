const depthOfTree = (node) => {
    let maxDepth = 0
    if (!node) return maxDepth
    for (const child of node.children) {
        maxDepth = Math.max(maxDepth, depthOfTree(child))
    }
    return maxDepth + 1
}

identicalTrees = (firstNode, secondNode) => {
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
        result = result && firstNode.localName === secondNode.localName && identicalTrees(firstNodeChildren[i], secondNodeChildren[i])
    }
    return result
}

const generateSimilarityScore = (totalMatches, numberOfNodes, isIdentical) => {
    if (numberOfNodes <= 0) return 0
    if (totalMatches * 2 > numberOfNodes) return Math.floor(((numberOfNodes) / totalMatches * 2) * 100)
    const result = Math.floor(((totalMatches * 2) / numberOfNodes) * 100)
    if (result > 100 && isIdentical || isIdentical) return 100
    return result
}

const countNode = (root) => {
    let count = 1
    if (!root) return 0
    if (root && !root.children) return count
    for (const child of root.children) {
        count += countNode(child)
    }
    return count
}

const countNodes = (firstNode, secondNode) => {
    if (!firstNode && !secondNode) return 0
    if (firstNode && !secondNode) return countNode(firstNode)
    if (!firstNode && secondNode) return countNode(secondNode)
    return countNode(firstNode) + countNode(secondNode)
}

const isEmpty = (obj) => Object.entries(obj).length === 0 && obj.constructor === Object

const hasSimilarAttributes = (first, second) => {
    let result = true
    for (const attr in first) {
        result = result && second.hasOwnProperty(attr) && second[attr] === first[attr]
    }
    return result
}

const countSimilarNodes = (comparator, secondNode) => {
    let counter = 0
    const arr = [secondNode]
    while (arr.length > 0) {
        const node = arr.shift()
        if (node && node.children) arr.push(...node.children)
        if (comparator.localName === secondNode.localName && hasSimilarAttributes(secondNode.attributes, comparator.attributes)) counter++
    }
    return counter
}

compareTrees = (firstNode, secondNode, isIdentical) => {
    let totalMatches = 0
    const arr = [firstNode]
    while (arr.length > 0) {
        const node = arr.shift()
        if (node && node.children) arr.push(...node.children)
        totalMatches += countSimilarNodes(node, secondNode)
    }
    return generateSimilarityScore(totalMatches, countNodes(firstNode, secondNode), isIdentical)
}

module.exports = {
    depthOfTree,
    identicalTrees,
    compareTrees
}