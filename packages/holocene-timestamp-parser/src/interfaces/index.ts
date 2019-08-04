import {
    TIMESTAMP_LOCATION,
    BETWEEN_SIGNS,
    HE_TIMESTAMP_STYLES,
} from '../enumerations';



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
