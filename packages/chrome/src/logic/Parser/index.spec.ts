import HoloceneParser from './index';



it('replaces text HE basic: 2019 -> 12019 HE', () => {
    const parser = new HoloceneParser('words 2019 words');
    const textHE = parser.textHE();
    expect(textHE).toBe('words 12019 HE words');
});


it('replaces text HE basic with options noHE: 2019 -> 12019', () => {
    const parser = new HoloceneParser('words 2019 words');
    const options = {
        noHE: true,
    }
    const textHE = parser.textHE(options);
    expect(textHE).toBe('words 12019 words');
});


it('replaces text HE basic with options replace: 2019 -> 2019 12019 HE', () => {
    const parser = new HoloceneParser('words 2019 words');
    const options = {
        replace: false,
    }
    const textHE = parser.textHE(options);
    expect(textHE).toBe('words 2019 12019 HE words');
});
