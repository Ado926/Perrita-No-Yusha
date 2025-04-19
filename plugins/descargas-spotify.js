import axios from 'axios'

let handler = async (m, { conn, text }) => {
  if (!text || !text.includes('open.spotify.com/track')) {
    return m.reply('❗ Proporciona un enlace válido de una canción de Spotify.')
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    const res = await axios.get(`https://api.sylphy.xyz/download/spotify?url=${text}&apikey=sylph`)
    const data = res.data

    if (!data || !data.result || !data.result.url) {
      return m.reply('⚠️ No se pudo obtener el enlace de descarga desde Sylphy.')
    }

    let info = `「✦」*Descargando...*\n\n> 🎵 *Título:* ${data.result.title}\n> 👤 *Artista:* ${data.result.artists}\n> 💽 *Álbum:* ${data.result.album}\n> 🕒 *Duración:* ${data.result.duration}`

    await conn.sendMessage(m.chat, {
      text: info,
      contextInfo: {
        externalAdReply: {
          title: data.result.title,
          body: "Procesado por Perrita No Yusha",
          thumbnailUrl: data.result.thumbnail,
          mediaType: 1,
          renderLargerThumbnail: true,
          mediaUrl: text,
          sourceUrl: text
        }
      }
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      audio: { url: data.result.url },
      fileName: `${data.result.title}.mp3`,
      mimetype: 'audio/mp4',
      ptt: true
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })
  } catch (e) {
    console.error('[Error]', e)
    m.reply('❌ Hubo un error al descargar la canción desde la API de Sylphy.')
  }
}

handler.command = ['spotify', 'splay']
handler.help = ['spotify <link>']
handler.tags = ['downloader']
handler.register = true
handler.group = false

export default handler
