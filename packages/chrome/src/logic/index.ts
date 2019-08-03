document.querySelectorAll('body *').forEach((node) => {
    node.childNodes.forEach((childNode) => {
        // console.log(childNode.nodeType);
        // console.log(childNode.nodeValue);
        // console.log('---');
        if (childNode.nodeValue && childNode.nodeValue.match(/2019/)) {
            childNode.nodeValue = childNode.nodeValue.replace('2019', '12019 HE');
        }
    });
});
