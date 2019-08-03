var defaultTextHEOptions = {
    noHE: false,
    replace: true
};

var HoloceneParser = /** @class */ (function () {
    function HoloceneParser(text) {
        this.text = text;
    }
    HoloceneParser.prototype.textHE = function (options) {
        if (options === void 0) { options = defaultTextHEOptions; }
        if (this.text.match(/2019/)) {
            if (options) {
                if (options.noHE) {
                    return this.text.replace('2019', '12019');
                }
                if (!options.replace) {
                    return this.text.replace('2019', '2019 12019 HE');
                }
            }
            return this.text.replace('2019', '12019 HE');
        }
        return '';
    };
    return HoloceneParser;
}());


var handleNode = function (node) {
    node.childNodes.forEach(function (childNode) {
        if (childNode.nodeType === 3 && childNode.nodeValue) {
            var parser = new HoloceneParser(childNode.nodeValue);
            var textHE = parser.textHE();
            if (textHE) {
                childNode.nodeValue = textHE;
            }
            // console.log(childNode.nodeType);
            // console.log(childNode.nodeValue);
            // console.log('---');
        }
    });
};
document.querySelectorAll('body *').forEach(function (node) { return handleNode(node); });
