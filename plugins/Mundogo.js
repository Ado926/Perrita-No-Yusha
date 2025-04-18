import fs from 'fs';
import path from 'path';

// Definir la ruta al archivo de la base de datos
const DB_PATH = path.join(process.cwd(), 'src', 'database', 'database.json');

// Función para cargar datos desde el archivo JSON
const loadData = () => {
    try {
        const dbDir = path.dirname(DB_PATH);
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        if (!fs.existsSync(DB_PATH)) {
            return {};
        }

        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error cargando la base de datos:", error);
        return {};
    }
};

// Función para guardar los datos en el archivo JSON
const saveData = (data) => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error("Error guardando la base de datos:", error);
    }
};

// Función principal que maneja los comandos
let handler = async (m, { conn, text, command, usedPrefix }) => {
    const usersData = loadData(); // Cargar los datos de usuarios
    const userId = m.sender; // Identificador único del usuario
    const username = m.pushName || userId.split('@')[0]; // Nombre del usuario

    const args = text.split(' ');
    const action = args[0]?.toLowerCase(); // Acción a ejecutar

    // Comando para mostrar el menú
    const showMenu = () => {
        const menuMessage = `
*[ 🎮 Comandos del Mundo GO ]*

Usa \`${usedPrefix}${command} [comando]\`

📜 \`${usedPrefix}${command} menu\` - Muestra este menú.
✨ \`${usedPrefix}${command} registro\` - Crea tu personaje.
👤 \`${usedPrefix}${command} perfil\` - Ve tus estadísticas.
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

        case 'registro':
        case 'register':
            if (usersData[userId]) {
                return conn.reply(m.chat, `*[ ℹ️ ] ${username}, ya estás registrado en el mundo GO.*`, m);
            }

            // Registro nuevo jugador
            usersData[userId] = {
                name: username,
                level: 1,
                exp: 0,
                health: 100,
                attack: 10,
                defense: 5,
                gold: 0,
                inventory: [],
                pets: [], // Mascotas del usuario
            };

            saveData(usersData);

            conn.reply(m.chat, `*[ 🎉 ] ¡Bienvenido al mundo GO, ${username}! Has sido registrado. Usa \`${usedPrefix}${command} perfil\` para ver tus estadísticas.`, m);
            break;

        case 'perfil':
        case 'profile':
            const userData = usersData[userId];
            if (!userData) {
                return conn.reply(m.chat, `*[ ❌ ] ${username}, no estás registrado. Usa \`${usedPrefix}${command} registro\` para empezar.`, m);
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
            const userExplore = usersData[userId];
            if (!userExplore) return conn.reply(m.chat, `*[ ❌ ] Regístrate primero con \`${usedPrefix}${command} registro\`.*`, m);

            const findGold = Math.random() > 0.5; // 50% chance
            const findEnemy = Math.random() > 0.7; // 30% chance
            let changesMade = false; // Flag to track changes

            let exploreResult = `*[ 🗺️ ] ${userExplore.name} exploró el área...*\n\n`;

            if (findGold) {
                const goldFound = Math.floor(Math.random() * 20) + 5;
                userExplore.gold += goldFound;
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
                saveData(usersData);
            }

            conn.reply(m.chat, exploreResult.trim(), m);
            break;

        case 'minar':
            const userMining = usersData[userId];
            if (!userMining) return conn.reply(m.chat, `*[ ❌ ] Regístrate primero con \`${usedPrefix}${command} registro\`.*`, m);

            const oreFound = Math.floor(Math.random() * 10) + 1; // Minar entre 1 y 10 recursos
            userMining.gold += oreFound;

            saveData(usersData);

            conn.reply(m.chat, `*[ ⛏️ ] ${userMining.name} ha minado ${oreFound} recursos de oro. Ahora tienes ${userMining.gold} de oro.`, m);
            break;

        case 'comprar_mascota':
            const userBuyPet = usersData[userId];
            if (!userBuyPet) return conn.reply(m.chat, `*[ ❌ ] Regístrate primero con \`${usedPrefix}${command} registro\`.*`, m);

            const petCost = 50; // Costo de una mascota
            if (userBuyPet.gold < petCost) {
                return conn.reply(m.chat, `*[ ❌ ] No tienes suficiente oro para comprar una mascota. Necesitas ${petCost} de oro.`, m);
            }

            userBuyPet.gold -= petCost;
            const petName = ['Perro', 'Gato', 'Loro'][Math.floor(Math.random() * 3)]; // Elegir aleatoriamente una mascota
            userBuyPet.pets.push(petName);

            saveData(usersData);

            conn.reply(m.chat, `*[ 🐾 ] ¡Has comprado un(a) ${petName}! Usa \`${usedPrefix}${command} alimentar_mascota\` para darle de comer.`, m);
            break;

        case 'alimentar_mascota':
            const userFeedPet = usersData[userId];
            if (!userFeedPet || userFeedPet.pets.length === 0) {
                return conn.reply(m.chat, `*[ ❌ ] No tienes mascotas para alimentar. Usa \`${usedPrefix}${command} comprar_mascota\` para comprar una.`, m);
            }

            const petToFeed = userFeedPet.pets[0]; // Alimentar a la primera mascota por simplicidad
            userFeedPet.health += 10; // Aumentar la salud del jugador al alimentar

            saveData(usersData);

            conn.reply(m.chat, `*[ 🍖 ] Has alimentado a tu ${petToFeed}, y te sientes con más energía. Tu salud ahora es ${userFeedPet.health}.`, m);
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
