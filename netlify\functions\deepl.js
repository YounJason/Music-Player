const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const body = JSON.parse(event.body);
    const textToTranslate = body.text;
    const targetLanguage = body.language;

    // DeepL API 호출
    const response = await fetch('https://api.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`
        },
        body: new URLSearchParams({
            text: textToTranslate,
            target_lang: targetLanguage
        })
    });

    const data = await response.json();

    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
};

//
