import fs from 'fs';
import path from 'path'; // Use path module for better path handling

// Define the path to the database file
const DB_PATH = path.join(process.cwd(), 'src', 'database', 'database.json');

// Function to load data from the JSON file
const loadData = () => {
    try {
        // Check if the directory exists, if not, create it
        const dbDir = path.dirname(DB_PATH);
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        // Check if the file exists, if not, return an empty object
        if (!fs.existsSync(DB_PATH)) {
            return {};
        }

        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error loading database:", error);
        // Return empty object or throw error depending on desired behavior
        return {};
    }
};

// Function to save data to the JSON file
const saveData = (data) => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error("Error saving database:", error);
    }
};

// Load data when the module is first loaded (best practice if possible in your bot framework)
// Or load it at the start of the handler function for demonstration purposes as planned.
// Let's stick to loading inside the handler for this example as requested implicitly.


let handler = async (m, { conn, text, command, usedPrefix }) => {
    // Load data at the beginning of the handler call
    const usersData = loadData(); // Load the current state

    const userId = m.sender; // Identificador único del usuario
    const username = m.pushName || userId.split('@')[0]; // Nombre del usuario

    const args = text.split(' ');
    const action = args[0]?.toLowerCase();

    // If the user just typed ".go", show the menu
    if (!action) {
        return showMenu();
    }

    // --- Function to show the menu of commands ---
    function showMenu() {
        const menuMessage = `
*[ 🎮 Comandos del Mundo GO ]*

Usa \`${usedPrefix}${command} [comando]\`

📜 \`${usedPrefix}${command} menu\` - Muestra este menú.
✨ \`${usedPrefix}${command} registro\` - Crea tu personaje.
👤 \`${usedPrefix}${command} perfil\` - Ve tus estadísticas.
🗺️ \`${usedPrefix}${command} explorar\` - Busca recursos o enemigos.
⚔️ \`${usedPrefix}${command} batalla\` - (Requiere un objetivo o evento previo)
🎒 \`${usedPrefix}${command} inventario\` - Revisa tus objetos.
📈 \`${usedPrefix}${command} subirnivel\` - Usa EXP para subir de nivel.
<!-- Añade más comandos aquí a medida que los implementes -->

_¡Prepárate para la aventura!_`;
        conn.reply(m.chat, menuMessage.trim(), m);
    }
    // -------------------------------------------------


    // --- Lógica principal basada en la acción ---
    switch (action) {
        case 'menu':
            showMenu();
            break;

        case 'register':
        case 'registro':
            if (usersData[userId]) {
                return conn.reply(m.chat, `*[ ℹ️ ] ${username}, ya estás registrado en el mundo GO.*`, m);
            }

            // Registrar nuevo jugador con estadísticas base e inventario vacío
            usersData[userId] = {
                name: username,
                level: 1,
                exp: 0,
                health: 100,
                attack: 10,
                defense: 5,
                inventory: [], // Añadimos inventario
                 gold: 0 // Add gold currency
            };

            // Save data after registration
            saveData(usersData);

            conn.reply(m.chat, `*[ 🎉 ] ¡Bienvenido al mundo GO, ${username}!*
Has sido registrado. Usa \`${usedPrefix}${command} perfil\` para ver tus estadísticas.`, m);
            break;

        case 'perfil':
        case 'profile':
            const userData = usersData[userId];

            if (!userData) {
                return conn.reply(m.chat, `*[ ❌ ] ${username}, no estás registrado.*
Usa \`${usedPrefix}${command} registro\` para empezar tu aventura.`, m);
            }

            // Mostrar estadísticas del jugador
            const profileMessage = `
*[ 👤 Perfil de ${userData.name} ]*

✨ Nivel: ${userData.level}
🗡️ EXP: ${userData.exp} / ${userData.level * 100} (para siguiente nivel)
❤️ Salud: ${userData.health}
⚔️ Ataque: ${userData.attack}
🛡️ Defensa: ${userData.defense}
💰 Oro: ${userData.gold}
🎒 Inventario: ${userData.inventory.length} objetos

_¡Usa \`${usedPrefix}${command} menu\` para ver todas las acciones!_`;

            conn.reply(m.chat, profileMessage.trim(), m);
            break;

        // --- Comandos de ejemplo con persistencia ---
        case 'explorar':
             const userExploreData = usersData[userId];
             if (!userExploreData) return conn.reply(m.chat, `*[ ❌ ] Regístrate primero con \`${usedPrefix}${command} registro\`.*`, m);

             const findGold = Math.random() > 0.5; // 50% chance
             const findEnemy = Math.random() > 0.7; // 30% chance
             let changesMade = false; // Flag to track if we need to save

             let exploreResult = `*[ 🗺️ ] ${userExploreData.name} exploró el área...*\n\n`;

             if (findGold) {
                 const goldFound = Math.floor(Math.random() * 20) + 5; // Between 5 and 25 gold
                 userExploreData.gold += goldFound; // Add gold
                 exploreResult += `💰 ¡Encontraste ${goldFound} monedas de oro!\n`;
                 changesMade = true;
             }

             if (findEnemy) {
                 const enemyName = ['Goblin', 'Slime', 'Lobo Salvaje'][Math.floor(Math.random() * 3)];
                 exploreResult += ` menacing ¡Te encontraste con un ${enemyName}!`;
                 // Note: Here you would typically initiate a battle state, which might involve saving state
                 changesMade = true; // Assuming encountering an enemy might change state (e.g., start battle flag)
             } else if (!findGold) {
                 exploreResult += `Parece que no encontraste nada interesante esta vez.`;
             }

            // Save data if changes occurred during exploration
             if(changesMade) {
                saveData(usersData);
             }

             conn.reply(m.chat, exploreResult.trim(), m);
            break;

        case 'batalla':
             const userBattleData = usersData[userId];
             if (!userBattleData) return conn.reply(m.chat, `*[ ❌ ] Regístrate primero con \`${usedPrefix}${command} registro\`.*`, m);

             // Esta es una lógica de batalla MUY simple, solo un ejemplo.
             // Un sistema de batalla real es mucho más complejo y manejaría turnos, HP, etc.
             const enemyName = ['Goblin', 'Slime', 'Lobo Salvaje'][Math.floor(Math.random() * 3)];
             const enemyHP = Math.floor(Math.random() * 20) + 20; // Enemy HP between 20 and 40
             const playerDamage = userBattleData.attack;
             let changesMadeBattle = false;

             let battleResult = `*[ ⚔️ ] ¡${userBattleData.name} se enfrenta a un ${enemyName}!* (Enemigo HP: ${enemyHP})\n\n`;
             battleResult += `💥 ¡Atacas infligiendo ${playerDamage} de daño!\n`;

             if (playerDamage >= enemyHP) {
                 const expGained = Math.floor(enemyHP / 2) + 10; // More HP enemy gives more EXP
                 const goldGained = Math.floor(enemyHP / 5) + 5; // More HP enemy gives more gold

                 userBattleData.exp += expGained;
                 userBattleData.gold += goldGained;
                 battleResult += `✅ ¡Has derrotado al ${enemyName}!\n`;
                 battleResult += `✨ Ganaste ${expGained} EXP.\n`;
                 battleResult += `💰 Encontraste ${goldGained} de oro.`;
                 changesMadeBattle = true;
                 // Note: Check for level up after gaining EXP
             } else {
                 const enemyDamage = Math.floor(enemyHP / 10) + 1; // Simple enemy damage based on its HP
                 userBattleData.health -= enemyDamage;
                 if(userBattleData.health < 0) userBattleData.health = 0; // Prevent negative health

                 battleResult += `💔 El ${enemyName} contraataca y te quita ${enemyDamage} de salud.\n`;
                 battleResult += `❤️ Tu salud actual: ${userBattleData.health}.`;
                 changesMadeBattle = true;

                 if(userBattleData.health <= 0) {
                     battleResult += `\n💀 ¡Has sido derrotado! Regresas al punto de inicio. (Lógica de muerte/reaparición necesaria)`;
                     // Note: Implement logic for death penalty (lose gold, exp, etc.) and respawn
                 }
             }

             // Save data if changes occurred during battle
             if(changesMadeBattle) {
                 saveData(usersData);
                 // After saving, check for level up if EXP was gained
                 if (userBattleData.exp >= userBattleData.level * 100 && userBattleData.health > 0) {
                      // Call level up logic or prompt user
                      // For simplicity, let's add a message suggesting level up
                       if (playerDamage >= enemyHP) { // Only suggest if battle was won and survived
                          battleResult += `\n📈 Tienes suficiente EXP para subir de nivel. Usa \`${usedPrefix}${command} subirnivel\`!`;
                       }
                 }
             }

              conn.reply(m.chat, battleResult.trim(), m);
            break;

        case 'inventario':
             const userInventoryData = usersData[userId];
             if (!userInventoryData) return conn.reply(m.chat, `*[ ❌ ] Regístrate primero con \`${usedPrefix}${command} registro\`.*`, m);

             let inventoryMessage = `*[ 🎒 Inventario de ${userInventoryData.name} ]*\n\n`;

             if (userInventoryData.inventory.length === 0) {
                 inventoryMessage += `Tu inventario está vacío.`;
             } else {
                 // Example: List items (assuming items are simple strings for now)
                 userInventoryData.inventory.forEach(item => {
                     inventoryMessage += `- ${item}\n`;
                 });
             }
             conn.reply(m.chat, inventoryMessage.trim(), m);
            break;

        case 'subirnivel':
        case 'levelup':
             const userLevelUpData = usersData[userId];
             if (!userLevelUpData) return conn.reply(m.chat, `*[ ❌ ] Regístrate primero con \`${usedPrefix}${command} registro\`.*`, m);

             const expRequired = userLevelUpData.level * 100; // Example: 100 EXP per level
             if (userLevelUpData.exp >= expRequired) {
                 userLevelUpData.level++;
                 userLevelUpData.exp -= expRequired; // Deduct EXP
                 userLevelUpData.health += 10; // Example stat increase
                 userLevelUpData.attack += 3;   // Example stat increase
                 userLevelUpData.defense += 2;  // Example stat increase

                 // Save data after level up
                 saveData(usersData);

                 conn.reply(m.chat, `*[ 🎉 ] ¡Felicidades ${userLevelUpData.name}!*
Has alcanzado el Nivel ${userLevelUpData.level}.
Tus estadísticas han mejorado.
Ahora necesitas ${userLevelUpData.level * 100} EXP para el siguiente nivel.`, m);
                 // Note: You might also give skill points or other rewards
             } else {
                 conn.reply(m.chat, `*[ 📊 ] ${userLevelUpData.name}, necesitas ${expRequired - userLevelUpData.exp} EXP más para subir al Nivel ${userLevelUpData.level + 1}.*`, m);
             }
            break;

        // Añadir más casos aquí para otras acciones

        default:
            // If action is not recognized, show error and menu
            conn.reply(m.chat, `*[ ❓ ] Comando RPG "${action}" no reconocido.*`, m);
            showMenu(); // Call function to show the menu
            break;
    }
};

// Define the main command that will trigger this handler
handler.command = ['go']; // Now the main command is '.go'
handler.help = ['go [command]']; // General help indicates it's used with subcommands
handler.tags = ['fun']; // Categorize the handler

export default handler;
