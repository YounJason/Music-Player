import romanize from 'romanizer';

export async function handler(event, context) {
    const { text } = JSON.parse(event.body);

    if (!text) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'No text provided' }),
        };
    }

    const result = romanize(text);

    return {
        statusCode: 200,
        body: JSON.stringify({ romanized: result }),
    };
}
