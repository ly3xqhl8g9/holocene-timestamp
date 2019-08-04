import HoloceneTimestampParser from './';

import {
    HE_ANCHOR
} from '../../constants';

import {
    HoloceneTimestampParserOptions,
} from '../../interfaces';



xdescribe('Holocene Timestamp Parser basic', () => {
    const cleanOptions: Partial<HoloceneTimestampParserOptions> = {
        insertBetween: 'NOTHING',
        linkHE: false,
        replaceTimestamp: true,
    };

    it('converts with default options', () => {
        const data = 'words_one 2019 words_two 2017 words_three 2019 words_four';
        const hetParser = new HoloceneTimestampParser(data);
        const text = hetParser.text(cleanOptions);
        console.log(text.HE);
        expect(text.HE).toBe('words_one 12019 HE words_two 12017 HE words_three 12019 HE words_four');
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
