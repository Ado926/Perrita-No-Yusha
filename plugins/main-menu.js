let handler = async (m, { conn, args }) => {
  let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
  let user = global.db.data.users[userId]
  let name = conn.getName(userId)
  let _uptime = process.uptime() * 1000
  let uptime = clockString(_uptime)
  let totalreg = Object.keys(global.db.data.users).length
  let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length

  let txt = `

🌷 *¡Hola! Soy ${botname} ✨* 🌷
Aquí tienes la lista de comandos:

╭━━━━━━━━━━━━━━━━━━━━━━━━━╮
│💖 *Cliente*: @${userId.split('@')[0]}
│💚 *Modo*: Público
│💜 *Bot*: ${(conn.user.jid == global.conn.user.jid ? '```Principal```🍀' : 'Sub-Bot 🤘')}
│⏰ *Activada*: ${uptime}
│🌸 *Usuarios*: ${totalreg}
│✨ *Comandos*: ${totalCommands}
│🌼 *Baileys*: Multi Device
╰━━━━━━━━━━━━━━━━━━━━━━━━━╯

💖 *Crea un Sub-Bot con tu número utilizando #qr o #code*

・ ✨ *『 Información del Bot 』* ✨ ・

❀ Comandos para ver el estado e información del Bot.
🌷 #help • #menu → *Ver lista de comandos de la Bot.*
🌼 #uptime • #runtime → *Ver tiempo activo de la Bot.*
🌸 #sc • #script → *Link del repositorio oficial de la Bot.*
💖 #staff • #colaboradores → *Ver lista de desarrolladores.*
💫 #serbot • #serbot code → *Crea una sesión de Sub-Bot.*
🌻 #bots • #sockets → *Ver lista de Sub-Bots activos.*
💚 #creador → *Contacto del creador de la Bot.*
🌷 #status • #estado → *Ver el estado de la Bot.*
✨ #links • #grupos → *Ver enlaces oficiales de la Bot.*
🌸 #infobot • #infobot → *Información completa del Bot.*
🌼 #sug • #newcommand → *Sugiere un nuevo comando.*
💖 #p • #ping → *Ver la velocidad de respuesta de la Bot.*
🌻 #reporte • #reportar → *Reporta algún problema de la Bot.*
💫 #sistema • #system → *Ver estado del sistema.*
💜 #speed • #speedtest → *Ver estadísticas de velocidad.*
🌸 #views • #usuarios → *Ver usuarios registrados.*
✨ #funciones • #totalfunciones → *Ver todas las funciones del Bot.*
💚 #ds • #fixmsgespera → *Eliminar archivos innecesarios.*
🌷 #editautoresponder → *Configurar Prompt personalizado.*

・ ✨ *『 Buscadores 』* ✨ ・

❀ Comandos para realizar búsquedas en diferentes plataformas.
🌸 #tiktoksearch • #tiktoks → *Buscador de videos de TikTok.*
💖 #tweetposts → *Buscador de posts de Twitter/X.*
💫 #ytsearch • #yts → *Búsqueda de videos de YouTube.*
✨ #githubsearch → *Buscador de usuarios de GitHub.*
🌷 #cuevana • #cuevanasearch → *Búsqueda de películas/series.*
💖 #google → *Realiza búsquedas en Google.*
🌸 #pin • #pinterest → *Buscador de imágenes en Pinterest.*
💚 #imagen • #image → *Buscador de imágenes en Google.*
🌻 #animesearch • #animess → *Buscador de animes de tioanime.*
💜 #animei • #animeinfo → *Busca capítulos de anime.*
💫 #infoanime → *Información de anime/manga.*
🌷 #hentaisearch • #searchhentai → *Buscador de hentai.*
✨ #xnxxsearch • #xnxxs → *Busca videos de Xnxx.*
🌸 #xvsearch • #xvideossearch → *Busca videos de Xvideos.*
💖 #pornhubsearch • #phsearch → *Busca videos de Pornhub.*
💚 #npmjs → *Buscador de paquetes npmjs.*

・ ✨ *『 Descargas 』* ✨ ・

❀ Comandos para descargar archivos y videos.
💖 #tiktok • #tt → *Descargar videos de TikTok.*
🌷 #mediafire • #mf → *Descargar archivos de MediaFire.*
✨ #pinvid • #pinvideo → *Descargar videos de Pinterest.*
💚 #mega • #mg → *Descargar archivos de MEGA.*
💖 #play • #play2 → *Descargar música/video de YouTube.*
🌸 #ytmp3 • #ytmp4 → *Descargar música/video de YouTube mediante URL.*
💫 #fb • #facebook → *Descargar videos de Facebook.*
🌷 #twitter • #x → *Descargar videos de Twitter/X.*
✨ #ig • #instagram → *Descargar contenido de Instagram.*
💚 #tts • #tiktoks → *Buscar videos de TikTok.*
🌷 #terabox • #tb → *Descargar archivos por Terabox.*
💖 #gdrive • #drive → *Descargar archivos de Google Drive.*
🌸 #ttimg • #ttmp3 → *Descargar fotos/audios de TikTok.*
💫 #gitclone → *Descargar un repositorio de GitHub.*

・ ✨ *『 Economía 』* ✨ ・

❀ Comandos de economía y RPG.
💖 #w • #work → *Trabaja para ganar monedas.*
🌷 #slut • #protituirse → *Trabaja como prostituta.*
✨ #cf • #suerte → *Apuesta tus monedas.*
🌸 #crime • #crimen → *Trabaja como ladrón.*
💫 #ruleta • #roulette → *Apuesta en ruleta.*
💚 #casino • #apostar → *Apuesta en el casino.*
🌷 #slot → *Apuesta en la ruleta.*
✨ #cartera • #wallet → *Ver tus monedas en la cartera.*
🌸 #banco • #bank → *Ver tus monedas en el banco.*
💖 #deposit • #depositar → *Depositar tus monedas en el banco.*
🌿 ᰔᩚ *#with • #retirar • #withdraw* 🌿
> ✨ Retira tus ${moneda} del banco.

🍃 ᰔᩚ *#transfer • #pay* 🍃
> ✨ Transfiere ${moneda} o XP a otros usuarios.

🌱 ᰔᩚ *#miming • #minar • #mine* 🌱
> ✨ Trabaja como minero y recolecta recursos.

🍀 ᰔᩚ *#buyall • #buy* 🍀
> ✨ Compra ${moneda} con tu XP.

🌸 ᰔᩚ *#daily • #diario* 🌸
> ✨ Reclama tu recompensa diaria.

🌿 ᰔᩚ *#cofre* 🌿
> ✨ Reclama un cofre diario lleno de recursos.

🍃 ᰔᩚ *#weekly • #semanal* 🍃
> ✨ Reclama tu regalo semanal.

🌱 ᰔᩚ *#monthly • #mensual* 🌱
> ✨ Reclama tu recompensa mensual.

🍀 ᰔᩚ *#steal • #robar • #rob* 🍀
> ✨ Intenta robarle ${moneda} a alguien.

🌸 ᰔᩚ *#robarxp • #robxp* 🌸
> ✨ Intenta robar XP a un usuario.

🌿 ᰔᩚ *#eboard • #baltop* 🌿
> ✨ Ver el ranking de usuarios con más ${moneda}.

🍃 ᰔᩚ *#aventura • #adventure* 🍃
> ✨ Aventúrate en un nuevo reino y recolecta recursos.

🌱 ᰔᩚ *#curar • #heal* 🌱
> ✨ Cura tu salud para volverte aventurar.

🍀 ᰔᩚ *#cazar • #hunt • #berburu* 🍀
> ✨ Aventúrate en una caza de animales.

🌸 ᰔᩚ *#inv • #inventario* 🌸
> ✨ Ver tu inventario con todos tus ítems.

🌿 ᰔᩚ *#mazmorra • #explorar* 🌿
> ✨ Explorar mazmorras para ganar ${moneda}.

🍃 ᰔᩚ *#halloween* 🍃
> ✨ Reclama tu dulce o truco (Solo en Halloween).

🌱 ᰔᩚ *#christmas • #navidad* 🌱
> ✨ Reclama tu regalo navideño (Solo en Navidad).

• :･ﾟ⊹˚• \`『 Gacha 』\` •˚⊹:･ﾟ•

❍ Comandos de gacha para reclamar y colecciónar personajes.
🌿 ᰔᩚ *#rollwaifu • #rw • #roll* 🌿
> ✨ Waifu o husbando aleatorio.

🍃 ᰔᩚ  *#claim • #c • #reclamar* 🍃
> ✨ Reclamar un personaje.

🌱 ᰔᩚ *#harem • #waifus • #claims* 🌱
> ✨ Ver tus personajes reclamados.

🍀 ᰔᩚ *#charimage • #waifuimage • #wimage* 🍀
> ✨ Ver una imagen aleatoria de un personaje.

🌸 ᰔᩚ *#charinfo • #winfo • #waifuinfo* 🌸
> ✨ Ver información de un personaje.

🌿 ᰔᩚ *#givechar • #givewaifu • #regalar* 🌿
> ✨ Regalar un personaje a otro usuario.

🍃 ᰔᩚ *#vote • #votar* 🍃
> ✨ Votar por un personaje para subir su valor.

🌱 ᰔᩚ *#waifusboard • #waifustop • #topwaifus* 🌱
> ✨ Ver el top de personajes con mayor valor.

• :･ﾟ⊹˚• \`『 Stickers 』\` •˚⊹:･ﾟ•

❍ Comandos para creaciones de stickers etc.
🌿 ᰔᩚ *#sticker • #s* 🌿
> ✨ Crea stickers de (imagen/video)

🍃 ᰔᩚ *#setmeta* 🍃
> ✨ Estable un pack y autor para los stickers.

🌱 ᰔᩚ *#delmeta* 🌱
> ✨ Elimina tu pack de stickers.

🍀 ᰔᩚ *#pfp • #getpic* 🍀
> ✨ Obtén la foto de perfil de un usuario.

🌸 ᰔᩚ *#qc* 🌸
> ✨ Crea stickers con texto o de un usuario.

🌿 ᰔᩚ *#toimg • #img* 🌿
> ✨ Convierte stickers en imagen.

🍃 ᰔᩚ *#brat • #ttp • #attp*︎ 🍃
> ✨ Crea stickers con texto.

🌱 ᰔᩚ *#emojimix* 🌱
> ✨ Fuciona 2 emojis para crear un sticker.

🍀 ᰔᩚ *#wm* 🍀
> ✨ Cambia el nombre de los stickers.

• :･ﾟ⊹˚• \`『 Herramientas 』\` •˚⊹:･ﾟ•

❍ Comandos de herramientas con muchas funciones.
🌿 ᰔᩚ *#calcular • #calcular • #cal* 🌿
> ✨ Calcular todo tipo de ecuaciones.

🍃 ᰔᩚ *#tiempo • #clima* 🍃
> ✨ Ver el clima de un pais.

🌱 ᰔᩚ *#horario* 🌱
> ✨ Ver el horario global de los países.

🍀 ᰔᩚ *#fake • #fakereply* 🍀
> ✨ Crea un mensaje falso de un usuario.

🌸 ᰔᩚ *#enhance • #remini • #hd* 🌸
> ✨ Mejora la calidad de una imagen.

🌿 ᰔᩚ *#letra* 🌿
> ✨ Cambia el fuente de las letras.

🍃 ᰔᩚ *#read • #readviewonce • #ver* 🍃
> ✨ Ver imágenes de una sola vista.

🌱 ᰔᩚ *#whatmusic • #shazam* 🌱
> ✨ Descubre el nombre de canciones o vídeos.

🍀 ᰔᩚ *#spamwa • #spam* 🍀
> ✨ Envia spam a un usuario.

🌸 ᰔᩚ *#ss • #ssweb* 🌸
> ✨ Ver el estado de una página web.

🌿 ᰔᩚ *#length • #tamaño* 🌿
> ✨ Cambia el tamaño de imágenes y vídeos.

🍃 ᰔᩚ *#say • #decir* + [texto] 🍃
> ✨ Repetir un mensaje.

🌱 ᰔᩚ *#todoc • #toducument* 🌱
> ✨ Crea documentos de (audio, imágenes y vídeos).

🍀 ᰔᩚ *#translate • #traducir • #trad* 🍀
> ✨ Traduce palabras en otros idiomas.

• :･ﾟ⊹˚• \`『 Perfil 』\` •˚⊹:･ﾟ•

❍ Comandos de perfil para ver, configurar y comprobar estados de tu perfil.
🌿 ᰔᩚ *#reg • #verificar • #register* 🌿
> ✨ Registra tu nombre y edad en el bot.

🍃 ᰔᩚ *#unreg* 🍃
> ✨ Elimina tu registro del bot.

🌱 ᰔᩚ *#profile* 🌱
> ✨ Muestra tu perfil de usuario.

🍀 ᰔᩚ *#marry* [mencion / etiquetar] 🍀
> ✨ Propón matrimonio a otro usuario.

🌸 ᰔᩚ *#divorce* 🌸
> ✨ Divorciarte de tu pareja.

🌿 ᰔᩚ *#setgenre • #setgenero* 🌿
> ✨ Establece tu género en el perfil del bot.

🍃 ᰔᩚ *#delgenre • #delgenero* 🍃
> ✨ Elimina tu género del perfil del bot.

🌱 ᰔᩚ *#setbirth • #setnacimiento* 🌱
> ✨ Establece tu fecha de nacimiento en los datos del bot. 

🌸💫 #delbirth • #delnacimiento
> ✦ Elimina tu fecha de nacimiento del perfil del bot.

🌼💬 #setdescription • #setdesc
✦ Establece una descripción en tu perfil del bot.

🌷❌ #deldescription • #deldesc
✦ Elimina la descripción de tu perfil del bot.

🌟🏅 #lb • #lboard + <Paginá>
✦ Top de usuarios con más experiencia y nivel.

🔢🏆 #level • #lvl + <@Mencion>
✦ Ver tu nivel y experiencia actual.

💎💥 #comprarpremium • #premium
✦ Compra un pase premium para usar el bot sin límites.

💌🤫 #confesiones • #confesar
✦ Confiesa tus sentimientos a alguien de manera anónima.


🌺🌿 `Grupos` 🌿🌺
❍ Comandos de grupos para una mejor gestión de ellos.
🌸🛠 #config • #on
> ✦ Ver opciones de configuración de grupos.

🌟🌍 #hidetag
✦ Enviar un mensaje mencionando a todos los usuarios.

🌸📊 #gp • #infogrupo
✦ Ver la información del grupo.

🌷👥 #linea • #listonline
✦ Ver la lista de los usuarios en línea.

🌸👋 #setwelcome
✦ Establecer un mensaje de bienvenida personalizado.

💬💔 #setbye
✦ Establecer un mensaje de despedida personalizado.

🔗💬 #link
✦ El bot envía el link del grupo.

🛡️🔑 #admins • #admin
✦ Mencionar a los admins para solicitar ayuda.

🔄🖋️ #restablecer • #revoke
✦ Restablecer el enlace del grupo.

💬🌐 #grupo • #group [open / abrir]
✦ Cambiar ajustes del grupo para que todos los usuarios envíen mensaje.

🚫👑 #grupo • #group [close / cerrar]
✦ Cambiar ajustes del grupo para que solo los administradores envíen mensaje.

🚪❌ #kick [número / mención]
✦ Eliminar un usuario de un grupo.

➕👥 #add • #añadir • #agregar [número]
✦ Invitar a un usuario a tu grupo.

🎉💼 #promote [mención / etiquetar]
✦ El bot dará administrador al usuario mencionado.

📉🔽 #demote [mención / etiquetar]
✦ El bot quitará administrador al usuario mencionado.

🖼️🎨 #gpbanner • #groupimg
✦ Cambiar la imagen del grupo.

🏷️💬 #gpname • #groupname
✦ Cambiar el nombre del grupo.

📄🖊️ #gpdesc • #groupdesc
✦ Cambiar la descripción del grupo.

⚠️👤 #advertir • #warn • #warning
✦ Darle una advertencia a un usuario.

❌⚠️ #unwarn • #delwarn
✦ Quitar advertencias.

📝📋 #advlist • #listadv
✦ Ver lista de usuarios advertidos.

💡🟢 #bot on
✦ Enciende el bot en un grupo.

🟢🔴 #bot off
✦ Apaga el bot en un grupo.

🚫💬 #mute [mención / etiquetar]
✦ El bot elimina los mensajes del usuario.

🔓📣 #unmute [mención / etiquetar]
✦ El bot deja de eliminar los mensajes del usuario.

📊🗳️ #encuesta • #poll
✦ Crea una encuesta.

❌🗑️ #delete • #del
✦ Elimina mensaje de otros usuarios.

👻🕵️ #fantasmas
✦ Ver lista de inactivos del grupo.

🚪❗ #kickfantasmas
✦ Elimina a los inactivos del grupo.

🔖📢 #invocar • #tagall • #todos
✦ Invoca a todos los usuarios de un grupo.

🎭🔄 #setemoji • #setemo
✦ Cambia el emoji que se usa en la invitación de usuarios.

🔢🌍 #listnum • #kicknum
✦ Eliminar a usuario por el prefijo de país.


🌸🎥 `Anime` 🎥🌸
❍ Comandos de reacciones de anime.
😡💥 #angry • #enojado + <mención>
> ✦ Estar enojado.

👾💋 #bite + <mención>
✦ Muerde a alguien.

😜👅 #bleh + <mención>
✦ Sacar la lengua.

😊💖 #blush + <mención>
✦ Sonrojarte.

😑🔕 #bored • #aburrido + <mención>
✦ Estar aburrido.

😭💔 #cry + <mención>
✦ Llorar por algo o alguien.

🤗❤️ #cuddle + <mención>
✦ Acurrucarse.

💃🔥 #dance + <mención>
✦ Sacate los pasitos prohíbidos.

🍻💫 #drunk + <mención>
✦ Estar borracho.

🍔🤤 #eat • #comer + <mención>
✦ Comer algo delicioso.

🤦‍♀️🙄 #facepalm + <mención>
✦ Darte una palmada en la cara.

🎉😄 #happy • #feliz + <mención>
✦ Salta de felicidad.

🤗🌸 #hug + <mención>
✦ Dar un abrazo.

👶💫 #impregnate • #preg + <mención>
✦ Embarazar a alguien.

🔪💥 #kill + <mención>
✦ Toma tu arma y mata a alguien.

💋🌹 #kiss • #besar • #kiss2 + <mención>
✦ Dar un beso.

😂🎉 #laugh + <mención>
✦ Reírte de algo o alguien.

👅😋 #lick + <mención>
✦ Lamer a alguien.

❤️🔥 #love • #amor + <mención>
✦ Sentirse enamorado.

🖤🤗 #pat + <mención>
✦ Acaricia a alguien.

👋💥 #poke + <mención>
✦ Picar a alguien.

😤💢 #pout + <mención>
✦ Hacer pucheros.

👊💥 #punch + <mención>
✦ Dar un puñetazo.

🏃💨 #run + <mención>
✦ Correr.

😢💔 #sad • #triste + <mención>
✦ Expresar tristeza.

😱💨 #scared + <mención>
✦ Estar asustado.

💋✨ #seduce + <mención>
✦ Seducir a alguien.

🙈💖 #shy • #timido + <mención>
✦ Sentir timidez.

👋😱 #slap + <mención>
✦ Dar una bofetada.

🌅🌙 #dias • #days
✦ Darle los buenos días a alguien.

🌙💤 #noches • #nights
✦ Darle las buenas noches a alguien.

💤🌙 #sleep + <mención>
✦ Tumbarte a dormir.

🚬💨 #smoke + <mención>
✦ Fumar.

🧠🔍 #think + <mención>
✦ Pensar en algo.


🍀🖤 `NSFW` 🖤🍀
❍ Comandos NSFW (Contenido para adultos).
🚫👀 #anal + <mención>
> ✦ Hacer un anal.

🍑💋 #waifu
✦ Buscar una waifu aleatoria.

🛁🚿 #bath + <mención>
✦ Bañarse.

💋🔥 #blowjob • #mamada • #bj + <mención>
✦ Dar una mamada.

🍒💥 #boobjob + <mención>
✦ Hacer una rusa.

💦💔 #cum + <mención>
✦ Venirse en alguien.

🍑🔥 #fap + <mención>
✦ Hacerse una paja.

💕💑 #ppcouple • #ppcp
✦ Genera imágenes para amistades o parejas.

👣🔥 #footjob + <mención>
✦ Hacer una paja con los pies.

💣💋 #fuck • #coger • #fuck2 + <mención>
✦ Follarte a alguien.

☕💏 #cafe • #coffe
✦ Tomate un cafecito con alguien.

❌💔 #violar • #perra + <mención>
✦ Viola a alguien.

👀💦 #grabboobs + <mención>
✦ Agarrar tetas.

🤲🔥 #grop + <mención>
✦ Manosear a alguien.

👅💥 #lickpussy + <mención>
✦ Lamer un coño.

🌐🔞 #rule34 • #r34 + [Tags]
✦ Buscar imágenes en Rule34.

💥💋 #sixnine • #69 + <mención>
✦ Haz un 69 con alguien.

🍑💢 #spank • #nalgada + <mención>
✦ Dar una nalgada.

🍓👅 #suckboobs + <mención>
✦ Chupar tetas.

🔓👙 #undress • #encuerar + <mención>
✦ Desnudar a alguien.

💋❤️ #yuri • #tijeras + <mención>
✦ Hacer tijeras.


🎮🎲 `Juegos` 🎲🎮
❍ Comandos de juegos para jugar con tus amigos.
🤝🎮 #amistad • #amigorandom
> ✦ Hacer amigos con un juego.

🧥✋ #chaqueta • #jalamela
✦ Hacerte una chaqueta.

😂🎤 #chiste
✦ La bot te cuenta un chiste.

💡💬 #consejo
✦ La bot te da un consejo.

👀💣 #doxeo • #doxear + <mención>
✦ Simular un doxeo falso.

📊⚡ #facto
✦ La bot te lanza un facto.

📝💖 #formarpareja
✦ Forma una pareja.

💏🌟 #formarpareja5
✦ Forma 5 parejas diferentes.

💬📜 #frase
✦ La bot te da una frase.

🥚😜 #huevo
✦ Agarrale el huevo a alguien.

💋👀 #chupalo + <mención>
✦ Hacer que un usuario te la chupe.

👏🎉 #aplauso + <mención>
✦ Aplaudirle a alguien.

🟤🤪 #marron + <mención>
✦ Burlarte del color de piel de un usuario.

💔🔫 #suicidar
✦ Suicidate.

🧠🎓 #iq • #iqtest + <mención>
✦ calcular el iq de alguna persona 

💥 *#meme*  
> ✨ La bot te envía un meme aleatorio. 

⚡ *#morse*  
> ✨ Convierte un texto a código morse. 

👾 *#nombreninja*  
> ✨ Busca un nombre ninja aleatorio. 

💨 *#paja • #pajeame*  
> ✨ La bot te hace una paja. 

💬 *#personalidad* + <mencion>  
> ✨ La bot busca tu personalidad. 

💖 *#piropo*  
> ✨ Lanza un piropo. 

❓ *#pregunta*  
> ✨ Hazle una pregunta a la bot. 

💑 *#ship • #pareja*  
> ✨ La bot te da la probabilidad de enamorarte de una persona. 

🎉 *#sorteo*  
> ✨ Empieza un sorteo. 

🔥 *#top*  
> ✨ Empieza un top de personas. 

🍑 *#formartrio* + <mencion>  
> ✨ Forma un trío. 

🧠 *#ahorcado*  
> ✨ Diviértete con la bot jugando el juego ahorcado. 

🧞‍♂️ *#genio*  
> ✨ Comienza una pregunta con el genio. 

📐 *#mates • #matematicas*  
> ✨ Responde las preguntas de matemáticas para ganar recompensas. 

✋ *#ppt*  
> ✨ Juega piedra, papel o tijeras con la bot. 

🔤 *#sopa • #buscarpalabra*  
> ✨ Juega el famoso juego de sopa de letras. 

⚔️ *#pvp • #suit* + <mencion>  
> ✨ Juega un PVP contra otro usuario. 

🎮 *#ttt*  
> ✨ Crea una sala de juego.
  `.trim()

  await conn.sendMessage(m.chat, { 
      text: txt,
      contextInfo: {
          mentionedJid: [m.sender, userId],
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
              newsletterJid: channelRD.id,
              newsletterName: channelRD.name,
              serverMessageId: -1,
          },
          forwardingScore: 9.,
          externalAdReply: {
              title: botname,
              body: textbot,
              thumbnailUrl: banner,
              sourceUrl: redes,
              mediaType: 1,
              showAdAttribution: true,
              renderLargerThumbnail: true,
          },
      },
  }, { quoted: m })

}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help']

export default handler

function clockString(ms) {
    let seconds = Math.floor((ms / 1000) % 60)
    let minutes = Math.floor((ms / (1000 * 60)) % 60)
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
    return `${hours}h ${minutes}m ${seconds}s`
}
