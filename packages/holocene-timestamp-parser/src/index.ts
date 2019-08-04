import HoloceneTimestampParser from './objects/HoloceneTimestampParser';

import {
    gregorianToHolocene as _gregorianToHolocene,
    holoceneToGregorian as _holoceneToGregorian,
} from './utilities';

import {
    HoloceneYear as _HoloceneYear,
    GregorianYear as _GregorianYear,
    HoloceneTimestampParserOptions as _HoloceneTimestampParserOptions,
    HoloceneTimestampParsed as _HoloceneTimestampParsed,
    IHoloceneTimestampParser as _IHoloceneTimestampParser,
} from './interfaces';

import {
    TIMESTAMP_LOCATION,
    BETWEEN_SIGNS,
    HE_TIMESTAMP_STYLES,
    HOLOCENE_YEAR_TYPES,
    GREGORIAN_YEAR_TYPES,
} from './enumerations';



export interface GregorianYear extends _GregorianYear {}
export interface HoloceneYear extends _HoloceneYear {}

export interface IHoloceneTimestampParser extends _IHoloceneTimestampParser {}
export interface HoloceneTimestampParserOptions extends _HoloceneTimestampParserOptions {}
export interface HoloceneTimestampParsed extends _HoloceneTimestampParsed {}


export const enumerations = {
    TIMESTAMP_LOCATION,
    BETWEEN_SIGNS,
    HE_TIMESTAMP_STYLES,
    HOLOCENE_YEAR_TYPES,
    GREGORIAN_YEAR_TYPES,
}


export const holoceneToGregorian = _holoceneToGregorian;
export const gregorianToHolocene = _gregorianToHolocene;


export default HoloceneTimestampParser;
