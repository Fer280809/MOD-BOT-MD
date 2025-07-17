import moment from 'moment-timezone';
import PhoneNumber from 'awesome-phonenumber';
import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
    let userId;
    if (m.quoted && m.quoted.sender) {
        userId = m.quoted.sender;
    } else {
        userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
    }

    let user = global.db.data.users[userId];

    let name = conn.getName(userId);
    let cumpleanos = user.birth || 'No especificado';
    let genero = user.genre || 'No especificado';
    let description = user.description || 'Sin Descripción';
    let exp = user.exp || 0;
    let nivel = user.level || 0;
    let role = user.role || 'Sin Rango';
    let coins = user.coin || 0;
    let bankCoins = user.bank || 0;
    
    // Verificar estado de matrimonio desde la base de datos de matrimonios
    let marriageInfo = null;
    let partnerName = 'Nadie';
    let marriageDate = null;
    
    if (global.db.data.marriages) {
        marriageInfo = Object.values(global.db.data.marriages).find(marriage => 
            marriage.spouse1 === userId || marriage.spouse2 === userId
        );
        
        if (marriageInfo) {
            let partnerId = marriageInfo.spouse1 === userId ? marriageInfo.spouse2 : marriageInfo.spouse1;
            partnerName = conn.getName(partnerId);
            marriageDate = marriageInfo.marriageDate;
        }
    }
    
    // Obtener la fecha actual
    const now = moment();
    const registerDate = user.regTime ? moment(user.regTime) : now;
    const timeDiff = now.diff(registerDate, 'days');
    
    // Actividad reciente
    const lastSeen = user.lastSeen ? moment(user.lastSeen).fromNow() : 'Desconocido';

    let perfil = await conn.profilePictureUrl(userId, 'image').catch(_ => 'https://files.catbox.moe/02m1h5.jpg');

    // Emojis según género con más estilo
    let genderEmoji = '🌟';
    if (genero.toLowerCase().includes('hombre') || genero.toLowerCase().includes('masculino')) {
        genderEmoji = '👨‍💼';
    } else if (genero.toLowerCase().includes('mujer') || genero.toLowerCase().includes('femenino')) {
        genderEmoji = '👩‍💼';
    }
    
    // Estado premium con más bling
    let premiumStatus = user.premium ? '✨ 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 ✨' : '🔓 𝗙𝗥𝗘𝗘';
    
    // Emojis para rangos más modernos
    let roleEmoji = '👤';
    if (role.toLowerCase().includes('admin')) roleEmoji = '👑';
    else if (role.toLowerCase().includes('mod')) roleEmoji = '🛡️';
    else if (role.toLowerCase().includes('vip')) roleEmoji = '💎';

    // Estado civil mejorado con más estilo
    let maritalStatus;
    if (marriageInfo) {
        maritalStatus = `💍 𝗖𝗮𝘀𝗮𝗱𝗼/𝗮 𝗰𝗼𝗻 ${partnerName}`;
        if (marriageDate) {
            maritalStatus += `\n║ ⚡ 💕 𝗙𝗲𝗰𝗵𝗮: ${marriageDate}`;
        }
    } else {
        maritalStatus = '💔 𝗦𝗼𝗹𝘁𝗲𝗿𝗼/𝗮';
    }

    // Determinar nivel de actividad
    let activityLevel = '🟢 𝗔𝗰𝘁𝗶𝘃𝗼';
    if (user.lastSeen) {
        const lastSeenMoment = moment(user.lastSeen);
        const hoursDiff = now.diff(lastSeenMoment, 'hours');
        if (hoursDiff > 24) activityLevel = '🟡 𝗜𝗻𝗮𝗰𝘁𝗶𝘃𝗼';
        if (hoursDiff > 72) activityLevel = '🔴 𝗠𝘂𝘆 𝗜𝗻𝗮𝗰𝘁𝗶𝘃𝗼';
    }

    // Barra de progreso para nivel
    let progressBar = '';
    let progress = (exp % 1000) / 1000;
    for (let i = 0; i < 10; i++) {
        progressBar += i < progress * 10 ? '▰' : '▱';
    }

    let profileText = `
╔═══════════════════════════╗
║    🌟 𝗣𝗘𝗥𝗙𝗜𝗟 𝗗𝗘 𝗨𝗦𝗨𝗔𝗥𝗜𝗢 🌟   ║
╠═══════════════════════════╣
║
║ 👤 @${userId.split('@')[0]}
║ 🏷️ ${name}
║ 📝 ${description}
║
╠═══════════════════════════╣
║       💫 𝗜𝗡𝗙𝗢 𝗣𝗘𝗥𝗦𝗢𝗡𝗔𝗟 💫     ║
╠═══════════════════════════╣
║ 
║ 🎂 ${user.age || 'Desconocida'}
║ 🎊 ${cumpleanos}
║ ${genderEmoji} ${genero}
║ 💘 ${maritalStatus}
║ ⏱️ ${timeDiff} días
║ ⌚ ${lastSeen}
║ 🔥 ${activityLevel}
║
╠═══════════════════════════╣
║        🏆 𝗘𝗦𝗧𝗔𝗗𝗜́𝗦𝗧𝗜𝗖𝗔𝗦 🏆      ║
╠═══════════════════════════╣
║
║ ✨ ${exp.toLocaleString()} XP
║ 🔥 Nivel ${nivel}
║ 📊 ${progressBar}
║ ${roleEmoji} ${role}
║ 🛡️ ${user.reputation || 0} ⭐
║
╠═══════════════════════════╣
║         💰 𝗘𝗖𝗢𝗡𝗢𝗠𝗜́𝗔 💰       ║
╠═══════════════════════════╣
║
║ 👛 ${coins.toLocaleString()} ${moneda}
║ 🏦 ${bankCoins.toLocaleString()} ${moneda}
║ 💼 ${(coins + bankCoins).toLocaleString()} ${moneda}
║
╠═══════════════════════════╣
║        🌈 𝗘𝗦𝗧𝗔𝗗𝗢𝗦 🌈       ║
╠═══════════════════════════╣
║
║ 👑 ${premiumStatus}
║ 🧩 ${user.vip ? '✅ VIP' : '❌ Normal'}
║
╚═══════════════════════════╝

🔮 /editar para personalizar
💫 Gana XP interactuando
${marriageInfo ? '' : '💘 /marry para encontrar amor'}
