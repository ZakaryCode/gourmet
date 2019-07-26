import * as fs from 'fs-extra';
import * as path from 'path';
// import { exec, ExecException} from 'child_process';

const pluginsDir: string = path.join(__dirname, '../plugins/');
const pluginsLib: string = path.join(__dirname, '../lib/plugins/');

const main = async (source: string, target: string) => {
    try {
        await fs.copy(path.join(source, '/asset/'), path.join(target, '/asset/'));
    } catch (error) {
        console.error(error)
    }
    try {
        await fs.copy(path.join(source, 'package.json'), path.join(target, 'package.json'));
    } catch (error) {
        console.error(error)
    }
}

main(pluginsDir, pluginsLib);