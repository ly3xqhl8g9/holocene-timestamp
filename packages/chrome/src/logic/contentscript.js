"use strict";
var HoloceneParser = /** @class */ (function () {
    function HoloceneParser(text) {
        this.text = text;
    }
    HoloceneParser.prototype.textHE = function () {
        if (this.text.match(/2019/)) {
            return this.text.replace('2019', '12019 HE');
        }
        return '';
    };
    return HoloceneParser;
}());


document.querySelectorAll('body *').forEach(function(node) {
    node.childNodes.forEach(function(childNode) {
        if (childNode.nodeType === 3) {
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
});
