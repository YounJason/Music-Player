let lyric_times = [];
let translated = false;
let autoscrolling = false;
let pip = false;
let lyric_error = false;
let change_time = -1;

let SpotifyTokenData;

async function GetApi(url, method, headers, body) {
    const response = await fetch(url, {
        method: method,
        headers: headers,
        body: body
    });
    let data;
    if (!response.ok)
        data = response.status;
    else
        data = await response.json();
    return data;
}

async function translateText(text) {
    const response = await fetch('/.netlify/functions/googletranslate', {
        method: 'POST',
        body: JSON.stringify({ text }),
    });
    const result = await response.json();
    return result;
}


async function MusicSearch(query, service) {
    if (query != "") {
        if (service == 'spotify') {
            const searchData = await GetApi(`https://api.spotify.com/v1/search?type=track&q=${query}`, 'GET', { Authorization: `Bearer ${SpotifyTokenData.access_token}` }, null);
            console.log(SpotifyTokenData.access_token);

            if ($.type(SpotifyTokenData) === 'number' || $.type(searchData) === 'number') {
                let output = [];

                output.push({
                    'title': '노래를 검색하던 중 오류가 발생했어요',
                    'image': '',
                    'subtitle': searchData,
                    'uri': '',
                    'service': 'error'
                });
                return output;
            }
            else {
                let output = [];
                for (let i = 0; i < 5; i++) {
                    if (searchData.tracks.items.slice(0, 5)[i] != undefined) {
                        output.push({
                            'title': searchData.tracks.items.slice(0, 5)[i].name,
                            'image': searchData.tracks.items.slice(0, 5)[i].album.images[0].url,
                            'subtitle': searchData.tracks.items.slice(0, 5)[i].artists[0].name,
                            'id': searchData.tracks.items.slice(0, 5)[i].uri.split(':')[2],
                            'service': 'spotify'
                        });
                    } else {
                        break;
                    }
                }
                return output;
            }
        }
        else if (service == 'youtube') {
            if (getVideoId(query).id == undefined || getVideoId(query).service != 'youtube') {
                const searchData = await GetApi(`https://www.googleapis.com/customsearch/v1?q=${query}&key=AIzaSyCVJUFSvH5CwN5fVLIAJg_okVDhtOmAQLo&cx=8389aad96b0064c3b`, 'GET', {}, null);
                if ($.type(searchData) === 'number') {
                    let output = [];

                    output.push({
                        'title': '노래를 검색하던 중 오류가 발생했어요.',
                        'image': '',
                        'subtitle': searchData,
                        'uri': '',
                        'service': 'error'
                    });
                    return output;
                }
                else {
                    let searchresult = "";
                    for (let i = 0; i < 5; i++) {
                        if (searchData.items.slice(0, 5)[i] != undefined) {
                            searchresult += searchData.items[i].formattedUrl.replace("https://www.youtube.com/watch?v=", '') + ',';
                        } else {
                            break;
                        }
                    }
                    const videoData = await GetApi(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${searchresult}&key=AIzaSyCVJUFSvH5CwN5fVLIAJg_okVDhtOmAQLo`, 'GET', {}, null);
                    if ($.type(videoData) === 'number') {
                        console.log('omg');
                        let output = [];

                        output.push({
                            'title': '노래를 검색하던 중 오류가 발생했어요.',
                            'image': '',
                            'subtitle': searchData,
                            'uri': '',
                            'service': 'error'
                        });
                        return output;
                    }
                    else {
                        let output = [];
                        for (let i = 0; i < 5; i++) {
                            if (videoData.items.slice(0, 5)[i] != undefined) {
                                output.push({
                                    'title': videoData.items[i].snippet.title,
                                    'image': videoData.items[i].snippet.thumbnails.medium.url,
                                    'subtitle': videoData.items[i].snippet.channelTitle,
                                    'id': videoData.items[i].id,
                                    'service': 'youtube'
                                });
                            } else {
                                break;
                            }
                        }
                        return output;
                    }
                }
            }
            else {
                const videoData = await GetApi(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${getVideoId(query).id}&key=AIzaSyCVJUFSvH5CwN5fVLIAJg_okVDhtOmAQLo`, 'GET', {}, null);
                if ($.type(videoData) === 'number') {
                    let output = [];

                    output.push({
                        'title': '노래를 검색하던 중 오류가 발생했어요.',
                        'image': '',
                        'subtitle': searchData,
                        'uri': '',
                        'service': 'error'
                    });
                    return output;
                }
                else {
                    let output = [];
                    for (let i = 0; i < 5; i++) {
                        if (videoData.items.slice(0, 5)[i] != undefined) {
                            output.push({
                                'title': videoData.items[i].snippet.title,
                                'image': videoData.items[i].snippet.thumbnails.medium.url,
                                'subtitle': videoData.items[i].snippet.channelTitle,
                                'id': videoData.items[i].id,
                                'service': 'youtube'
                            });
                        } else {
                            break;
                        }
                    }
                    return output;
                }
            }
        }
        else if (service == 'applemusic') {
            let output = [];

            output.push({
                'title': '',
                'image': '',
                'subtitle': '',
                'uri': '',
                'service': 'applemusic'
            });
            return output;
        }
        else if (service == 'localfile') {
            let output = [];

            output.push({
                'title': '',
                'image': '',
                'subtitle': '',
                'uri': '',
                'service': 'localfile'
            });
            return output;
        }
    }
    else {
        return ("");
    }
}

async function MusicPlay(id) {
    LoadLyric(id.split('/')[3], id.split('/')[2]);
    if (id.split('/')[0] == 'spotify') {
        $('#player').html("<div class='spotify-iframe'></div>");

        window.onSpotifyIframeApiReady = (IFrameAPI) => {
            let element = document.getElementsByClassName('spotify-iframe')[0];
            let options = {};
            let callback = (EmbedController) => {
                LoadLyric(id.split('/')[3], id.split('/')[2]);
                EmbedController.loadUri('spotify:track:' + id.split('/')[1]);
                EmbedController.play();

                EmbedController.addListener('playback_update', e => {
                    if (document.getElementById('lyric' + (lyric_times.filter(times => times < e.data.position / 1000).length - 1)) != undefined) {
                        if (!document.getElementById('lyric' + (lyric_times.filter(times => times < e.data.position / 1000).length - 1)).className.includes("highlight")) {
                            document.querySelectorAll('.highlight').forEach(element => {
                                element.classList.remove('highlight');
                            });

                            document.getElementById('lyric' + (lyric_times.filter(times => times < e.data.position / 1000).length - 1)).className += ' highlight';

                            if (autoscrolling) {
                                document.getElementById('lyric' + (lyric_times.filter(times => times < e.data.position / 1000).length - 1)).scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'center',
                                    inline: 'center'
                                });
                            }
                        }
                    }

                    if (change_time != -1) {
                        EmbedController.seek(change_time + 0.5);
                        change_time = -1;
                    }
                })
            };
            IFrameAPI.createController(element, options, callback);
        };
    }
    if (id.split('/')[0] == 'youtube') {
        $('#player').html(`<iframe id="youtube_player" src="https://www.youtube.com/embed/${id.split('/')[1]}?rel=0&fs=0&autoplay=1" width="100%" height="100%"></iframe>`)
    }
    if (id.split('/')[0] == 'applemusic') {
        $('#player').html(``)
    }
    if (id.split('/')[0] == 'localfile') {
        $('#player').html(``)
    }
}

async function LoadLyric(artist, title) {
    translated = false;
    autoscrolling = false;
    lyric_error = false;
    let lyric = (await GetApi(`https://lrclib.net/api/search?artist_name=${artist}&track_name=${title}`, 'GET', {}, null))[0];
    if (lyric == undefined) {
        lyric = (await GetApi(`https://lrclib.net/api/search?track_name=${title}`, 'GET', {}, null))[0];
        lyric_error = true;
    }
    if (lyric != undefined) {

        let fullLyrics = '<br><br><span id="autoscroll">자동 스크롤 켜기</span>';
        if (lyric.syncedLyrics.split(/(?<=\.|\?|!|\n)/g).some(s => !/[\uAC00-\uD7A3]/.test(s)))
            fullLyrics += ' <span id="translate">가사 번역하기</span>';
        if (lyric_error)
            fullLyrics += '<p id="lyric_error">이 노래의 가사는 부정확할 수 있습니다.</p>';
        lyric_times = [];
        for (let i = 0; i < lyric.syncedLyrics.split('\n').length; i++) {
            fullLyrics += ('<p id="lyric' + i + '" class="lyric">' + lyric.syncedLyrics.split('\n')[i].substring(11) + '</p>');
            lyric_times.push(Number(lyric.syncedLyrics.split('\n')[i].slice(0, 10).replace(/\[(\d+):(\d{2})\.(\d+)\]/, (_, m, s, ms) => `${+m * 60 + +s}.${ms.padEnd(3, '0')}`)));
        }
        document.querySelector("#lyrics").innerHTML = fullLyrics;

        if (lyric.syncedLyrics.split(/(?<=\.|\?|!|\n)/g).some(s => !/[\uAC00-\uD7A3]/.test(s))) {
            document.querySelector("#translate").addEventListener('click', function () {
                if (translated) {
                    document.querySelectorAll(".translated_lyric").forEach(function (element) {
                        element.remove();
                    })
                    translated = false;
                    document.querySelector("#translate").innerHTML = '가사 번역하기';
                }
                else {
                    if (/[\u3040-\u30FF]/.test(lyric.syncedLyrics)) {
                        kuromoji.builder({ dicPath: "https://unpkg.com/kuromoji@0.1.2/dict/" }).build(function (err, tokenizer) {
                            document.querySelectorAll(".lyric").forEach(async function (element) {
                                translateText(element.innerHTML)
                                    .then(result => {
                                        if (element.innerHTML != result.data.translations[0].translatedText) {
                                            if (/[\u3040-\u30FF]/.test(element.innerHTML)) {
                                                let japaneselyric = "";
                                                tokenizer.tokenize(element.innerHTML).forEach(async function (element) {
                                                    if (element.pronunciation != undefined)
                                                        japaneselyric += element.pronunciation + ' ';
                                                })

                                                element.innerHTML += '<p class="translated_lyric">' + wanakana.toRomaji(japaneselyric) + '<br>' + result.data.translations[0].translatedText + '</p>';
                                            }
                                            else
                                                element.innerHTML += '<p class="translated_lyric">' + result.data.translations[0].translatedText + '</p>';
                                        }
                                    })
                                    .catch(error => console.error('Error:', error));
                            })
                        })
                    }
                    else {
                        document.querySelectorAll(".lyric").forEach(async function (element) {
                            translateText(element.innerHTML)
                                .then(result => {
                                    if (element.innerHTML != result.data.translations[0].translatedText) {
                                        element.innerHTML += '<p class="translated_lyric">' + result.data.translations[0].translatedText + '</p>';
                                    }
                                })
                                .catch(error => console.error('Error:', error));
                        })
                    }
                    translated = true;
                    document.querySelector("#translate").innerHTML = '번역된 가사 숨기기';
                }
            })
        }

        document.querySelector("#autoscroll").addEventListener('click', function () {
            if (autoscrolling) {
                document.querySelector("#autoscroll").innerHTML = '자동 스크롤 켜기';
                autoscrolling = false;
            }
            else {
                document.querySelector("#autoscroll").innerHTML = '자동 스크롤 끄기';
                autoscrolling = true;
            }
        })

        document.querySelectorAll(".lyric").forEach(function (element) {
            element.addEventListener('click', function () {
                console.log(lyric_times[element.getAttribute('id').slice(5)]);
                console.log($('#service option:selected').val())
                if (Math.floor(lyric_times[element.getAttribute('id').slice(5)]) == 0 && $('#service option:selected').val() == 'spotify')
                    change_time = 1;
                else
                    change_time = lyric_times[element.getAttribute('id').slice(5)];
            })
        })
    }
    else {
        document.querySelector("#lyrics").innerHTML = '<br><br><span id="nolyric">가사가 제공되지 않는 노래입니다.</span>';
    }
}

$(document).ready(async function () {
    let typingTimer;
    SpotifyTokenData = (await fetch('/.netlify/functions/spotify')).json();
    $('#search').on('input', function () {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(function () {
            MusicSearch($('#search')[0].value, $('#service option:selected').val())
                .then(data => {
                    if (data != "") {
                        $('#searchmusics').show();
                        let output = [];
                        for (let i = 0; i < data.length; i++) {
                            let element = data[i];
                            if (element.image != "")
                                output += '<p id="' + element.service + '/' + element.id + '/' + element.title + '/' + element.subtitle + '" class="musics"> <img class="musicimage" src="' + element.image + '" alt="' + element.title + '" /><maintitle>' + element.title + '<br><subtitle>' + element.subtitle + '</subtitle></maintitle></p>';
                            else
                                output += '<p id="' + element.service + '/' + element.id + '/' + element.title + '/' + element.subtitle + '" class="musics"><maintitle>' + element.title + '<br><subtitle>' + element.subtitle + '</subtitle></maintitle></p>';
                        }

                        $('#searchmusics').html(output);

                        document.querySelectorAll('#searchmusics > p').forEach(function (searchmusics_element) {
                            searchmusics_element.addEventListener('click', async function () {
                                MusicPlay(searchmusics_element.id);
                            })
                        })
                    }
                    else {
                        $('#searchmusics').hide();
                    }
                });
        }, 200);
    });
    $('#service').change(function () {
        if ($('#service').val() == 'youtube') {
            $('#search').show();
            $('#search').val('');
            $('#search').attr('placeholder', '검색어 또는 URL 입력');
            $('#searchmusics').hide();
        }
        else if ($('#service').val() == 'spotify') {
            $('#search').show();
            $('#search').val('');
            $('#search').attr('placeholder', '검색어 입력');
            $('#searchmusics').hide();
        }
        else if ($('#service').val() == 'applemusic') {
            $('#search').show();
            $('#search').val('');
            $('#search').attr('placeholder', '검색어 입력');
            $('#searchmusics').hide();
        }
        else {
            $('#search').hide();
            $('#search').val('');
            $('#search').attr('placeholder', '');
            $('#searchmusics').hide();
        }
    })
})