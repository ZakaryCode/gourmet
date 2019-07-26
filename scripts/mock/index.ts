import upload from './upload-database';
import mockPortal from './portals';
import mockComment from './comments';

async function main() {
    const ids = await upload(mockPortal, 'portal', 100);
    upload(mockComment(ids), 'comment', 300);
}

main();