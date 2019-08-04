import {
    SPACE_SEPARATOR,
    WIKIPEDIA_HE_LINK,
    HE_ANCHOR,
} from '../../constants';

import {
    TIMESTAMP_LOCATION,
    BETWEEN_SIGNS,
    HE_TIMESTAMP_STYLES,
} from '../../enumerations';

import {
    IHoloceneTimestampParser,
    HoloceneTimestampParsed,
    HoloceneTimestampParserOptions,
} from '../../interfaces';

import {
    defaultTextHEOptions,
    regExpRules,
} from '../../data';



class HoloceneTimestampParser implements IHoloceneTimestampParser {
    private data: string;

    constructor(data: string) {
        this.data = data;
    }

    public text(
        options: Partial<HoloceneTimestampParserOptions> = defaultTextHEOptions
    ): HoloceneTimestampParsed {
        // console.log(options);
        let replacedString = this.data;
        const matchedYears: any[] = [];

        /**
         * this.data = 'words 2019 words 2017 words'
         *
         * split this.data at spaces, then for each word look go through each rule
         * match if match
         * replace and add to matchedYears
         */

        const splitData = this.data.split(SPACE_SEPARATOR);

        splitData.forEach((word, index) => {
            regExpRules.forEach(rule => {
                // console.log(rule);
                const firstWord = splitData[index - 1] ? splitData[index - 1] : '';
                const lastWord = splitData[index + 1] ? splitData[index + 1] : '';
                const wordWindow = firstWord
                    + SPACE_SEPARATOR
                    + word
                    + SPACE_SEPARATOR
                    + lastWord;

                console.log(wordWindow);

                const match = wordWindow.match(rule);

                console.log(match);

                if (match) {
                    // console.log(match);
                    const composedHEString = this.composeHEString(options, match);
                    const year = composedHEString.year;
                    const yearHEString = composedHEString.yearHEString;
                    // console.log(yearHEString);
                    replacedString = replacedString.replace(year, yearHEString);
                    matchedYears.push(composedHEString.year);
                }
            });
        });

        const response = {
            HE: replacedString,
            matchedYears,
        }
        return response;
    }

    private composeHEString = (
        options: Partial<HoloceneTimestampParserOptions>,
        match: RegExpMatchArray,
    ) => {
        const nameHESeparator = options.removeHE ? '' : SPACE_SEPARATOR;
        const nameHEAnchor = options.removeHE
            ? ''
            : options.linkHE
                ? HE_ANCHOR
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
