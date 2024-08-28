exports.handler = async function(event, context) {
    // Dynamically import node-fetch
    const fetch = (await import('node-fetch')).default;

    const SpotifyAuthParams = new URLSearchParams();
    SpotifyAuthParams.append('grant_type', 'client_credentials');
    SpotifyAuthParams.append('client_id', process.env.SPOTIFY_CLIENT_ID);
    SpotifyAuthParams.append('client_secret', process.env.SPOTIFY_CLIENT_SECRET);

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
