import Kakasi from 'kakasi.js';

export async function handler(event, context) {
    const kakasi = new Kakasi();
    const text = 'こんにちは、世界！';
    const result = kakasi.convert(text);

    return {
        statusCode: 200,
        body: JSON.stringify({ result }),
    };
}
