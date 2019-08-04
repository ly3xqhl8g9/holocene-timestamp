import {
    HoloceneTimestampParserOptions
} from '../interfaces';

import {
    TIMESTAMP_LOCATION,
    BETWEEN_SIGNS,
    HE_TIMESTAMP_STYLES,
} from '../enumerations';



export const defaultTextHEOptions: HoloceneTimestampParserOptions = {
    insertLocation: TIMESTAMP_LOCATION.AFTER,
    insertBetween: BETWEEN_SIGNS.NOTHING,
    styleHETimestamp: HE_TIMESTAMP_STYLES.REGULAR,
    linkHE: false,
    removeHE: false,
    replaceTimestamp: true,
};



export const regExpRules = [
    '\\s(\\d{4})\\s',
    '\\s(\\d{3})\\s',
];
