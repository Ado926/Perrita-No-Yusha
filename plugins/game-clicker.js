var handler = async (m, { conn, command }) => {
    let user = global.db.data.users[m.sender];

    if (!user.clicks) user.clicks = 0;

    user.clicks += 1;

    let response = `
*Clicker Game!*
Has hecho *${user.clicks}* clicks!

Sigue haciendo clicks para ganar puntos y desbloquear sorpresas.
    `;

    await conn.sendButton(
        m.chat,
        response,
        'ClickerBot!',
        [['🔥 ¡Click!', `/${command}`]],
        m
    );
};

handler.help = ['clicker'];
handler.tags = ['juegos'];
handler.command = ['clicker', 'click'];
handler.group = false;
handler.register = true;
handler.coin = false;
handler.limit = false;

export default handler;
