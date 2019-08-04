import {
    HE_TIMEBASE,
} from '../constants';

import {
    HoloceneYear,
    GregorianYear,
} from '../interfaces';

import {
    HOLOCENE_YEAR_TYPES,
    GREGORIAN_YEAR_TYPES,
} from '../enumerations';



export const gregorianToHolocene = (year: GregorianYear): HoloceneYear => {
    if (year.type === GREGORIAN_YEAR_TYPES.AD) {
        const value = year.value + HE_TIMEBASE;
        const holoceneYear: HoloceneYear = {
            value,
            type: HOLOCENE_YEAR_TYPES.HE,
        }
        return holoceneYear;
    } else {
        const value = HE_TIMEBASE - year.value;
        if (value > 0) {
            const holoceneYear: HoloceneYear = {
                value,
                type: HOLOCENE_YEAR_TYPES.HE,
            }
            return holoceneYear;
        }

        const holoceneYear: HoloceneYear = {
            value,
            type: HOLOCENE_YEAR_TYPES.BHE,
        }
        return holoceneYear;
    }
}


export const holoceneToGregorian = (year: HoloceneYear): GregorianYear => {
    if (year.type === HOLOCENE_YEAR_TYPES.HE) {
        const value = year.value - HE_TIMEBASE;
        if (value < 0) {
            const gregorianYear: GregorianYear = {
                value: Math.abs(value),
                type: GREGORIAN_YEAR_TYPES.BC,
            }
            return gregorianYear;
        }
        const gregorianYear: GregorianYear = {
            value,
            type: GREGORIAN_YEAR_TYPES.AD,
        }
        return gregorianYear;
    } else {
        const value = year.value + HE_TIMEBASE;
        const gregorianYear: GregorianYear = {
            value,
            type: GREGORIAN_YEAR_TYPES.AD,
        }
        return gregorianYear;
    }
}
