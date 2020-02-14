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

module.exports = {
    depthOfTree,
    identicalTrees
}