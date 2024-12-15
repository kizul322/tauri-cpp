import { ByteData } from "./model";

export function createHexDispData(data: Uint8Array): string[] {
    const hexArray = Array.from(data).map(byte =>
        byte.toString(16).toUpperCase().padStart(2, '0')
    );

    const remainder = hexArray.length % 16;
    if (remainder !== 0) {
        const padding = 16 - remainder;
        for (let i = 0; i < padding; i++) {
            hexArray.push('  ');
        }
    }

    return hexArray;
}

// fixit: この関数がmodel側にいるのは妙な気がする（view用にしか使ってないので分離すべき）
export function splitFileContentTo16ByteChunks(content: ByteData | null): ByteData[] {
    if (!content) return [];
    const chunks: ByteData[] = [];
    for (let i = 0; i < content.hex.length; i += 16) {
        chunks.push({
            offset: content.offset + i,
            hex: content.hex.slice(i, i + 16),
            ascii: content.ascii.slice(i, i + 16)
        });
    }
    return chunks;
}
