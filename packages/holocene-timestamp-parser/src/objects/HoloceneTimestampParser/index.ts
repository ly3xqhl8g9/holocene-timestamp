import {
    HE_TIMEBASE,
    SPACE_SEPARATOR,
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
    HoloceneYear,
    GregorianYear,
} from '../../interfaces';

import {
    defaultParserOptions,
    regExpRules,
} from '../../data';



class HoloceneTimestampParser implements IHoloceneTimestampParser {
    private data: string;

    constructor(data: string) {
        this.data = data;
    }

    public text(
        options: Partial<HoloceneTimestampParserOptions> = defaultParserOptions
    ): HoloceneTimestampParsed {
        // console.log(options);
        let HEString = this.data;
        const matchedYears: Set<number> = new Set();
        const textAdditions = this.computeAdditions(options);
        const tokenize = this.data.split(SPACE_SEPARATOR);

        tokenize.forEach((word, index) => {
            const checkedYear = this.checkYear(word, index, tokenize);
            console.log(checkedYear);

            if (checkedYear && !matchedYears.has(checkedYear.value)) {
                const {
                    year,
                    yearHEString,
                } = this.composeHEString(checkedYear, options, textAdditions);
                const yearRE = new RegExp(year + '', 'g');
                HEString = HEString.replace(yearRE, yearHEString);
                matchedYears.add(year);
            }
        });

        const response = {
            HE: HEString,
            matchedYears,
        }
        return response;
    }

    private checkYear = (
        word: string, index: number, splitData: string[],
    ) => {
        /**
         * check year based on a nlp model
         * check year based on an array of RegExp
         */

        let year: number | undefined;

        regExpRules.forEach(rule => {
            // console.log(rule);
            const firstWord = splitData[index - 1] ? splitData[index - 1] + SPACE_SEPARATOR : '';
            const lastWord = splitData[index + 1] ? SPACE_SEPARATOR + splitData[index + 1] : '';
            const wordWindow = firstWord + word + lastWord;
            // console.log(wordWindow);

            const match = wordWindow.match(rule);
            // console.log(match);

            if (match) {
                year = parseInt(match[2]);
            }
        });

        if (year) {
            return {
                value: year,
                type: 'AD',
            };
        }

        return;
    }

    private computeAdditions = (
        options: Partial<HoloceneTimestampParserOptions>,
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
        }

        const styleHETimestampStart = options.styleHETimestamp === HE_TIMESTAMP_STYLES.ITALIC
            ? '<i>'
            : '';
        const styleHETimestampEnd = options.styleHETimestamp === HE_TIMESTAMP_STYLES.ITALIC
            ? '</i>'
            : '';

        return {
            nameHE,
            betweenStart,
            betweendEnd,
            styleHETimestampStart,
            styleHETimestampEnd,
        }
    }

    private composeHEString = (
        year: any,
        options: Partial<HoloceneTimestampParserOptions>,
        textAdditions: any,
    ) => {
        const {
            nameHE,
            betweenStart,
            betweendEnd,
            styleHETimestampStart,
            styleHETimestampEnd,
        } = textAdditions;

        const yearString = options.replaceTimestamp ? '' : year;

        let yearHE = 0;
        if (year.type === 'AD') {
            yearHE = year.value + HE_TIMEBASE;
        } else {
            yearHE = Math.abs(year.value - HE_TIMEBASE);
        }
        const yearHEStringUnlocated = styleHETimestampStart + betweenStart + yearHE + nameHE + betweendEnd + styleHETimestampEnd;

        const locatedSpaceSperator = yearString ? SPACE_SEPARATOR : '';
        const yearHELocated = options.insertLocation === TIMESTAMP_LOCATION.AFTER
            ? yearString + locatedSpaceSperator + yearHEStringUnlocated
            : yearHEStringUnlocated + locatedSpaceSperator + yearString;

        const yearHEString = yearHELocated;

        return {
            year: year.value,
            yearHE,
            yearHEString,
        }
    }
}


export default HoloceneTimestampParser;
