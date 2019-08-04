import {
    HOLOCENE_YEAR_TYPES,
    GREGORIAN_YEAR_TYPES,
    TIMESTAMP_LOCATION,
    BETWEEN_SIGNS,
    HE_TIMESTAMP_STYLES,
} from '../enumerations';



export interface HoloceneYear {
    value: number;
    type: keyof typeof HOLOCENE_YEAR_TYPES;
}


export interface GregorianYear {
    value: number;
    type: keyof typeof GREGORIAN_YEAR_TYPES;
}


export interface IHoloceneTimestampParser {
    text: (options: Partial<HoloceneTimestampParserOptions>) => HoloceneTimestampParsed | undefined;
}


export interface HoloceneTimestampParsed {
    HE: string;
    matchedYears: Set<number>;
}


export interface HoloceneTimestampParserOptions {
    insertLocation: keyof typeof TIMESTAMP_LOCATION;
    insertBetween: keyof typeof BETWEEN_SIGNS;
    styleHETimestamp: keyof typeof HE_TIMESTAMP_STYLES;
    linkHE: boolean;
    removeHE: boolean;
    replaceTimestamp: boolean;
}
