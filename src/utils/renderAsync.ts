// renderAsync.ts
import ejs from 'ejs';

export async function renderAsync(templatePath: string, data: Record<string, any>): Promise<string> {
    return new Promise((resolve, reject) => {
        ejs.renderFile(templatePath, data, (err, html) => {
            if (err) {
                reject(err);
            } else {
                resolve(html);
            }
        });
    });
}

