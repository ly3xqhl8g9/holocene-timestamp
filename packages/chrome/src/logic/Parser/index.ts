interface HoloceneParserTextHEOptions {
    noHE?: boolean;
    replace?: boolean;
}


const defaultTextHEOptions = {
    noHE: false,
    replace: true,
}


class HoloceneParser {
    private text: string;

    constructor(text: string) {
        this.text = text;
    }

    public textHE(options: HoloceneParserTextHEOptions = defaultTextHEOptions) {
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
    }
}


export default HoloceneParser;
