const Kakasi = require('kakasi.js');

exports.handler = async (event, context) => {
  try {
    const kakasi = new Kakasi();
    const text = 'こんにちは、世界！';  // 테스트할 일본어 텍스트
    const result = kakasi.convert(text);

    return {
      statusCode: 200,
      body: JSON.stringify({ result }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred' }),
    };
  }
};
