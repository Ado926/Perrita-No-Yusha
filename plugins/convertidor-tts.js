import axios from 'axios';
import { unlinkSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const defaultLang = 'es';
const handler = async (m, { conn, args }) => {
  let text = args.join(' ');
  if (!text && m.quoted?.text) text = m.quoted.text;
  if (!text) throw '🌸 Por favor, escribe el texto para convertir a voz.';

  try {
    const audioBuffer = await zueiraJuanTTS(text);
    const filePath = join(global.__dirname(import.meta.url), '../tmp', `tts-${Date.now()}.mp3`);
    writeFileSync(filePath, audioBuffer);
    await conn.sendFile(m.chat, filePath, 'tts.mp3', null, m, true);
    unlinkSync(filePath);
  } catch (e) {
    console.error(e);
    m.reply('❌ Ocurrió un error generando el TTS.');
  }
};

handler.help = ['tts <texto>'];
handler.tags = ['transformador'];
handler.command = ['tts'];
handler.group = true;
handler.register = true;

export default handler;

async function zueiraJuanTTS(text) {
  const url = 'https://api.streamelements.com/kappa/v2/speech';
  const voice = 'es-MX-Standard-A'; // Esta imita muy bien la voz de Juan
  const params = {
    voice,
    text,
  };
  const res = await axios.post(url, params, { responseType: 'arraybuffer' });
  return res.data;
}
