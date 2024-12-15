import { invoke } from "@tauri-apps/api/core";

type SerializableValue = string | number | boolean | null | undefined | SerializableObject;
interface SerializableObject {
    [key: string]: SerializableValue;
}

export function writeBytes(value: number): number[] {
    let byteLength: number;
    if (value <= 0xFF) {
        byteLength = 1;
    } else if (value <= 0xFFFF) {
        byteLength = 2;
    } else if (value <= 0xFFFFFFFF) {
        byteLength = 4;
    } else {
        byteLength = 8;
    }

    const result: number[] = [];
    console.log(value);
    for (let i = 0; i < byteLength; i++) {
        result.push((value >> (i * 8)) & 0xFF);
    }
    return result;
}


function writeFixedSizeBytes(value: number, byteLength: number = 4): number[] {
    const result: number[] = [];
    for (let i = 0; i < byteLength; i++) {
        result.push((value >> (i * 8)) & 0xFF);
    }
    return result;
}

export function serializeValue(value: SerializableValue): number[] {
    if (value === null || value === undefined) {
        return writeFixedSizeBytes(0);
    }

    switch (typeof value) {
        case 'string': {
            const strBytes = new TextEncoder().encode(value);
            const sizeBytes = writeFixedSizeBytes(strBytes.length);
            return [...sizeBytes, ...strBytes];
        }
        case 'number': {
            const buffer = writeBytes(value);
            const sizeBytes = writeFixedSizeBytes(buffer.length);
            return [...sizeBytes, ...buffer];
        }
        case 'boolean': {
            const boolByte = value ? 1 : 0;
            const sizeBytes = writeFixedSizeBytes(1);
            return [...sizeBytes, boolByte];
        }
        case 'object': {
            const objBytes: number[] = [];
            for (const val of Object.values(value)) {
                objBytes.push(...serializeValue(val));
            }
            return [...objBytes];
        }
        default:
            throw new Error(`Unsupported type: ${typeof value}`);
    }
}

export async function InvokeCpp(funcName: string, args: SerializableObject): Promise<Uint8Array> {
    const chunks: number[] = [];

    const funcNameEncoder = new TextEncoder();
    const funcNameBytes = funcNameEncoder.encode(funcName);
    chunks.push(...funcNameBytes, 0);

    for (const value of Object.values(args)) {
        chunks.push(...serializeValue(value));
    }
    //return new Uint8Array(chunks);
    return new Uint8Array(await invoke<number[]>("invoke_cpp", { data: new Uint8Array(chunks) }));
}