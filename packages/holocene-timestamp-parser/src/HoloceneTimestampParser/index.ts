enum TIMESTAMP_LOCATION {
    BEFORE = 'BEFORE',
    AFTER = 'AFTER',
}

enum BETWEEN_SIGNS {
    BRACKETS = 'BRACKETS',
    ACCOLADES = 'ACCOLADES',
    SLASHES = 'SLASHES',
    NOTHING = 'NOTHING',
}

enum HE_TIMESTAMP_STYLES {
    REGULAR = 'REGULAR',
    ITALIC = 'ITALIC',
}

interface HoloceneParserTextHEOptions {
    insertLocation: keyof typeof TIMESTAMP_LOCATION;
    insertBetween: keyof typeof BETWEEN_SIGNS;
    styleHETimestamp: keyof typeof HE_TIMESTAMP_STYLES;
    linkHE: boolean;
    removeHE: boolean;
    replaceTimestamp: boolean;
}

const defaultTextHEOptions: HoloceneParserTextHEOptions = {
    insertLocation: TIMESTAMP_LOCATION.AFTER,
    insertBetween: BETWEEN_SIGNS.BRACKETS,
    styleHETimestamp: HE_TIMESTAMP_STYLES.REGULAR,
    linkHE: true,
    removeHE: false,
    replaceTimestamp: true,
};



class HoloceneParser {
    private text: string;

    constructor(text: string) {
        this.text = text;
    }

    public textHE(options: Partial<HoloceneParserTextHEOptions> = defaultTextHEOptions) {
        if (this.text.match(/2019/)) {
            if (options) {
                if (options.removeHE) {
                    return this.text.replace('2019', '12019');
                }

                if (!options.replaceTimestamp) {
                    return this.text.replace('2019', '2019 12019 HE');
                }
            }

            return this.text.replace('2019', '12019 HE');
        }
        return '';
    }
}


export default HoloceneParser;
