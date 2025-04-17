import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import util from 'util';
import { join } from 'path';

const client = new textToSpeech.TextToSpeechClient();

const handler = async (m, { conn, args }) => {
  let text = args.join(' ');
  if (!text && m.quoted?.text) text = m.quoted.text;
  if (!text) throw '❗ Por favor, escribe algo para convertir a voz.';

  try {
    const audioBuffer = await synthesizeSpeech(text);
    const filePath = join(global.__dirname(import.meta.url), '../tmp', `tts-${Date.now()}.mp3`);
    fs.writeFileSync(filePath, audioBuffer, 'binary');
    await conn.sendFile(m.chat, filePath, 'voz.mp3', null, m, true);
    fs.unlinkSync(filePath);
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

async function synthesizeSpeech(text) {
  const request = {
    input: { text },
    voice: { languageCode: 'es-MX', name: 'es-MX-Standard-A' },
    audioConfig: { audioEncoding: 'MP3' },
  };
  const [response] = await client.synthesizeSpeech(request);
  return response.audioContent;
}
