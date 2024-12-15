
import { createHexDispData, splitFileContentTo16ByteChunks } from './modellogic';


describe('createHexDispData', () => {
    it('should convert Uint8Array to hexadecimal string array', () => {
        const input = new Uint8Array([0, 1, 10, 255]);
        const result = createHexDispData(input);
        expect(result).toEqual(['00', '01', '0A', 'FF', '  ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', '  ']);
    });

    it('should pad the array to make it a multiple of 16 bytes', () => {
        const input = new Uint8Array([0, 1, 10]);
        const result = createHexDispData(input);
        expect(result).toEqual([
            '00', '01', '0A', '  ', '  ', '  ', '  ', '  ',
            '  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '
        ]);
    });

    it('should return an empty array when input is empty', () => {
        const input = new Uint8Array([]);
        const result = createHexDispData(input);
        expect(result).toEqual([]);
    });
});

describe('splitFileContentTo16ByteChunks', () => {
    it('should split content into 16-byte chunks', () => {
        const dummyByteData = {
            offset: 0,
            hex: [
                '00', '01', '02', '03', '04', '05', '06', '07',
                '08', '09', '0A', '0B', '0C', '0D', '0E', '0F',
                '10', '11', '12', '13', '14', '15', '16', '17'
            ],
            ascii: '........................'
        };


        const input = {
            offset: 0,
            hex: dummyByteData.hex,
            ascii: dummyByteData.ascii
        };

        const result = splitFileContentTo16ByteChunks(input);
        expect(result).toEqual([
            {
                offset: 0,
                hex: [
                    '00', '01', '02', '03', '04', '05', '06', '07',
                    '08', '09', '0A', '0B', '0C', '0D', '0E', '0F'
                ],
                ascii: '................'
            },
            {
                offset: 16,
                hex: [
                    '10', '11', '12', '13', '14', '15', '16', '17'
                ],
                ascii: '........'
            }
        ]);
    });

    it('should return an empty array when content is null', () => {
        const result = splitFileContentTo16ByteChunks(null);
        expect(result).toEqual([]);
    });

    it('should handle content smaller than 16 bytes correctly', () => {
        const input = {
            offset: 0,
            hex: ['00', '01', '02'],
            ascii: 'abc'
        };

        const result = splitFileContentTo16ByteChunks(input);
        expect(result).toEqual([
            {
                offset: 0,
                hex: ['00', '01', '02'],
                ascii: 'abc'
            }
        ]);
    });
});
