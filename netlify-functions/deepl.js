exports.handler = async function(event, context) {
    const fetch = (await import('node-fetch')).default;

    const { text } = JSON.parse(event.body);
    const apiKey = process.env.DEEPL_API_KEY;
    const url = 'https://api-free.deepl.com/v2/translate';
    const params = new URLSearchParams({
        auth_key: apiKey,
        text: text,
        target_lang: 'KO'
    });

    const response = await fetch(`${url}?${params}`);
    const data = await response.json();

    // 번역된 텍스트 반환 (JSON 객체를 문자열로 변환)
    return {
        statusCode: 200,
        body: JSON.stringify(data), // 여기서 data를 문자열로 변환
    };
};
