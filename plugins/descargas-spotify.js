import axios from 'axios'
import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, '❗ Por favor proporciona el nombre de una canción o artista.', m)

    try {
        let songInfo = await spotifyxv(text)
        if (!songInfo.length) throw '❌ No se encontró la canción.'

        let song = songInfo[0]
        let res = await fetch(`https://api.sylphy.xyz/download/spotify?url=${song.url}&apikey=sylph`)
        if (!res.ok) throw '❌ No se pudo acceder a la API de Sylphy.'

        let data = await res.json()
        if (!data?.result?.download) throw '⚠️ No se pudo obtener el enlace de descarga desde Sylphy.'

        const info = `「✦」Descargando: ${song.name}\n\n> 👤 *Artista:* ${song.artista.join(', ')}\n> 💽 *Álbum:* ${song.album}\n> 🕒 *Duración:* ${song.duracion}\n> 🔗 *Enlace:* ${song.url}`

        await conn.sendMessage(m.chat, {
            text: info,
            contextInfo: {
                forwardingScore: 9999999,
                isForwarded: false,
                externalAdReply: {
                    showAdAttribution: true,
                    containsAutoReply: true,
                    renderLargerThumbnail: true,
                    title: 'Spotify Downloader',
                    body: 'Por Perrita No Yusha',
                    mediaType: 1,
                    thumbnailUrl: song.imagen,
                    mediaUrl: data.result.download,
                    sourceUrl: data.result.download
                }
            }
        }, { quoted: m })

        await conn.sendMessage(m.chat, {
            audio: { url: data.result.download },
            fileName: `${song.name}.mp3`,
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: m })

    } catch (e) {
        console.error('[ERROR]:', e)
        m.reply(`${e.message || e}`)
    }
}

handler.help = ['spotify', 'music']
handler.tags = ['downloader']
handler.command = ['spotify', 'splay']
handler.group = true
handler.register = true

export default handler

// Funciones auxiliares
async function spotifyxv(query) {
    let token = await tokens()
    let response = await axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/search?q=' + query + '&type=track',
        headers: { Authorization: 'Bearer ' + token }
    })
    const tracks = response.data.tracks.items
    return tracks.map(track => ({
        name: track.name,
        artista: track.artists.map(artist => artist.name),
        album: track.album.name,
        duracion: timestamp(track.duration_ms),
        url: track.external_urls.spotify,
        imagen: track.album.images.length ? track.album.images[0].url : ''
    }))
}

async function tokens() {
    const response = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + Buffer.from('acc6302297e040aeb6e4ac1fbdfd62c3:0e8439a1280a43aba9a5bc0a16f3f009').toString('base64')
        },
        data: 'grant_type=client_credentials'
    })
    return response.data.access_token
}

function timestamp(time) {
    const minutes = Math.floor(time / 60000)
    const seconds = Math.floor((time % 60000) / 1000)
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
        }
