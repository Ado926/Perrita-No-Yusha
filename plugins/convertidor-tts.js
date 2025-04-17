import { spawn } from 'child_process';
import { join } from 'path';
import fs from 'fs';

const handler = async (m, { conn, args }) => {
  let text = args.join(' ');
  if (!text && m.quoted?.text) text = m.quoted.text;
  if (!text) throw '⚠️ Escribe el texto que quieres convertir a voz.';

  const filePath = join(global.__dirname(import.meta.url), '../tmp', 'tts_output.mp3');

  try {
    await new Promise((resolve, reject) => {
      const py = spawn('python', ['tts_edge.py', text]);

      py.stderr.on('data', data => {
        console.error(`stderr: ${data}`);
      });

      py.on('close', code => {
        if (code === 0) resolve();
        else reject('❌ Error ejecutando edge-tts.');
      });
    });

    const audio = fs.readFileSync(filePath);
    await conn.sendFile(m.chat, filePath, 'voz.mp3', null, m, true);
    fs.unlinkSync(filePath);
  } catch (e) {
    console.error(e);
    m.reply('❌ Ocurrió un error generando el TTS con voz natural.');
  }
};

handler.help = ['tts <texto>'];
handler.tags = ['transformador'];
handler.command = ['tts'];
handler.group = true;
handler.register = true;

export default handler;
