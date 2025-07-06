const handler = async (m, { conn }) => {
    // URL de imagen para el menú de clanes
    const clanImage = 'https://files.catbox.moe/0jnth1.jpg'
    
    let msg = `
╭━━━[ 🤝 𝗠𝗘𝗡𝗨 𝗗𝗘 𝗖𝗟𝗔𝗡𝗘𝗦 ]━━━╮

*👑 Gestión de clanes*
• .crearclan <nombre>
• .unirclan <nombre>
• .salirclan
• .eliminarclan
• .expulsarclan @usuario
• .clantransferirpropiedad @usuario

*👥 Información y miembros*
• .miembrosclan
• .clanes
• .estadisticasclan
• .misclanes
• .fondoclan
• .topclanes
• .claninfo <nombre>
• .clanobjetivos
• .clanlogros
• .clanveraliados

*⚔️ Batallas y retos*
• .retarclan <nombre>
• .aceptarbatalla
• .clanhistorialbatallas
• .clanmisiones
• .clancompletarmision <id>
• .claneventoglobal

*🩹 Soldados, armas e inventario*
• .harem [@usuario] [pagina]
• .curar <id>
• .curarclan
• .claninventario
• .clantienda
• .clancomprararma <arma>
• .clancompraritem <item>
• .clanusaritem <item>
• .clanregalaitem @usuario <item>
• .clanregalaclan <clan> <item>
• .clanregalardinero @usuario <cantidad>
• .clanregalarexp @usuario <cantidad>

*💰 Economía y mejoras*
• .donarclan <cantidad>
• .mejorarclan

*🔒 Protección y diplomacia*
• .clanajustarescudo on/off
• .clanaliar <nombre-clan>
• .clanromperalianza
• .clansolicitudalianza <clan>
• .clanaceptarsolicitudalianza
• .clanrechazarsolicitudalianza

*🧑‍⚖️ Moderación y reportes*
• .clanadmins @usuario
• .clanremoveradmin @usuario
• .clanexpulsarinactivos
• .claninactivos
• .clanreportar @usuario <motivo>
• .clanverreportes
• .clanlimpiarreportes
• .clanexpulsarvotacion @usuario

*🗳️ Votaciones y anuncios*
• .clanvotacion <tema>
• .clanvotar <opcion>
• .clancancelarvotacion

*🎤 Chat y anuncios internos*
• .clanchat <mensaje>
• .clanmotd <mensaje>
• .clanvermotd

*🖼️ Personalización*
• .clanfoto <link>
• .clanlogo <link>
• .clandescripcion <texto>
╰━━━━━━━━━━━━━━━━━━━╯`

    try {
        // Enviar imagen con el menú como caption
        await conn.sendMessage(m.chat, {
            image: { url: clanImage },
            caption: msg.trim(),
            viewOnce: false
        }, { quoted: m })
    } catch {
        try {
            // Método alternativo con sendFile
            await conn.sendFile(m.chat, clanImage, 'clan.jpg', msg.trim(), m, false)
        } catch {
            // Como último recurso, enviar solo texto
            return m.reply(msg.trim())
        }
    }
}

handler.help = ['menuclan', 'clanmenu', 'clanesmenu']
handler.tags = ['clan']
handler.command = ['menuclan', 'clanmenu', 'clanesmenu']
export default handler