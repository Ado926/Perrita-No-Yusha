// En memoria, no hay base de datos
let usersData = {};

// Comando principal
let handler = async (m, { conn, text, command, usedPrefix }) => {
    const userId = m.sender; // Identificador único del usuario
    const username = m.pushName || userId.split('@')[0]; // Nombre del usuario

    const args = text.split(' ');
    const action = args[0]?.toLowerCase(); // Acción a ejecutar

    // Función para mostrar el menú
    const showMenu = () => {
        const menuMessage = `
*[ 🎮 Comandos del Mundo GO ]*

Usa \`${usedPrefix}${command} [comando]\`

📜 \`${usedPrefix}${command} menu\` - Muestra este menú.
✨ \`${usedPrefix}${command} perfil\` - Ve tus estadísticas.
🗺️ \`${usedPrefix}${command} explorar\` - Busca recursos o enemigos.
⚔️ \`${usedPrefix}${command} batalla\` - Lucha contra enemigos.
🎒 \`${usedPrefix}${command} inventario\` - Revisa tus objetos.
💼 \`${usedPrefix}${command} comprar_mascota\` - Compra una mascota.
🍖 \`${usedPrefix}${command} alimentar_mascota\` - Alimenta a tu mascota.
💰 \`${usedPrefix}${command} minar\` - Minar recursos.

_¡Prepárate para la aventura!_`;
        conn.reply(m.chat, menuMessage.trim(), m);
    };

    // Comando principal para manejar la lógica
    switch (action) {
        case 'menu':
            showMenu();
            break;

        case 'perfil':
        case 'profile':
            const userData = usersData[userId];
            if (!userData) {
                return conn.reply(m.chat, `*[ ❌ ] No tienes un perfil activo. Usa \`${usedPrefix}${command} registro\` para empezar.`, m);
            }

            const profileMessage = `
*[ 👤 Perfil de ${userData.name} ]*

✨ Nivel: ${userData.level}
🗡️ EXP: ${userData.exp} / ${userData.level * 100} (para siguiente nivel)
❤️ Salud: ${userData.health}
⚔️ Ataque: ${userData.attack}
🛡️ Defensa: ${userData.defense}
💰 Oro: ${userData.gold}
🎒 Inventario: ${userData.inventory.length} objetos
🐾 Mascotas: ${userData.pets.length}

_¡Usa \`${usedPrefix}${command} menu\` para ver todas las acciones!_`;
            conn.reply(m.chat, profileMessage.trim(), m);
            break;

        case 'explorar':
            if (!usersData[userId]) {
                usersData[userId] = {
                    name: username,
                    level: 1,
                    exp: 0,
                    health: 100,
                    attack: 10,
                    defense: 5,
                    gold: 0,
                    inventory: [],
                    pets: [],
                };
            }

            const findGold = Math.random() > 0.5; // 50% chance
            const findEnemy = Math.random() > 0.7; // 30% chance
            let changesMade = false; // Flag to track changes

            let exploreResult = `*[ 🗺️ ] ${username} exploró el área...*\n\n`;

            if (findGold) {
                const goldFound = Math.floor(Math.random() * 20) + 5;
                usersData[userId].gold += goldFound;
                exploreResult += `💰 ¡Encontraste ${goldFound} monedas de oro!\n`;
                changesMade = true;
            }

            if (findEnemy) {
                const enemyName = ['Goblin', 'Slime', 'Lobo Salvaje'][Math.floor(Math.random() * 3)];
                exploreResult += `¡Te encontraste con un ${enemyName}!`;
                changesMade = true;
            } else if (!findGold) {
                exploreResult += `Parece que no encontraste nada interesante esta vez.`;
            }

            if (changesMade) {
                // No es necesario guardar datos, ya están en memoria
            }

            conn.reply(m.chat, exploreResult.trim(), m);
            break;

        case 'minar':
            if (!usersData[userId]) {
                usersData[userId] = {
                    name: username,
                    level: 1,
                    exp: 0,
                    health: 100,
                    attack: 10,
                    defense: 5,
                    gold: 0,
                    inventory: [],
                    pets: [],
                };
            }

            const oreFound = Math.floor(Math.random() * 10) + 1; // Minar entre 1 y 10 recursos
            usersData[userId].gold += oreFound;

            conn.reply(m.chat, `*[ ⛏️ ] ${username} ha minado ${oreFound} recursos de oro. Ahora tienes ${usersData[userId].gold} de oro.`, m);
            break;

        case 'comprar_mascota':
            if (!usersData[userId]) {
                usersData[userId] = {
                    name: username,
                    level: 1,
                    exp: 0,
                    health: 100,
                    attack: 10,
                    defense: 5,
                    gold: 0,
                    inventory: [],
                    pets: [],
                };
            }

            const petCost = 50; // Costo de una mascota
            if (usersData[userId].gold < petCost) {
                return conn.reply(m.chat, `*[ ❌ ] No tienes suficiente oro para comprar una mascota. Necesitas ${petCost} de oro.`, m);
            }

            usersData[userId].gold -= petCost;
            const petName = ['Perro', 'Gato', 'Loro'][Math.floor(Math.random() * 3)]; // Elegir aleatoriamente una mascota
            usersData[userId].pets.push(petName);

            conn.reply(m.chat, `*[ 🐾 ] ¡Has comprado un(a) ${petName}! Usa \`${usedPrefix}${command} alimentar_mascota\` para darle de comer.`, m);
            break;

        case 'alimentar_mascota':
            if (!usersData[userId] || usersData[userId].pets.length === 0) {
                return conn.reply(m.chat, `*[ ❌ ] No tienes mascotas para alimentar. Usa \`${usedPrefix}${command} comprar_mascota\` para comprar una.`, m);
            }

            const petToFeed = usersData[userId].pets[0]; // Alimentar a la primera mascota por simplicidad
            usersData[userId].health += 10; // Aumentar la salud del jugador al alimentar

            conn.reply(m.chat, `*[ 🍖 ] Has alimentado a tu ${petToFeed}, y te sientes con más energía. Tu salud ahora es ${usersData[userId].health}.`, m);
            break;

        case 'inventario':
            if (!usersData[userId]) {
                usersData[userId] = {
                    name: username,
                    level: 1,
                    exp: 0,
                    health: 100,
                    attack: 10,
                    defense: 5,
                    gold: 0,
                    inventory: [],
                    pets: [],
                };
            }

            const inventoryItems = usersData[userId].inventory.length > 0
                ? usersData[userId].inventory.join(', ')
                : 'No tienes objetos en tu inventario aún.';

            conn.reply(m.chat, `*[ 🎒 Inventario de ${username} ]*\n\n${inventoryItems}`, m);
            break;

        case 'batalla':
            if (!usersData[userId]) {
                usersData[userId] = {
                    name: username,
                    level: 1,
                    exp: 0,
                    health: 100,
                    attack: 10,
                    defense: 5,
                    gold: 0,
                    inventory: [],
                    pets: [],
                };
            }

            const enemyHealth = Math.floor(Math.random() * 50) + 30; // Salud del enemigo entre 30 y 80
            const enemyAttack = Math.floor(Math.random() * 10) + 5; // Ataque enemigo entre 5 y 15

            let battleResult = `*[ ⚔️ Batalla contra enemigo ]*\n`;
            battleResult += `Enemigo tiene ${enemyHealth} de salud y ${enemyAttack} de ataque.\n`;

            const userAttack = usersData[userId].attack; // Ataque del jugador

            if (userAttack >= enemyHealth) {
                battleResult += `¡Has derrotado al enemigo!`;
                usersData[userId].gold += 20; // Recompensa por derrotar al enemigo
                usersData[userId].exp += 50; // Experiencia ganada
            } else {
                battleResult += `El enemigo te derrotó. ¡Intenta otra vez más tarde!`;
                usersData[userId].health -= enemyAttack; // Reducir salud del jugador
            }

            conn.reply(m.chat, battleResult.trim(), m);
            break;

        default:
            conn.reply(m.chat, `*[ ❓ ] Comando RPG "${action}" no reconocido.*`, m);
            showMenu();
            break;
    }
};

// Configuración del comando
handler.command = ['go']; // El comando principal es '.go'
handler.help = ['go [comando]']; // Ayuda general que indica cómo usar el comando
handler.tags = ['fun']; // Etiquetar el comando como parte de los comandos de diversión

export default handler;
