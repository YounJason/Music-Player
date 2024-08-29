const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // POST 요청으로 들어온 데이터 확인
  const { text } = JSON.parse(event.body);

  // DeepL API 키 가져오기
  const apiKey = process.env.DEEPL_API_KEY;
  
  // DeepL API 엔드포인트 및 요청 파라미터 설정
  const url = 'https://api-free.deepl.com/v2/translate';
  const params = new URLSearchParams({
    auth_key: apiKey,
    text: text,
    target_lang: 'KO' // 한국어로 번역
  });

  try {
    // DeepL API 호출
    const response = await fetch(`${url}?${params}`);
    const data = await response.json();

    // 번역된 텍스트 반환
    return {
      statusCode: 200,
      body: JSON.stringify({ translatedText: data.translations[0].text }),
    };
  } catch (error) {
    // 에러 처리
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '번역 실패', details: error.message }),
    };
  }
};
