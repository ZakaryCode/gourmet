import * as fs from 'fs-extra';
import * as path from 'path';
import { exec, ExecException} from 'child_process';

const cloudFuncs: string = path.join(__dirname, '../cloud/functions/');
const cloudFuncsLib: string = path.join(__dirname, '../lib/cloud/functions/');
const cloudFuncsPlugins: string = path.join(__dirname, '../lib/plugins');

type TSkipFunc = (dir: string, file: string) => void;
function ReadDir(dir: string, callback: (dir: string, file: string) => void, isSkip?: false | TSkipFunc) {
    fs.readdir(dir, (err: NodeJS.ErrnoException, files: string[]) => {
        if (err) {
            throw err;
        }
        files.forEach((file: string) => {
            const filePath = path.join(dir, file);
            fs.stat(filePath, (err: NodeJS.ErrnoException, stats: fs.Stats) => {
                if (err) {
                    throw err;
                }
                // console.log(file)
                if (file !== 'node_modules') {
                    if (stats.isDirectory()) {
                        ReadDir(filePath, callback, isSkip);
                    } else {
                        callback(dir, file);
                    };
                } else if (isSkip) {
                    // console.log(dir, file)
                    isSkip(dir, file);
                }
            })
        });
    });
}

ReadDir(cloudFuncs, (dir: string, file: string): void => {
    if (file.split('.').reverse()[0] === 'json') {
        // console.log(file, '是 json 文件');
        const source = path.join(dir, file);
        fs.copyFile(source, source.replace(cloudFuncs, cloudFuncsLib), (err: NodeJS.ErrnoException) => {
            if (err) {
                throw err;
            }
            if (file === 'package.json') {
                const target: string = dir.replace(cloudFuncs, cloudFuncsLib);

                exec(`cd ${target} && npm i`,
                    async (error: ExecException | null, stdout: string) => {
                        if (error) {
                            throw error;
                        }
                        console.log(path.join(target, file), stdout);
                        try {
                            await fs.copy(cloudFuncsPlugins, path.join(target, './node_modules/wx-server-plugin/'));
                        } catch (error) {
                            console.error(error);
                        }
                    }
                );
            }
        });
    }
}, (/* dir: string, file: string */) => {
    // try {
    //     await fs.copy(dir, dir.replace(cloudFuncs, cloudFuncsLib));
    // } catch (error) {
    //     if (error.message !== "Cannot copy '../uuid/bin/uuid' to a subdirectory of itself, '../uuid/bin/uuid'.")
    //         console.error(error);
    // }
});
