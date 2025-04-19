import fetch from 'node-fetch'
import yts from 'yt-search'

let limit = 100 // MB

let handler = async (m, { conn: star, args, usedPrefix, command }) => {
  if (!args[0]) {
    return star.reply(
      m.chat,
      `✦ *¡Ingresa el texto o enlace del vídeo de YouTube!*\n\n» *Ejemplo:*\n> *${usedPrefix + command}* Canción de ejemplo`,
      m
    )
  }

  await m.react('🕓')

  try {
    let query = args.join(' ')
    let isUrl = query.includes('youtu')
    let video

    if (isUrl) {
      let ytres = await yts({ videoId: query.split('v=')[1] })
      video = ytres.videos[0]
    } else {
      let ytres = await yts(query)
      video = ytres.videos[0]
    }

    if (!video) {
      await m.react('✖️')
      return star.reply(m.chat, '✦ *Video no encontrado.*', m)
    }

    let { title, thumbnail, timestamp, views, ago, url } = video

    let api = await fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${url}`)
    let json = await api.json()

    if (!json.data || !json.data.dl) {
      await m.react('✖️')
      return star.reply(m.chat, '✦ *Error al obtener el enlace de descarga desde la API.*', m)
    }

    let { dl: downloadUrl, size, size_mb } = json.data

    if (parseFloat(size_mb) > 700) {
      await m.react('✖️')
      return star.reply(m.chat, '✦ *El archivo es demasiado pesado (más de 700 MB).*', m)
    }

    let durationParts = timestamp.split(':').map(Number)
    let durationInMinutes = durationParts.reduce((acc, val) => acc * 60 + val)

    let caption = `✦ *Título:* » ${title}
✦ *Duración:* » ${timestamp}
✦ *Visitas:* » ${views}
✦ *Subido:* » ${ago}
✦ *Tamaño:* » ${size}`

    await star.sendFile(m.chat, thumbnail, 'thumb.jpg', caption, m)

    if (parseFloat(size_mb) > limit || durationInMinutes > 30) {
      await star.sendMessage(
        m.chat,
        {
          document: { url: downloadUrl },
          mimetype: 'video/mp4',
          fileName: `${title}.mp4`
        },
        { quoted: m }
      )
      await m.react('📄')
    } else {
      await star.sendMessage(
        m.chat,
        {
          video: { url: downloadUrl },
          caption: title,
          mimetype: 'video/mp4',
          fileName: `${title}.mp4`
        },
        { quoted: m }
      )
      await m.react('✅')
    }
  } catch (e) {
    console.error(e)
    await m.react('✖️')
    star.reply(m.chat, '✦ *Ocurrió un error al procesar tu solicitud.*', m)
  }
}

handler.command = ['play4', 'playvidoc']
export default handler
