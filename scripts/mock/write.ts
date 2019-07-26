/**
 * 写入一个适合云开发的数据集
 */
import * as fs from 'fs-extra';
import * as path from 'path';
import * as Mock from 'mockjs';

export default function write(getData: () => Promise<Mock.MockjsMock>, file: string = '', count: number = 10, flag: string = 'a') {
    if (file === '') return;
    const filePath = path.join(__dirname, '../', file);

    fs.open(filePath, flag, async (err: NodeJS.ErrnoException, fd: number) => {
        if (err) throw err;
        console.log(`成功打开文件: ${file}`);
        let arr: string[] = [];
        for (let index = 0; index < count; index++) {
            arr.push(JSON.stringify(await getData()));
        }
        fs.appendFile(fd, `${
            flag.includes('a')? '\n' : ''
        }${arr.join('\n')}`, { encoding: 'utf8' }, (err: NodeJS.ErrnoException) => {
            fs.close(fd, (err) => {
              if (err) throw err;
            });
            if (err) throw err;
            console.log('数据写入成功!');
          });
    });
};