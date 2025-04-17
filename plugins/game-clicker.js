var handler = async (m, { conn }) => {
    const buttons = [
        { buttonId: '.clicker', buttonText: { displayText: 'Haz Click!' }, type: 1 }
    ];

    const buttonMessage = {
        text: 'Probando botones...',
        footer: 'ClickerBot Test',
        buttons: buttons,
        headerType: 1
    };

    await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
};

handler.help = ['clicker'];
handler.tags = ['test'];
handler.command = ['clicker'];
handler.register = true;

export default handler;
