var ast = require("./ast");

exports.freshElement = ast.freshElement;
exports.nonFreshElement = ast.nonFreshElement;
exports.elementWithTag = ast.elementWithTag;
exports.text = ast.text;
exports.forceWrite = ast.forceWrite;

exports.simplify = require("./simplify");

function generateNodeId(id) {
    var idName = 'ingestion-' + id;
    return idName;
}

function write(writer, nodes, id) {
    var startId = 0;
    if (id) {
        startId = id;
    }
    nodes.forEach(function(node) {
        startId = startId + 1;
        var lastId = writeNode(writer, node, startId);
        startId = lastId;
    });
    return startId;
}

function writeNode(writer, node, id) {
    var startId = id;
    var lastId = toStrings[node.type](writer, node, id);
    if (lastId) {
        startId = lastId;
    }
    return startId;
}

var toStrings = {
    element: generateElementString,
    text: generateTextString,
    forceWrite: function() { }
};

// function randomId() {
//     const uuidv1 = require('uuid/v1');
//     return uuidv1();
// }

function addId(attributes, id) {
    const nodeId = generateNodeId(id);
    if (attributes) {
        if (attributes.id
            && attributes.id.includes("Toc")) {
            // Do nothing
        } else {
            attributes.id = nodeId;
        }
    } else {
        return {id: nodeId};
    }
    return attributes;
}

function generateElementString(writer, node, id) {
    var lastId = id;
    if (ast.isVoidElement(node)) {
        writer.selfClosing(node.tag.tagName, node.tag.attributes);
    } else {
        const attributes = addId(node.tag.attributes, id);
        writer.open(node.tag.tagName, attributes);
        lastId = write(writer, node.children, id);
        writer.close(node.tag.tagName);
    }
    return lastId;
}

function generateTextString(writer, node) {
    writer.text(node.value);
}

exports.write = write;
