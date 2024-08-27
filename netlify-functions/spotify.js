exports.handler = async function(event, context) {
    // Dynamically import node-fetch
    const fetch = (await import('node-fetch')).default;

    const SpotifyAuthParams = new URLSearchParams();
    SpotifyAuthParams.append('grant_type', 'client_credentials');
    SpotifyAuthParams.append('client_id', '4242dcadb4c94cc7930152930ff1eeba');
    SpotifyAuthParams.append('client_secret', 'c7dfe97221754f0fa8ac47ace42c28bb');

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: SpotifyAuthParams
    });

    const data = await response.json();

    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };
};
