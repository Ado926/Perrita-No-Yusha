var handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];
    if (!user.clicks) user.clicks = 0;
    user.clicks += 1;

    let txt = `
*¡Bienvenido al ClickerBot!*
Has hecho *${user.clicks}* clicks.
Sigue haciendo clicks para mejorar tus estadísticas.
    `;

    const buttons = [
        { buttonId: '.clicker', buttonText: { displayText: '🔥 ¡Click!' }, type: 1 },
        { buttonId: '.perfil', buttonText: { displayText: '📊 Ver Perfil' }, type: 1 }
    ];

    const buttonMessage = {
        text: txt.trim(),
        footer: 'ClickerBot',
        buttons: buttons,
        headerType: 1
    };

    await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
};

handler.help = ['clicker'];
handler.tags = ['juegos'];
handler.command = ['clicker', 'click'];
handler.group = false;
handler.register = true;

export default handler;
