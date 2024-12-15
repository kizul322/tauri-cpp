import { InvokeCpp } from "./tauri-communicator";
import { BinDataStoreInterface, } from "../store/bindata-store";

export class TauriCppDataStore implements BinDataStoreInterface {
    private filePath: string = "";

    async openFileData(filePath: string): Promise<void> {
        this.filePath = filePath;
    }

    async readFileData(offset: number, size: number): Promise<Uint8Array> {
        return await InvokeCpp('Read', {
            filePath: this.filePath,
            offset: offset,
            size: size
        });
    }

    async fileSize(): Promise<number | null> {
        const result = await InvokeCpp('FileSize', { filePath: this.filePath });
        if (result) {
            const size = new DataView(result.buffer).getBigUint64(0, true);
            return Number(size);
        }

        return null;
    }
}
