var handler = async (m, { conn, text, usedPrefix, command }) => {
    let user, number, bot, bant, ownerNumber, aa, users, usr

    try {
        function no(number) {
            return number.replace(/\s/g, '').replace(/([@+-])/g, '')
        }
        text = no(text)
        number = isNaN(text) ? text.split`@`[1] : text
        user = conn.user.jid.split`@`[0] + '@s.whatsapp.net'
        bot = conn.user.jid.split`@`[0]
        bant = `╔══════════════════════╗
║ 🚫 COMANDO BAN USER  ║
╚══════════════════════╝

⚠️ Debes especificar un usuario para banear.

┌─────────────────────────┐
│ 📋 MÉTODOS VÁLIDOS:     │
│                         │
│ 👥 Etiquetar: @usuario  │
│ 📱 Número: +1234567890  │
│ 💬 Responder a mensaje  │
└─────────────────────────┘

💡 Ejemplo: *${usedPrefix}${command} @usuario*

⚡ ¡Especifica el usuario! ⚡`
        const nn = conn.getName(m.sender)
        if (!text && !m.quoted) return conn.reply(m.chat, bant, m, { mentions: [user] })
        
        if (text) {
            user = number + '@s.whatsapp.net'
        } else if (m.quoted.sender) {
            user = m.quoted.sender
        } else if (m.mentionedJid) {
            user = number + '@s.whatsapp.net'
        }

        number = user.split('@')[0]
        if (user === conn.user.jid) return conn.reply(m.chat, `╔═══════════════════════╗
║ 🤖 AUTOPROTECCIÓN     ║
╚═══════════════════════╝

🛡️ No puedo banearme a mí mismo.

┌─────────────────────────┐
│ ⚠️  SISTEMA PROTEGIDO:  │
│                         │
│ 🤖 @${bot} está protegido │
│    contra auto-baneo    │
│                         │
│ 🔐 Medida de seguridad  │
│    del sistema          │
└─────────────────────────┘

🚨 ¡Operación denegada! 🚨`, m, { mentions: [user] })

        for (let i = 0; i < global.owner.length; i++) {
            ownerNumber = global.owner[i][0]
            if (user.replace(/@s\.whatsapp\.net$/, '') === ownerNumber) {
                aa = ownerNumber + '@s.whatsapp.net'
                await conn.reply(m.chat, `╔═══════════════════════╗
║ 👑 PROPIETARIO        ║
║    PROTEGIDO          ║
╚═══════════════════════╝

🛡️ No puedo banear al propietario.

┌─────────────────────────┐
│ 👑 PROPIETARIO:         │
│    @${ownerNumber}              │
│                         │
│ 🤖 Bot: *${botname}*        │
│                         │
│ 🔐 Máxima protección    │
│    del sistema          │
└─────────────────────────┘

⚡ ¡Operación denegada! ⚡`, m, { mentions: [aa] })
                return
            }
        }

        users = global.db.data.users
        if (!users[user]) {
            users[user] = { banned: false }
        }
        if (users[user].banned === true) return conn.reply(m.chat, `╔═══════════════════════╗
║ ⚠️  USUARIO YA        ║
║    BANEADO            ║
╚═══════════════════════╝

🚫 El usuario ya está baneado.

┌─────────────────────────┐
│ 👤 Usuario: @${number}      │
│                         │
│ 📊 Estado: BANEADO      │
│ 🕐 Desde: Anteriormente │
│                         │
│ ❌ No requiere acción   │
└─────────────────────────┘

✅ ¡Ya está restringido! ✅`, m, { mentions: [user] })

        users[user].banned = true
        usr = m.sender.split('@')[0]
        await conn.reply(m.chat, `╔══════════════════════╗
║ ✅ USUARIO BANEADO   ║
╚══════════════════════╝

🚫 Usuario baneado exitosamente.

┌─────────────────────────┐
│ 📊 DETALLES DEL BAN:    │
│                         │
│ 👤 Usuario: @${number}      │
│ 👮 Moderador: ${nn}     │
│ 📅 Fecha: ${new Date().toLocaleDateString('es-ES')} │
│ 🕐 Hora: ${new Date().toLocaleTimeString('es-ES')}  │
│                         │
│ 🚫 Estado: BANEADO      │
│ ⚡ Efecto: INMEDIATO     │
└─────────────────────────┘

🎯 ¡Acción completada! 🎯`, m, { mentions: [user] })
        let nametag = conn.getName(user)
        
        // Mensaje al propietario principal
        await conn.reply(`${suittag}@s.whatsapp.net`, `╔═══════════════════════════╗
║ 🚨 NOTIFICACIÓN DE BAN    ║
╚═══════════════════════════╝

⚠️ Se ha ejecutado un baneo.

┌───────────────────────────┐
│ 📋 REPORTE DE MODERACIÓN: │
└───────────────────────────┘

👤 Usuario Baneado: *${nametag}*
👮 Moderador: *${nn}*
🤖 Bot: *${botname}*

┌───────────────────────────┐
│ 📊 INFORMACIÓN ADICIONAL: │
│                           │
│ 📅 Fecha: ${new Date().toLocaleDateString('es-ES')}        │
│ 🕐 Hora: ${new Date().toLocaleTimeString('es-ES')}         │
│ 🎯 Acción: Baneo Global   │
│ ⚡ Estado: Activo         │
└───────────────────────────┘

🔥 ¡Sistema de moderación! 🔥`, m)

        // Mensaje al número específico 524181450063
        await conn.reply(`5214181450063@s.whatsapp.net`, `╔═══════════════════════════╗
║ 🚨 ALERTA DE BANEO        ║
╚═══════════════════════════╝

⚡ Se ha baneado un usuario.

┌───────────────────────────┐
│ 🎯 DETALLES DEL BANEO:    │
└───────────────────────────┘

👤 Usuario: *${nametag}*
📱 Número: +${number}
👮 Baneado por: *${nn}*
🤖 Bot: *${botname}*

┌───────────────────────────┐
│ 📊 DATOS TEMPORALES:      │
│                           │
│ 📅 Fecha: ${new Date().toLocaleDateString('es-ES')}        │
│ 🕐 Hora: ${new Date().toLocaleTimeString('es-ES')}         │
│ 🌐 Servidor: Activo       │
│ 🚫 Restricción: Global    │
└───────────────────────────┘

🔥 ¡Notificación automática! 🔥`, m)
    } catch (e) {
        await conn.reply(m.chat, `╔══════════════════════╗
║ ❌ ERROR DEL SISTEMA ║
╚══════════════════════╝

🚨 Ocurrió un error inesperado.

┌─────────────────────────┐
│ 🔧 INFORMACIÓN TÉCNICA: │
│                         │
│ ⚠️  Error procesando    │
│    comando de baneo     │
│                         │
│ 🔄 Intenta nuevamente   │
│    en unos momentos     │
│                         │
│ 📞 Si persiste, contacta│
│    al administrador     │
└─────────────────────────┘

💫 ¡Reinténtalo pronto! 💫`, m)
    }
}

handler.help = ['banuser <@tag> <razón>']
handler.command = ['banuser']
handler.tags = ['mods']
handler.rowner = true

export default handler


