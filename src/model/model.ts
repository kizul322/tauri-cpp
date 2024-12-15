import { createHexDispData } from './modellogic';
import { BinDataStoreInterface } from '../store/bindata-store';

export interface ByteData {
    offset: number;
    hex: string[];
    ascii: string;
}

const CHUNK_SIZE = 1024 * 16;
export class HexEditorModel {
    private binDataStore: BinDataStoreInterface;
    private currentOffset: number = 0;
    private fileContent: ByteData | null = null;

    constructor(binDataStore: BinDataStoreInterface) {
        this.binDataStore = binDataStore;
    }


    async openFile(filePath: string): Promise<void> {
        await this.binDataStore.openFileData(filePath);
        this.currentOffset = 0;
        this.fileContent = await this.loadChunk(0);
    }

    async loadChunk(offset: number): Promise<ByteData | null> {
        const data = await this.binDataStore.readFileData(offset, CHUNK_SIZE);

        const fileContent: ByteData = {
            offset: offset,
            hex: createHexDispData(data),
            // eslint-disable-next-line no-control-regex
            ascii: new TextDecoder('ascii').decode(data).replace(/[\x00-\x1F\x7F-\x9F]/g, '.'),
        };

        this.currentOffset = offset;
        this.fileContent = fileContent;

        return fileContent;
    }

    async loadContentIfNeeded(scrollTop: number, scrollHeight: number, clientHeight: number): Promise<ByteData | null> {
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            const fileSize = await this.binDataStore.fileSize();
            const nextOffset = this.currentOffset + CHUNK_SIZE;

            if (fileSize && nextOffset < fileSize) {
                return await this.loadChunk(nextOffset);
            }
        }
        return null;
    }

    getCurrentOffset(): number {
        return this.currentOffset;
    }

    getFileContent(): ByteData | null {
        return this.fileContent;
    }

}