
export interface ReadResult {
    offset: number;
    hex: Uint8Array;
    ascii: string;
}

export interface BinDataStoreInterface {
    openFileData(filePath: string): Promise<void>;
    readFileData(offset: number, size: number): Promise<Uint8Array>;

    fileSize(): Promise<number | null>;
}
