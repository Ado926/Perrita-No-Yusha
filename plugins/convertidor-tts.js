import axios from 'axios';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

const handler = async (m, { conn, args }) => {
  let text = args.join(' ');
  if (!text && m.quoted?.text) text = m.quoted.text;
  if (!text) throw '⚠️ Escribe el texto que quieres convertir a voz.';

  try {
    const url = `https://api.tts.quest/v3/google?text=${encodeURIComponent(text)}&lang=es-mx&voice=es-MX-Standard-A`;
    const { data } = await axios.get(url);

    if (!data || !data.mp3Url) throw '❌ Error al generar el audio.';
    
    const audio = await axios.get(data.mp3Url, { responseType: 'arraybuffer' });
    const filePath = join(global.__dirname(import.meta.url), '../tmp', `tts-${Date.now()}.mp3`);
    writeFileSync(filePath, audio.data);
    
    await conn.sendFile(m.chat, filePath, 'voz.mp3', null, m, true);
    unlinkSync(filePath);
  } catch (err) {
    console.error(err);
    m.reply('❌ Hubo un problema generando el TTS. Intenta de nuevo.');
  }
};

handler.help = ['tts <texto>'];
handler.tags = ['transformador'];
handler.command = ['tts'];
handler.group = true;
handler.register = true;

export default handler;
