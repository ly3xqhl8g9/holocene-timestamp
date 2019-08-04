import HoloceneTimestampParser from './';

import {
    HE_ANCHOR
} from '../../constants';

import {
    HoloceneTimestampParserOptions,
} from '../../interfaces';



describe('Holocene Timestamp Parser basic', () => {
    const cleanOptions: Partial<HoloceneTimestampParserOptions> = {
        insertBetween: 'NOTHING',
        linkHE: false,
        replaceTimestamp: true,
    }

    it.only('converts with default options', () => {
        const data = 'words 2019 words 2017 words'
        const hetParser = new HoloceneTimestampParser(data);
        const text = hetParser.text(cleanOptions);
        expect(text.HE).toBe('words 12019 HE words 12017 HE words');
    });

    it('converts with default options', () => {
        const data = 'words 2019 words'
        const hetParser = new HoloceneTimestampParser(data);
        const text = hetParser.text();
        expect(text.HE).toBe(`words 2019 [12019 ${HE_ANCHOR}] words`);
    });

    it('converts with default options', () => {
        const data = 'words 1000 words'
        const hetParser = new HoloceneTimestampParser(data);
        const text = hetParser.text();
        expect(text.HE).toBe(`words 1000 [11000 ${HE_ANCHOR}] words`);
    });

    it('converts with default options', () => {
        const data = 'words 100 words'
        const hetParser = new HoloceneTimestampParser(data);
        const text = hetParser.text();
        expect(text.HE).toBe(`words 100 [10100 ${HE_ANCHOR}] words`);
    });

    it('converts with options: replaceTimestamp false', () => {
        const data = 'words 2019 words'
        const hetParser = new HoloceneTimestampParser(data);
        const options: Partial<HoloceneTimestampParserOptions> = {
            insertBetween: 'SLASHES',
            insertLocation: 'AFTER',
            linkHE: true,
            replaceTimestamp: true,
        };
        const text = hetParser.text(options);
        expect(text.HE).toBe(`words /12019 ${HE_ANCHOR}/ words`);
    });
});
