import {
    gregorianToHolocene,
    holoceneToGregorian,
} from './';

import {
    HoloceneYear,
    GregorianYear,
} from '../interfaces';



describe('gregorianToHolocene', () => {
    it('converts 2019 AD to 12019 HE', () => {
        const year: GregorianYear = {
            value: 2019,
            type: 'AD',
        }
        const convert = gregorianToHolocene(year);
        expect(convert.value).toBe(12019);
        expect(convert.type).toBe('HE');
    });

    it('converts 919 AD to 10919 HE', () => {
        const year: GregorianYear = {
            value: 919,
            type: 'AD',
        }
        const convert = gregorianToHolocene(year);
        expect(convert.value).toBe(10919);
        expect(convert.type).toBe('HE');
    });

    it('converts 19 AD to 10019 HE', () => {
        const year: GregorianYear = {
            value: 19,
            type: 'AD',
        }
        const convert = gregorianToHolocene(year);
        expect(convert.value).toBe(10019);
        expect(convert.type).toBe('HE');
    });

    it('converts 19 BC to 9982 HE', () => {
        const year: GregorianYear = {
            value: 19,
            type: 'BC',
        }
        const convert = gregorianToHolocene(year);
        expect(convert.value).toBe(9982);
        expect(convert.type).toBe('HE');
    });

    it('converts 919 BC to 9082 HE', () => {
        const year: GregorianYear = {
            value: 919,
            type: 'BC',
        }
        const convert = gregorianToHolocene(year);
        expect(convert.value).toBe(9082);
        expect(convert.type).toBe('HE');
    });

    it('converts 9019 BC to 982 HE', () => {
        const year: GregorianYear = {
            value: 9019,
            type: 'BC',
        }
        const convert = gregorianToHolocene(year);
        expect(convert.value).toBe(982);
        expect(convert.type).toBe('HE');
    });

    it('converts 12019 BC to 2019 BHE', () => {
        const year: GregorianYear = {
            value: 12019,
            type: 'BC',
        }
        const convert = gregorianToHolocene(year);
        expect(convert.value).toBe(2019);
        expect(convert.type).toBe('BHE');
    });
});


describe('holoceneToGregorian', () => {
    it('converts 12019 HE to 2019 AD', () => {
        const year: HoloceneYear = {
            value: 12019,
            type: 'HE',
        }
        const convert = holoceneToGregorian(year);
        expect(convert.value).toBe(2019);
        expect(convert.type).toBe('AD');
    });

    it('converts 10919 HE to 919 AD', () => {
        const year: HoloceneYear = {
            value: 10919,
            type: 'HE',
        }
        const convert = holoceneToGregorian(year);
        expect(convert.value).toBe(919);
        expect(convert.type).toBe('AD');
    });

    it('converts 10019 HE to 19 AD', () => {
        const year: HoloceneYear = {
            value: 10019,
            type: 'HE',
        }
        const convert = holoceneToGregorian(year);
        expect(convert.value).toBe(19);
        expect(convert.type).toBe('AD');
    });

    it('converts 9982 HE to 19 BC', () => {
        const year: HoloceneYear = {
            value: 9982,
            type: 'HE',
        }
        const convert = holoceneToGregorian(year);
        expect(convert.value).toBe(19);
        expect(convert.type).toBe('BC');
    });

    it('converts 9082 HE to 919 BC', () => {
        const year: HoloceneYear = {
            value: 9082,
            type: 'HE',
        }
        const convert = holoceneToGregorian(year);
        expect(convert.value).toBe(919);
        expect(convert.type).toBe('BC');
    });

    it('converts 982 HE to 9019 BC', () => {
        const year: HoloceneYear = {
            value: 982,
            type: 'HE',
        }
        const convert = holoceneToGregorian(year);
        expect(convert.value).toBe(9019);
        expect(convert.type).toBe('BC');
    });

    it('converts 2019 BHE to 12019 BC', () => {
        const year: HoloceneYear = {
            value: 2019,
            type: 'BHE',
        }
        const convert = holoceneToGregorian(year);
        expect(convert.value).toBe(12019);
        expect(convert.type).toBe('BC');
    });
});
