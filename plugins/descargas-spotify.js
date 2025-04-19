import axios from 'axios'

let handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply('❗ Por favor escribe el nombre de una canción para buscar.')

  try {
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    // Buscar en la API de Sylphy por nombre
    const searchRes = await axios.get(`https://api.sylphy.xyz/search/spotify?query=${encodeURIComponent(text)}&apikey=sylph`)
    const tracks = searchRes.data?.result?.tracks

    if (!tracks || !tracks.length) return m.reply('⚠️ No se encontraron resultados.')

    const track = tracks[0] // Tomamos el primer resultado

    const downloadRes = await axios.get(`https://api.sylphy.xyz/download/spotify?url=${track.url}&apikey=sylph`)
    const data = downloadRes.data?.result

    if (!data || !data.url) return m.reply('⚠️ No se pudo obtener el enlace de descarga desde Sylphy.')

    let info = `「✦」*Descargando...*\n\n> 🎵 *Título:* ${data.title}\n> 👤 *Artista:* ${data.artists}\n> 💽 *Álbum:* ${data.album}\n> 🕒 *Duración:* ${data.duration}`

    await conn.sendMessage(m.chat, {
      text: info,
      contextInfo: {
        externalAdReply: {
          title: data.title,
          body: "Procesado por Perrita No Yusha",
          thumbnailUrl: data.thumbnail,
          mediaType: 1,
          renderLargerThumbnail: true,
          mediaUrl: track.url,
          sourceUrl: track.url
        }
      }
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      audio: { url: data.url },
      fileName: `${data.title}.mp3`,
      mimetype: 'audio/mp4',
      ptt: true
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })

  } catch (e) {
    console.error(e)
    m.reply('❌ Hubo un error al buscar o descargar la canción desde la API de Sylphy.')
  }
}

handler.command = ['spotify', 'splay']
handler.help = ['spotify <nombre de canción>']
handler.tags = ['downloader']
handler.register = true
handler.group = false

export default handler
