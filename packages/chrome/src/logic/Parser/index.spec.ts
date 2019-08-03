import HoloceneParser from './index';



it('reads text', () => {
    const parser = new HoloceneParser('foo');

    const read = parser.readText();

    expect(read).toBe('aaa');
});
