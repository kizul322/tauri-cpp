/* eslint-disable @typescript-eslint/no-unused-vars */
// for test
import { BinDataStoreInterface } from "./bindata-store";

export class DummyStore implements BinDataStoreInterface {
    async openFileData(_filePath: string): Promise<void> {
        return;
    }
    async readFileData(_offset: number, _size: number): Promise<Uint8Array> {
        return new Uint8Array();
    }
    async fileSize(): Promise<number | null> {
        return 0;
    }

}
