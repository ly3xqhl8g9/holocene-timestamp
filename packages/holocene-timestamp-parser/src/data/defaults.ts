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
    insertBetween: BETWEEN_SIGNS.BRACKETS,
    styleHETimestamp: HE_TIMESTAMP_STYLES.REGULAR,
    linkHE: true,
    removeHE: false,
    replaceTimestamp: false,
};
