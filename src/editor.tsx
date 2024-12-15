import React, { useState, useEffect, useRef } from 'react';
import './editor.css';
import { BinDataStoreInterface } from './store/bindata-store';
import { HexEditorModel, ByteData } from './model/model';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { splitFileContentTo16ByteChunks } from './model/modellogic';

interface AppProps {
    binDataStore: BinDataStoreInterface;
}

const Body: React.FC<AppProps> = ({ binDataStore }) => {
    const hexEditorModel = useRef(new HexEditorModel(binDataStore));
    const [fileContent, setFileContent] = useState<ByteData | null>(null);

    useEffect(() => {
        const setupFileDrop = async () => {
            const unlisten = await getCurrentWindow().onDragDropEvent((event) => {
                if (event.payload.type !== 'drop') {
                    return;
                }
                const filePath = event.payload.paths[0];
                openFile(filePath);
            });
            return unlisten;
        };

        const unlistenPromise = setupFileDrop();
        return () => {
            unlistenPromise.then(unlisten => unlisten());
        };
    }, []);

    const openFile = async (filePath: string) => {
        await hexEditorModel.current.openFile(filePath);
        setFileContent(hexEditorModel.current.getFileContent());
    };

    const handleScroll = async (event: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
        const content = await hexEditorModel.current.loadContentIfNeeded(scrollTop, scrollHeight, clientHeight);
        if (!content) {
            return;
        }

        if (fileContent) {
            content.hex = fileContent.hex.concat(content.hex);
            content.ascii = fileContent.ascii + content.ascii;
            content.offset = fileContent.offset;
        }
        setFileContent(content);
    };

    const renderHexEditor = () => {
        return (
            <div className="editor-body" onScroll={handleScroll}>
                {splitFileContentTo16ByteChunks(fileContent).map((row, rowIndex) => (
                    <div key={rowIndex} className="hex-row">
                        <span className="offset">{row.offset.toString(16).padStart(8, '0')}:</span>
                        <div className="hex-values">
                            {row.hex.map((byte, colIndex) => (
                                <span key={colIndex} className='hex-value'>{byte}</span>
                            ))}
                        </div>
                        <span className="ascii-values">
                            {row.ascii.split('').map((char, colIndex) => (
                                <span key={colIndex} className='ascii-value'>{char}</span>
                            ))}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            <div className='editor-header'>
                Simple Hex Viewer
            </div>
            {renderHexEditor()}
        </div>
    );
};

export default Body;