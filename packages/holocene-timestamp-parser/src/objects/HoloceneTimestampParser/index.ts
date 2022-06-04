import {
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
    GregorianYear,
    HoloceneStringAdditions,
    ComposedHoloceneString,
} from '../../interfaces';

import {
    defaultParserOptions,
    regExpRules,
} from '../../data';

import {
    gregorianToHolocene,
} from '../../utilities';



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
        const holoceneStringAdditions = this.computeHoloceneStringAdditions(options);
        const tokenizedText = this.data.split(SPACE_SEPARATOR);

        tokenizedText.forEach((word, index) => {
            const checkedYear = this.checkYear(word, index, tokenizedText);
            // console.log(checkedYear);

            if (checkedYear && !matchedYears.has(checkedYear.value)) {
                const gregorianYear = checkedYear;
                const {
                    holoceneString,
                } = this.composeHoloceneString(gregorianYear, options, holoceneStringAdditions);
                const gregorianYearRE = new RegExp(gregorianYear.value + '', 'g');
                HEString = HEString.replace(gregorianYearRE, holoceneString);
                matchedYears.add(gregorianYear.value);
            }
        });

        const response = {
            HE: HEString,
            matchedYears,
        }
        return response;
    }

    private checkYear = (
        word: string, index: number, tokenizedText: string[],
    ): GregorianYear | undefined => {
        /**
         * check year based on a nlp model
         * check year based on an array of RegExp
         */

        let year: number | undefined;

        regExpRules.forEach(rule => {
            // console.log(rule);
            const firstWord = tokenizedText[index - 1] ? tokenizedText[index - 1] + SPACE_SEPARATOR : '';
            const lastWord = tokenizedText[index + 1] ? SPACE_SEPARATOR + tokenizedText[index + 1] : '';
            const wordWindow = firstWord + word + lastWord;
            // console.log(wordWindow);

            const match = wordWindow.match(rule);
            // console.log(match);

            if (match) {
                year = parseInt(match[2]);
            }
        });

        if (year) {
            const gregorianYear: GregorianYear = {
                value: year,
                type: 'AD',
            }
            return gregorianYear;
        }

        return;
    }

    private computeHoloceneStringAdditions = (
        options: Partial<HoloceneTimestampParserOptions>,
    ): HoloceneStringAdditions => {
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
        };
    }

    private composeHoloceneString = (
        gregorianYear: GregorianYear,
        options: Partial<HoloceneTimestampParserOptions>,
        holoceneStringAdditions: HoloceneStringAdditions,
    ): ComposedHoloceneString => {
        const {
            nameHE,
            betweenStart,
            betweendEnd,
            styleHETimestampStart,
            styleHETimestampEnd,
        } = holoceneStringAdditions;

        const gregorianYearString = options.replaceTimestamp ? '' : gregorianYear.value;

        const holoceneYear = gregorianToHolocene(gregorianYear);
        const holoceneYearStringUnlocated = styleHETimestampStart
            + betweenStart
            + holoceneYear.value
            + nameHE
            + betweendEnd
            + styleHETimestampEnd;

        const locatedSpaceSeparator = gregorianYearString ? SPACE_SEPARATOR : '';

        const holoceneString = options.insertLocation === TIMESTAMP_LOCATION.AFTER
            ? gregorianYearString + locatedSpaceSeparator + holoceneYearStringUnlocated
            : holoceneYearStringUnlocated + locatedSpaceSeparator + gregorianYearString;

        return {
            holoceneYear,
            holoceneString
        };
    }
}


export default HoloceneTimestampParser;
