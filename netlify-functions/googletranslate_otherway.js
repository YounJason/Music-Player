exports.handler = async function(event, context) {
    // Dynamically import node-fetch
    const fetch = (await import('node-fetch')).default;

    const { text } = JSON.parse(event.body);
    const url = `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLETRANSLATE_API_KEY}`;

    // Step 1: Translate text to English
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            q: text,
            target: 'en'
        })
    });

    let data = await response.json();
    const translatedTextToEnglish = data.data.translations[0].translatedText;

    // Step 2: Translate English text to Korean
    response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            q: translatedTextToEnglish,
            target: 'ko'
        })
    });

    data = await response.json();
    const translatedTextToKorean = data.data.translations[0].translatedText;

    return {
        statusCode: 200,
        body: JSON.stringify({ translatedText: translatedTextToKorean }),
    };
};
