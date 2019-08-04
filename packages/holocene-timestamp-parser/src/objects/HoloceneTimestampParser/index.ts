import {
    SPACE_SEPARATOR,
    WIKIPEDIA_HE_LINK,
} from '../../constants';

import {
    TIMESTAMP_LOCATION,
    BETWEEN_SIGNS,
    HE_TIMESTAMP_STYLES,
} from '../../enumerations';

import {
    HoloceneTimestampParserOptions,
} from '../../interfaces';

import {
    defaultTextHEOptions,
    regExpRules,
} from '../../data';



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
        let yearHEString;

        regExpRules.forEach(rule => {
            // console.log(rule);
            const match = this.text.match(rule);

            if (match) {
                // console.log(match);
                const composedHEString = this.composeHEString(options, match);
                year = composedHEString.year;
                yearHEString = composedHEString.yearHEString;
                // console.log(yearHEString);
            }
        });

        if (year && yearHEString) {
            return this.text.replace(year, yearHEString);
        }

        return '';
    }

    private composeHEString = (
        options: Partial<HoloceneTimestampParserOptions>,
        match: RegExpMatchArray,
    ) => {
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

        const year = match[1];
        const yearString = options.replaceTimestamp ? '' : year;

        const yearHE = parseInt(year) + 10000;
        const yearHEStringUnlocated = styleHETimestampStart + betweenStart + yearHE + nameHE + betweendEnd + styleHETimestampEnd;

        const locatedSpaceSperator = yearString ? SPACE_SEPARATOR : '';
        const yearHELocated = options.insertLocation === TIMESTAMP_LOCATION.AFTER
            ? yearString + locatedSpaceSperator + yearHEStringUnlocated
            : yearHEStringUnlocated + locatedSpaceSperator + yearString;

        const yearHEString = yearHELocated;

        return {
            year,
            yearHE,
            yearHEString,
        }
    }
}


export default HoloceneTimestampParser;
