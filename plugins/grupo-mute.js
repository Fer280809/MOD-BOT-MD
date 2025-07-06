/** 
 * Mute temporal y permanente para grupos y usuarios individuales
 * By @MoonContentCreator - Mejorado por Fer280809
 */

// Inicializar variables globales para timers
global.muteTimers = global.muteTimers || {};
global.userMuteTimers = global.userMuteTimers || {};

// Función para parsear duración
const parseDuration = (str) => {
    const match = str.match(/^(\d+)([smhd]|mo)$/i);
    if (!match) return null;
    
    const num = parseInt(match[1]);
    const type = match[2].toLowerCase();
    
    switch (type) {
        case 's': return num * 1000;
        case 'm': return num * 60 * 1000;
        case 'h': return num * 60 * 60 * 1000;
        case 'd': return num * 24 * 60 * 60 * 1000;
        case 'mo': return num * 30 * 24 * 60 * 60 * 1000;
        default: return null;
    }
};

// Función para formatear tiempo
const formatTime = (duration) => {
    return duration.replace(/mo/g, ' meses')
                  .replace(/d/g, ' días')  
                  .replace(/h/g, ' horas')
                  .replace(/m/g, ' minutos')
                  .replace(/s/g, ' segundos');
};

// Función para obtener ID de usuario desde mención o número
const getUserId = (text, m) => {
    if (m.mentionedJid && m.mentionedJid.length > 0) {
        return m.mentionedJid[0];
    }
    
    // Si es un número (formato: 521234567890)
    const match = text.match(/(\d{10,15})/);
    if (match) {
        let number = match[1];
        if (!number.includes('@')) {
            number = number + '@s.whatsapp.net';
        }
        return number;
    }
    
    return null;
};

let handler = async (m, { conn, command, args, isAdmin, isBotAdmin }) => {
    // Verificaciones básicas
    if (!m.isGroup) {
        return m.reply('❌ Este comando solo funciona en grupos');
    }
    
    if (!isAdmin) {
        return m.reply('❌ Solo los administradores pueden usar este comando');
    }
    
    if (!isBotAdmin) {
        return m.reply('❌ Necesito ser administrador para mutear el grupo');
    }

    // Inicializar datos del chat
    let chat = global.db.data.chats[m.chat];
    if (!chat) {
        global.db.data.chats[m.chat] = {};
        chat = global.db.data.chats[m.chat];
    }

    // Inicializar lista de usuarios muteados si no existe
    if (!chat.mutedUsers) chat.mutedUsers = [];
    if (!chat.userMuteData) chat.userMuteData = {};

    try {
        if (command === 'mute') {
            // Verificar si ya está muteado
            if (chat.isMute) {
                return m.reply('❌ El grupo ya está muteado');
            }

            let duration = null;
            if (args[0]) {
                duration = parseDuration(args[0]);
                if (!duration) {
                    return m.reply('❌ Formato incorrecto. Usa: 30s, 10m, 2h, 1d, 1mo');
                }
            }

            // Activar mute
            chat.isMute = true;
            chat.muteExpire = duration ? Date.now() + duration : null;

            // Configurar grupo solo para admins
            await conn.groupSettingUpdate(m.chat, 'announcement');
            
            // Mutear individualmente a todos los participantes no-admin
            const groupMetadata = await conn.groupMetadata(m.chat);
            const participants = groupMetadata.participants;
            const admins = participants.filter(p => p.admin).map(p => p.id);
            const nonAdmins = participants.filter(p => !p.admin && p.id !== conn.user.jid).map(p => p.id);
            
            // Mutear a usuarios no-admin
            for (const userId of nonAdmins) {
                try {
                    await conn.groupParticipantsUpdate(m.chat, [userId], 'restrict');
                } catch (err) {
                    console.log(`No se pudo mutear a ${userId}:`, err.message);
                }
            }
            
            // Guardar lista de usuarios muteados
            chat.mutedUsers = nonAdmins;

            if (duration) {
                // Limpiar timer anterior
                if (global.muteTimers[m.chat]) {
                    clearTimeout(global.muteTimers[m.chat]);
                }

                // Programar desmute automático
                global.muteTimers[m.chat] = setTimeout(async () => {
                    chat.isMute = false;
                    chat.muteExpire = null;
                    delete global.muteTimers[m.chat];
                    
                    await conn.groupSettingUpdate(m.chat, 'not_announcement');
                    
                    // Desmutear a todos los usuarios que fueron muteados
                    if (chat.mutedUsers && chat.mutedUsers.length > 0) {
                        for (const userId of chat.mutedUsers) {
                            try {
                                await conn.groupParticipantsUpdate(m.chat, [userId], 'unrestrict');
                            } catch (err) {
                                console.log(`No se pudo desmutear a ${userId}:`, err.message);
                            }
                        }
                        chat.mutedUsers = [];
                    }
                    
                    await conn.sendMessage(m.chat, { 
                        text: '🔊 El grupo ha sido desmuteado automáticamente' 
                    });
                }, duration);

                const tiempo = formatTime(args[0]);
                return m.reply(`🔇 Grupo muteado por ${tiempo}`);
            } else {
                return m.reply('🔇 Grupo muteado indefinidamente\nUsa .unmute para desmutear');
            }
        }

        else if (command === 'unmute') {
            // Verificar si está muteado
            if (!chat.isMute) {
                return m.reply('🔊 El grupo no está muteado');
            }

            // Desactivar mute
            chat.isMute = false;
            chat.muteExpire = null;

            // Limpiar timer
            if (global.muteTimers[m.chat]) {
                clearTimeout(global.muteTimers[m.chat]);
                delete global.muteTimers[m.chat];
            }

            // Permitir que todos hablen
            await conn.groupSettingUpdate(m.chat, 'not_announcement');
            
            // Desmutear individualmente a todos los usuarios muteados
            if (chat.mutedUsers && chat.mutedUsers.length > 0) {
                for (const userId of chat.mutedUsers) {
                    try {
                        await conn.groupParticipantsUpdate(m.chat, [userId], 'unrestrict');
                    } catch (err) {
                        console.log(`No se pudo desmutear a ${userId}:`, err.message);
                    }
                }
                chat.mutedUsers = [];
            }
            
            return m.reply('🔊 Grupo desmuteado correctamente');
        }

        else if (command === 'mutestatus') {
            // Verificar estado del grupo
            if (!chat.isMute) {
                return m.reply('🔊 El grupo no está muteado');
            }

            if (chat.muteExpire) {
                const ms = chat.muteExpire - Date.now();
                
                if (ms <= 0) {
                    chat.isMute = false;
                    chat.muteExpire = null;
                    await conn.groupSettingUpdate(m.chat, 'not_announcement');
                    
                    // Desmutear usuarios si los hay
                    if (chat.mutedUsers && chat.mutedUsers.length > 0) {
                        for (const userId of chat.mutedUsers) {
                            try {
                                await conn.groupParticipantsUpdate(m.chat, [userId], 'unrestrict');
                            } catch (err) {
                                console.log(`No se pudo desmutear a ${userId}:`, err.message);
                            }
                        }
                        chat.mutedUsers = [];
                    }
                    
                    return m.reply('🔊 El tiempo de mute expiró. Grupo desmuteado');
                }

                // Calcular tiempo restante
                const segundos = Math.floor((ms / 1000) % 60);
                const minutos = Math.floor((ms / (1000 * 60)) % 60);
                const horas = Math.floor((ms / (1000 * 60 * 60)) % 24);
                const dias = Math.floor(ms / (1000 * 60 * 60 * 24));

                let partes = [];
                if (dias > 0) partes.push(`${dias} día(s)`);
                if (horas > 0) partes.push(`${horas} hora(s)`);
                if (minutos > 0) partes.push(`${minutos} minuto(s)`);
                if (segundos > 0) partes.push(`${segundos} segundo(s)`);

                const tiempoRestante = partes.length > 0 ? partes.join(', ') : 'menos de 1 segundo';
                return m.reply(`⏳ Tiempo restante: ${tiempoRestante}`);
            } else {
                return m.reply('🔇 El grupo está muteado indefinidamente');
            }
        }

        // NUEVOS COMANDOS PARA USUARIOS INDIVIDUALES
        else if (command === 'muteuser') {
            if (args.length < 1) {
                return m.reply('❌ Uso: .muteuser @usuario [tiempo]\nEjemplo: .muteuser @usuario 10m');
            }

            const userId = getUserId(args[0], m);
            if (!userId) {
                return m.reply('❌ Usuario no válido. Menciona al usuario o escribe su número');
            }

            // Verificar que el usuario esté en el grupo
            const groupMetadata = await conn.groupMetadata(m.chat);
            const participant = groupMetadata.participants.find(p => p.id === userId);
            if (!participant) {
                return m.reply('❌ El usuario no está en el grupo');
            }

            // Verificar que no sea admin
            if (participant.admin) {
                return m.reply('❌ No puedes mutear a un administrador');
            }

            // Verificar si ya está muteado
            if (chat.userMuteData[userId]) {
                return m.reply('❌ El usuario ya está muteado');
            }

            let duration = null;
            if (args[1]) {
                duration = parseDuration(args[1]);
                if (!duration) {
                    return m.reply('❌ Formato de tiempo incorrecto. Usa: 30s, 10m, 2h, 1d, 1mo');
                }
            }

            try {
                // Mutear al usuario
                await conn.groupParticipantsUpdate(m.chat, [userId], 'restrict');
                
                // Guardar datos del mute
                chat.userMuteData[userId] = {
                    muteTime: Date.now(),
                    muteExpire: duration ? Date.now() + duration : null,
                    mutedBy: m.sender
                };

                if (duration) {
                    // Programar desmute automático
                    const timerKey = `${m.chat}_${userId}`;
                    global.userMuteTimers[timerKey] = setTimeout(async () => {
                        try {
                            await conn.groupParticipantsUpdate(m.chat, [userId], 'unrestrict');
                            delete chat.userMuteData[userId];
                            delete global.userMuteTimers[timerKey];
                            
                            await conn.sendMessage(m.chat, { 
                                text: `🔊 @${userId.split('@')[0]} ha sido desmuteado automáticamente`,
                                mentions: [userId]
                            });
                        } catch (err) {
                            console.log(`Error al desmutear automáticamente a ${userId}:`, err.message);
                        }
                    }, duration);

                    const tiempo = formatTime(args[1]);
                    return m.reply(`🔇 Usuario @${userId.split('@')[0]} muteado por ${tiempo}`, null, { mentions: [userId] });
                } else {
                    return m.reply(`🔇 Usuario @${userId.split('@')[0]} muteado indefinidamente`, null, { mentions: [userId] });
                }

            } catch (error) {
                console.error('Error al mutear usuario:', error);
                return m.reply('❌ Error al mutear al usuario');
            }
        }

        else if (command === 'unmuteuser') {
            if (args.length < 1) {
                return m.reply('❌ Uso: .unmuteuser @usuario\nEjemplo: .unmuteuser @usuario');
            }

            const userId = getUserId(args[0], m);
            if (!userId) {
                return m.reply('❌ Usuario no válido. Menciona al usuario o escribe su número');
            }

            // Verificar si está muteado
            if (!chat.userMuteData[userId]) {
                return m.reply('❌ El usuario no está muteado');
            }

            try {
                // Desmutear al usuario
                await conn.groupParticipantsUpdate(m.chat, [userId], 'unrestrict');
                
                // Limpiar timer si existe
                const timerKey = `${m.chat}_${userId}`;
                if (global.userMuteTimers[timerKey]) {
                    clearTimeout(global.userMuteTimers[timerKey]);
                    delete global.userMuteTimers[timerKey];
                }
                
                // Eliminar datos del mute
                delete chat.userMuteData[userId];
                
                return m.reply(`🔊 Usuario @${userId.split('@')[0]} desmuteado correctamente`, null, { mentions: [userId] });

            } catch (error) {
                console.error('Error al desmutear usuario:', error);
                return m.reply('❌ Error al desmutear al usuario');
            }
        }

        else if (command === 'listmuted') {
            const mutedUsers = Object.keys(chat.userMuteData || {});
            
            if (mutedUsers.length === 0) {
                return m.reply('📝 No hay usuarios muteados en este grupo');
            }

            let message = '📝 *USUARIOS MUTEADOS*\n\n';
            
            for (const userId of mutedUsers) {
                const muteData = chat.userMuteData[userId];
                const username = userId.split('@')[0];
                
                message += `👤 @${username}\n`;
                
                if (muteData.muteExpire) {
                    const ms = muteData.muteExpire - Date.now();
                    
                    if (ms <= 0) {
                        // El mute expiró, desmutear automáticamente
                        try {
                            await conn.groupParticipantsUpdate(m.chat, [userId], 'unrestrict');
                            delete chat.userMuteData[userId];
                            
                            const timerKey = `${m.chat}_${userId}`;
                            if (global.userMuteTimers[timerKey]) {
                                clearTimeout(global.userMuteTimers[timerKey]);
                                delete global.userMuteTimers[timerKey];
                            }
                        } catch (err) {
                            console.log(`Error al desmutear automáticamente a ${userId}:`, err.message);
                        }
                        continue;
                    }

                    // Calcular tiempo restante
                    const segundos = Math.floor((ms / 1000) % 60);
                    const minutos = Math.floor((ms / (1000 * 60)) % 60);
                    const horas = Math.floor((ms / (1000 * 60 * 60)) % 24);
                    const dias = Math.floor(ms / (1000 * 60 * 60 * 24));

                    let partes = [];
                    if (dias > 0) partes.push(`${dias}d`);
                    if (horas > 0) partes.push(`${horas}h`);
                    if (minutos > 0) partes.push(`${minutos}m`);
                    if (segundos > 0) partes.push(`${segundos}s`);

                    const tiempoRestante = partes.length > 0 ? partes.join(' ') : '<1s';
                    message += `⏳ Tiempo restante: ${tiempoRestante}\n\n`;
                } else {
                    message += `♾️ Mute permanente\n\n`;
                }
            }

            return m.reply(message, null, { mentions: mutedUsers });
        }

    } catch (error) {
        console.error('Error en comando mute:', error);
        return m.reply('❌ Error al ejecutar el comando');
    }
};

handler.help = [
    'mute [tiempo]', 
    'unmute', 
    'mutestatus',
    'muteuser @usuario [tiempo]',
    'unmuteuser @usuario',
    'listmuted'
];
handler.tags = ['group'];
handler.command = [
    'mute', 'unmute', 'mutestatus',
    'muteuser', 'unmuteuser', 'listmuted'
];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
