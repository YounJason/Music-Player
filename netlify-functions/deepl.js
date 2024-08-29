exports.handler = async function(event, context) {
    // fetch를 동적 import로 불러오기
    const fetch = (await import('node-fetch')).default;
  
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

      // DeepL API 호출
      const response = await fetch(`${url}?${params}`);
  
      // 번역된 텍스트 반환
      return {
        body: response,
      };
  };
  