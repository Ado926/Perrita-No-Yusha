import fetch from 'node-fetch'
import yts from 'yt-search'
import { youtubedl, youtubedlv2 } from '@bochilteam/scraper'

let limit = 100 // límite en MB

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

    let video = isUrl
      ? (await yts({ videoId: query.split('v=')[1] })).videos[0]
      : (await yts(query)).videos[0]

    if (!video) {
      await m.react('✖️')
      return star.reply(m.chat, '✦ *Video no encontrado.*', m)
    }

    let { title, thumbnail, timestamp, views, ago, url } = video
    let yt = await youtubedl(url).catch(async () => await youtubedlv2(url))
    let videoInfo = yt.video['360p']

    if (!videoInfo) {
      await m.react('✖️')
      return star.reply(m.chat, '✦ *No se encontró una calidad compatible para el video.*', m)
    }

    let { fileSizeH, fileSize } = videoInfo
    let sizeMB = fileSize / (1024 * 1024)
    let durationInMinutes = timestamp.split(':').reduce((a, b) => a * 60 + +b)

    if (sizeMB >= 700) {
      await m.react('✖️')
      return star.reply(m.chat, '✦ *El archivo es demasiado pesado (más de 700 MB).*', m)
    }

    let caption = `✦ *Título:* » ${title}
✦ *Duración:* » ${timestamp}
✦ *Visitas:* » ${views}
✦ *Subido:* » ${ago}
✦ *Tamaño:* » ${fileSizeH}`

    await star.sendFile(m.chat, thumbnail, 'thumb.jpg', caption, m)

    let api = await fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${url}`)
    let json = await api.json()

    if (!json.data || !json.data.dl) {
      await m.react('✖️')
      return star.reply(m.chat, '✦ *Error al obtener el enlace de descarga desde la API.*', m)
    }

    let downloadUrl = json.data.dl

    if (sizeMB > limit || durationInMinutes > 30) {
      await star.sendMessage(
        m.chat,
        { document: { url: downloadUrl }, mimetype: 'video/mp4', fileName: `${title}.mp4` },
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
  } catch (err) {
    console.error(err)
    await m.react('✖️')
    star.reply(m.chat, '✦ *Ocurrió un error al procesar tu solicitud.*', m)
  }
}

handler.command = ['play4', 'playvidoc']
export default handler
