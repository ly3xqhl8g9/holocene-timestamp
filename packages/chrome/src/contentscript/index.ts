import HoloceneParser from './Parser';



const handleNode = (node: Element) => {
    node.childNodes.forEach((childNode) => {
        if (childNode.nodeType === 3 && childNode.nodeValue) {
            const parser = new HoloceneParser(childNode.nodeValue);
            const textHE = parser.textHE();
            if (textHE) {
                childNode.nodeValue = textHE;
            }
            // console.log(childNode.nodeType);
            // console.log(childNode.nodeValue);
            // console.log('---');
        }
    });
}


document.querySelectorAll('body *').forEach((node) => handleNode(node));
