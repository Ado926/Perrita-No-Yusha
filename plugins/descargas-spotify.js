import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply('❗ Escribe el nombre de la canción. Ejemplo: .spotify La brujita Aniceto Molina')

  try {
    const search = await axios.get(`https://api.sylphy.xyz/search/spotify?query=${encodeURIComponent(text)}&apikey=sylph`)
    const results = search.data?.result

    if (!results || results.length === 0) throw '❌ No se encontraron resultados para esa canción.'

    const song = results[0]
    const songUrl = song?.external_urls?.spotify

    if (!songUrl) throw '❌ No se pudo obtener el enlace de la canción.'

    const res = await axios.get(`https://api.sylphy.xyz/download/spotify?url=${songUrl}&apikey=sylph`)
    const info = res.data?.result

    if (!info?.download) throw '⚠️ No se pudo obtener el enlace de descarga desde Sylphy.'

    const message = `「✦」*Descargando:* ${info.title}\n\n> 👤 *Artista:* ${info.artis}\n> 💽 *Álbum:* ${info.album}\n> 🕒 *Duración:* ${info.durasi}\n> 🔗 *Link:* ${songUrl}`

    await conn.sendMessage(m.chat, {
      text: message,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: false,
        externalAdReply: {
          showAdAttribution: true,
          title: info.title,
          body: info.artis,
          mediaType: 1,
          renderLargerThumbnail: true,
          thumbnailUrl: info.image,
          mediaUrl: info.download,
          sourceUrl: info.download
        }
      }
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      audio: { url: info.download },
      fileName: `${info.title}.mp3`,
      mimetype: 'audio/mp4',
      ptt: true
    }, { quoted: m })

  } catch (err) {
    console.error(err)
    m.reply(typeof err === 'string' ? err : '❌ Ocurrió un error al buscar o descargar la canción.')
  }
}

handler.command = ['spotify', 'splay']
handler.help = ['spotify <nombre de la canción>']
handler.tags = ['downloader']
handler.register = true

export default handler
