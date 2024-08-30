const kuromoji = require('kuromoji');

exports.handler = async function(event, context) {
  // kuromoji의 토큰화 기능을 사용하기 위한 준비
  return new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: 'path/to/dictionary/' }).build((err, tokenizer) => {
      if (err) {
        return reject({ statusCode: 500, body: JSON.stringify({ error: err.message }) });
      }

      const text = event.queryStringParameters.text || '';
      const tokens = tokenizer.tokenize(text);

      resolve({
        statusCode: 200,
        body: JSON.stringify({ tokens }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });
};
