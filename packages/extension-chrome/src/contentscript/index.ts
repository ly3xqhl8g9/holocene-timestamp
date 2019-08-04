import HoloceneTimestampParser, {
    HoloceneTimestampParserOptions,
} from 'holocene-timestamp-parser';



const handleNode = (node: Element) => {
    node.childNodes.forEach((childNode) => {
        if (childNode.nodeType === 3 && childNode.nodeValue) {
            const parser = new HoloceneTimestampParser(childNode.nodeValue);
            const options: HoloceneTimestampParserOptions = {
                insertBetween: 'NOTHING',
                insertLocation: 'AFTER',
                styleHETimestamp: 'REGULAR',
                linkHE: false,
                removeHE: false,
                replaceTimestamp: true,
            }
            const text = parser.text(options);
            if (text.HE) {
                console.log('text.HE', text.HE);
                childNode.nodeValue = text.HE;
            }
            // console.log(childNode.nodeType);
            // console.log(childNode.nodeValue);
            // console.log('---');
        }
    });
}


document.querySelectorAll('body *').forEach((node) => handleNode(node));
