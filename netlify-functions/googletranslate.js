exports.handler = async function(event, context) {
    // Dynamically import node-fetch
    const fetch = (await import('node-fetch')).default;

    const { text } = JSON.parse(event.body);
    const url = `https://translation.googleapis.com/language/translate/v2?key=${'AIzaSyCVJUFSvH5CwN5fVLIAJg_okVDhtOmAQLo'}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            q: text,
            target: 'ko'
        })
    });

    const data = await response.json();

    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };
};
