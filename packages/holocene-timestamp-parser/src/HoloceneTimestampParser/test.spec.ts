import HoloceneTimestampParser, {
    HoloceneTimestampParserOptions,
} from './';



describe('Holocene Timestamp Parser basic', () => {
    it('converts with default options', () => {
        const text = 'words 2019 words'
        const hetParser = new HoloceneTimestampParser(text);
        const textHE = hetParser.textHE();
        expect(textHE).toBe('words 12019 HE words');
    });

    it('converts with default options', () => {
        const text = 'words 2017 words'
        const hetParser = new HoloceneTimestampParser(text);
        const textHE = hetParser.textHE();
        expect(textHE).toBe('words 12017 HE words');
    });

    it('converts with default options', () => {
        const text = 'words 1000 words'
        const hetParser = new HoloceneTimestampParser(text);
        const textHE = hetParser.textHE();
        expect(textHE).toBe('words 11000 HE words');
    });

    it('converts with default options', () => {
        const text = 'words 100 words'
        const hetParser = new HoloceneTimestampParser(text);
        const textHE = hetParser.textHE();
        expect(textHE).toBe('words 10100 HE words');
    });


    it('converts with options: replaceTimestamp false', () => {
        const text = 'words 2019 words'
        const hetParser = new HoloceneTimestampParser(text);
        const options: Partial<HoloceneTimestampParserOptions> = {
            insertLocation: 'AFTER',
            replaceTimestamp: false,
        };
        const textHE = hetParser.textHE(options);
        expect(textHE).toBe('words 2019 12019 HE words');
    });
});
