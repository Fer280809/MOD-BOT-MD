let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `╔══════════════════════╗
║ 💭 NUEVA SUGERENCIA  ║
╚══════════════════════╝

🤔 ¿Qué comando quieres sugerir?

┌─────────────────────────┐
│ 📝 FORMATO:             │
│                         │
│ ${usedPrefix}${command} [tu idea]      │
│                         │
│ 💡 Describe tu comando  │
│    detalladamente       │
└─────────────────────────┘

✨ ¡Tu creatividad importa! ✨`, m)
    
    if (text.length < 10) return conn.reply(m.chat, `╔═══════════════════════╗
║ ⚠️  SUGERENCIA CORTA  ║
╚═══════════════════════╝

📏 Tu sugerencia es muy corta.

┌─────────────────────────┐
│ 📋 REQUISITOS:          │
│                         │
│ ✅ Mínimo: 10 caracteres │
│ 📊 Actual: ${text.length} caracteres   │
│                         │
│ 💡 Sé más específico    │
│    en tu descripción    │
└─────────────────────────┘

🔄 ¡Inténtalo de nuevo! 🔄`, m)
    
    if (text.length > 1000) return conn.reply(m.chat, `╔═══════════════════════╗
║ 📏 SUGERENCIA LARGA   ║
╚═══════════════════════╝

📊 Tu sugerencia es muy larga.

┌─────────────────────────┐
│ 📋 LÍMITES:             │
│                         │
│ ❌ Máximo: 1000 chars   │
│ 📊 Actual: ${text.length} chars     │
│                         │
│ ✂️  Trata de resumir    │
│    tu idea principal    │
└─────────────────────────┘

🎯 ¡Hazla más concisa! 🎯`, m)
    
    const teks = `╔════════════════════════════╗
║ 💭 NUEVA SUGERENCIA DE     ║
║    COMANDO RECIBIDA        ║
╚════════════════════════════╝

👤 Usuario: *${nombre}*
📅 Fecha: ${new Date().toLocaleDateString('es-ES')}
🕐 Hora: ${new Date().toLocaleTimeString('es-ES')}

┌────────────────────────────┐
│ 💡 COMANDO SUGERIDO:       │
└────────────────────────────┘

📝 ${text}

┌────────────────────────────┐
│ 📊 ESTADÍSTICAS:           │
│                            │
│ 📏 Longitud: ${text.length} caracteres │
│ 🎯 Estado: Pendiente       │
│ 🔍 Revisión: En proceso    │
└────────────────────────────┘

⭐ ¡Gracias por tu contribución! ⭐`
    
    await conn.reply(`${suittag}@s.whatsapp.net`, m.quoted ? teks + m.quoted.text : teks, m, { mentions: conn.parseMention(teks) })

    m.reply(`╔══════════════════════╗
║ ✅ ENVIADO CON ÉXITO ║
╚══════════════════════╝

🚀 Tu sugerencia fue enviada 
   a mi propietario.

┌─────────────────────────┐
│ 📋 PRÓXIMOS PASOS:      │
│                         │
│ 🔍 Será revisada        │
│ 💡 Evaluada su viabilidad│
│ ⚡ Implementada si es    │
│    factible             │
└─────────────────────────┘

🎉 ¡Gracias por tu idea! 🎉`)
}
handler.help = ['newcommand']
handler.tags = ['info']
handler.command = ['newcommand', 'sug']

export default handler
