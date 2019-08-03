import HoloceneTimestampParser from '../src';



/**
* Holocene Timestamp Parser sanity test
*/
describe('Holocene Timestamp Parser sanity test', () => {
    it('works if true is truthy', () => {
        expect(true).toBeTruthy();
    });

    it('HoloceneTimestampParser is instantiable', () => {
        expect(new HoloceneTimestampParser('2019 year'))
            .toBeInstanceOf(HoloceneTimestampParser);
    });
});
