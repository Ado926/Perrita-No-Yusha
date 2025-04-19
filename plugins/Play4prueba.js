import { exec } from 'child_process'
import yts from 'yt-search'

let limit = 100 // MB
let maxDuration = 64 // minutos (1 hora)
let maxSizeAllowed = 700 // MB

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

    // Usamos yt-dlp para obtener la información del video
    exec(`yt-dlp -F ${url}`, (err, stdout, stderr) => {
      if (err || stderr) {
        console.error(stderr)
        return star.reply(m.chat, '✦ *Error al obtener detalles del video con yt-dlp.*', m)
      }

      // Filtrar las calidades de video disponibles (mp4)
      let info = stdout.split('\n').filter(line => line.includes('mp4'))

      if (!info.length) {
        return star.reply(m.chat, '✦ *No se encontraron calidades disponibles para este video.*', m)
      }

      // Elegir la mejor calidad disponible
      let bestQuality = info[info.length - 1].split(' ')[0]

      // Obtener el enlace de descarga directo del video
      exec(`yt-dlp -f ${bestQuality} -g ${url}`, (err, downloadUrl, stderr) => {
        if (err || stderr) {
          console.error(stderr)
          return star.reply(m.chat, '✦ *Error al obtener el enlace de descarga con yt-dlp.*', m)
        }

        // Obtener el tamaño del archivo en MB
        exec(`yt-dlp -f ${bestQuality} --get-filesize ${url}`, (err, sizeOutput, stderr) => {
          if (err || stderr) {
            console.error(stderr)
            return star.reply(m.chat, '✦ *Error al obtener el tamaño del archivo.*', m)
          }

          let size_mb = parseFloat(sizeOutput) / (1024 * 1024) // Convertir a MB
          if (size_mb > maxSizeAllowed) {
            return star.reply(m.chat, `✦ *El archivo es demasiado pesado.*\n\n» Tamaño: ${sizeOutput}\n» Máximo permitido: ${maxSizeAllowed} MB`, m)
          }

          // Verificar la duración del video
          let durationParts = timestamp.split(':').map(Number)
          let durationInMinutes = durationParts.reduce((acc, val) => acc * 60 + val)

          if (durationInMinutes > maxDuration) {
            return star.reply(m.chat, `✦ *El video es demasiado largo.*\n\n» Duración: ${timestamp}\n» Máximo permitido: ${maxDuration} minutos.`, m)
          }

          // Preparar el mensaje
          let caption = `✦ *Título:* » ${title}
✦ *Duración:* » ${timestamp}
✦ *Visitas:* » ${views}
✦ *Subido:* » ${ago}
✦ *Tamaño:* » ${sizeOutput}`

          // Aquí es donde debe ir el await ya que la función es async
          await star.sendFile(m.chat, thumbnail, 'thumb.jpg', caption, m)

          // Enviar el video como enlace de descarga
          return star.reply(m.chat, `✦ *Descarga el video desde este enlace:*\n${downloadUrl.trim()}`, m)
        })
      })
    })
  } catch (e) {
    console.error(e)
    await m.react('✖️')
    star.reply(m.chat, '✦ *Ocurrió un error al procesar tu solicitud.*', m)
  }
}

handler.command = ['ytmovie', 'playmovie']
export default handler
