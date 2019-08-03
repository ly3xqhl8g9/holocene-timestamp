export enum TIMESTAMP_LOCATION {
    BEFORE = 'BEFORE',
    AFTER = 'AFTER',
}

export enum BETWEEN_SIGNS {
    BRACKETS = 'BRACKETS',
    ACCOLADES = 'ACCOLADES',
    SLASHES = 'SLASHES',
    NOTHING = 'NOTHING',
}

export enum HE_TIMESTAMP_STYLES {
    REGULAR = 'REGULAR',
    ITALIC = 'ITALIC',
}

const SPACE_SEPARATOR = ' ';
const WIKIPEDIA_HE_LINK = 'https://en.wikipedia.org/wiki/Holocene_calendar';


export interface HoloceneTimestampParserOptions {
    insertLocation: keyof typeof TIMESTAMP_LOCATION;
    insertBetween: keyof typeof BETWEEN_SIGNS;
    styleHETimestamp: keyof typeof HE_TIMESTAMP_STYLES;
    linkHE: boolean;
    removeHE: boolean;
    replaceTimestamp: boolean;
}

const defaultTextHEOptions: HoloceneTimestampParserOptions = {
    insertLocation: TIMESTAMP_LOCATION.AFTER,
    insertBetween: BETWEEN_SIGNS.NOTHING,
    styleHETimestamp: HE_TIMESTAMP_STYLES.REGULAR,
    linkHE: false,
    removeHE: false,
    replaceTimestamp: true,
};

const regexp = [
    '\\s(\\d{4})\\s',
    '\\s(\\d{3})\\s',
];



class HoloceneTimestampParser {
    private text: string;

    constructor(text: string) {
        this.text = text;
    }

    public textHE(
        options: Partial<HoloceneTimestampParserOptions> = defaultTextHEOptions
    ): string {
        // console.log(options);
        let year;
        let yearHE;
        let yearHEString;

        regexp.forEach(rule => {
            // console.log(rule);
            const match = this.text.match(rule);

            if (match) {
                // console.log(match);
                const nameHESeparator = options.removeHE ? '' : SPACE_SEPARATOR;
                const nameHEAnchor = options.removeHE
                    ? ''
                    : options.linkHE
                        ? `<a href=${WIKIPEDIA_HE_LINK}>HE</a>`
                        : 'HE';
                const nameHE = nameHESeparator + nameHEAnchor;

                let betweenStart = '';
                let betweendEnd = '';
                switch(options.insertBetween) {
                    case BETWEEN_SIGNS.BRACKETS:
                        betweenStart = '[';
                        betweendEnd = ']';
                        break;
                    case BETWEEN_SIGNS.ACCOLADES:
                        betweenStart = '{';
                        betweendEnd = '}';
                        break;
                    case BETWEEN_SIGNS.SLASHES:
                        betweenStart = '/';
                        betweendEnd = '/';
                        break;
                    default:
                        betweenStart = '';
                        betweendEnd = '';
                }

                const styleHETimestampStart = options.styleHETimestamp === HE_TIMESTAMP_STYLES.ITALIC
                    ? '<i>'
                    : '';
                const styleHETimestampEnd = options.styleHETimestamp === HE_TIMESTAMP_STYLES.ITALIC
                    ? '<i>'
                    : '';

                year = match[1];
                const yearString = options.replaceTimestamp ? '' : year;

                yearHE = parseInt(year) + 10000;
                const yearHEStringUnlocated = styleHETimestampStart + betweenStart + yearHE + nameHE + betweendEnd + styleHETimestampEnd;

                const locatedSpaceSperator = yearString ? SPACE_SEPARATOR : '';
                const yearHELocated = options.insertLocation === TIMESTAMP_LOCATION.AFTER
                    ? yearString + locatedSpaceSperator + yearHEStringUnlocated
                    : yearHEStringUnlocated + locatedSpaceSperator + yearString;

                yearHEString = yearHELocated;
                // console.log(yearHEString);
            }
        });

        if (year && yearHEString) {
            return this.text.replace(year, yearHEString);
        }

        return '';
    }
}


export default HoloceneTimestampParser;
