import { __awaiter } from 'tslib';
import { Md5 } from 'ts-md5';

function GKBigUploadWorker({ addEventListener, postMessage }) {
    let stopFlag = false;
    let errorFlag = false;
    addEventListener('message', ({ data: { type, data } }) => {
        if (type === 'startSliceChunk') {
            const { file, chunkSizeGlobal } = data;
            startSliceChunk(file, chunkSizeGlobal);
        }
        if (type === 'clickStop') {
            stopFlag = true;
        }
        if (type === 'someError') {
            errorFlag = true;
        }
    });
    function startSliceChunk(file, chunkSizeGlobal) {
        return __awaiter(this, void 0, void 0, function* () {
            console.info('worker 文件分片 开始进行');
            stopFlag = false;
            errorFlag = false;
            const fileMD5Calc = new Md5();
            let index = 0;
            let start = 0;
            while (start < file.size) {
                if (stopFlag) {
                    console.warn(`分片进程检测到 取消动作, 直接退出`);
                    return;
                }
                if (errorFlag) {
                    console.warn(`分片进程检测到 其他地方已出错, 直接退出`);
                    return;
                }
                let end = start + chunkSizeGlobal;
                let chunkSizeCurrent = chunkSizeGlobal;
                if (end > file.size) {
                    end = file.size;
                    chunkSizeCurrent = end - start;
                }
                const chunkBlob = file.slice(start, end);
                const chunkUint8 = new Uint8Array(yield new Response(chunkBlob).arrayBuffer());
                fileMD5Calc.appendByteArray(chunkUint8);
                const chunkMd5 = new Md5().appendByteArray(chunkUint8).end();
                postMessage({
                    type: 'addChunk',
                    data: {
                        chunk: {
                            index,
                            size: chunkSizeCurrent,
                            md5: chunkMd5,
                            blob: chunkBlob,
                            state: 'waitCheck',
                        },
                    },
                });
                index++;
                start = end;
            }
            const fileMd5 = fileMD5Calc.end();
            postMessage({
                type: 'endSlice',
                data: {
                    fileMd5,
                },
            });
            console.info('worker 文件分片 已完成');
        });
    }
}

/**
 * Generated bundle index. Do not edit.
 */

export { GKBigUploadWorker };
//# sourceMappingURL=ng-goku-worker.js.map
