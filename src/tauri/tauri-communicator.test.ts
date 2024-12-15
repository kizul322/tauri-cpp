import { writeBytes, serializeValue, InvokeCpp } from './tauri-communicator';
import { invoke } from "@tauri-apps/api/core";

// Mock the invoke function
jest.mock("@tauri-apps/api/core", () => ({
    invoke: jest.fn()
}));

describe('writeBytes', () => {
    it('should write a number to a byte array with the appropriate length', () => {
        expect(writeBytes(1)).toEqual([1]);
        expect(writeBytes(256)).toEqual([0, 1]);
        expect(writeBytes(65536)).toEqual([0, 0, 1, 0]);
        expect(writeBytes(0x80000000)).toEqual([0, 0, 0, 128]);
    });
});

describe('serializeValue', () => {
    it('should serialize null and undefined values', () => {
        expect(serializeValue(null)).toEqual([0, 0, 0, 0]);
        expect(serializeValue(undefined)).toEqual([0, 0, 0, 0]);
    });

    it('should serialize string values', () => {
        expect(serializeValue("test")).toEqual([4, 0, 0, 0, 116, 101, 115, 116]);
    });

    it('should serialize number values', () => {
        expect(serializeValue(123)).toEqual([1, 0, 0, 0, 123]);
    });

    it('should serialize boolean values', () => {
        expect(serializeValue(true)).toEqual([1, 0, 0, 0, 1]);
        expect(serializeValue(false)).toEqual([1, 0, 0, 0, 0]);
    });

    it('should serialize object values', () => {
        const obj = { a: 1, b: "test" };
        expect(serializeValue(obj)).toEqual([1, 0, 0, 0, 1, 4, 0, 0, 0, 116, 101, 115, 116]);
    });
});

describe('InvokeCpp', () => {
    it('should invoke the C++ function with serialized arguments', async () => {
        const mockInvoke = invoke as jest.Mock;
        mockInvoke.mockResolvedValue([1, 2, 3, 4]);

        const result = await InvokeCpp('testFunc', { a: 1, b: "test" });

        expect(mockInvoke).toHaveBeenCalledWith("invoke_cpp", {
            data: new Uint8Array([116, 101, 115, 116, 70, 117, 110, 99
                , 0, 1, 0, 0, 0, 1, 4, 0, 0, 0, 116, 101, 115, 116])
        });
        expect(result).toEqual(new Uint8Array([1, 2, 3, 4]));
    });
});