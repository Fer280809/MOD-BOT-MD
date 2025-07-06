const handler = async (m, { conn }) => {
  // URL de imagen para la tienda de clanes
  const storeImage = 'https://files.catbox.moe/1qyi09.webp'
  
  let menu = `
  
╭━━━[ 🏪 𝗧𝗜𝗘𝗡𝗗𝗔 𝗗𝗘 𝗖𝗟𝗔𝗡𝗘𝗦 ]━━━╮
*⚔️ Armas disponibles:*
• espada      - Ataque +5    ($500)
• lanza       - Ataque +8    ($800)
• arco        - Ataque +7    ($700)
• hacha       - Ataque +10   ($1000)
• escudo      - Defensa +7   ($700)
• catapulta   - Ataque +20   ($2500)
*💎 Ítems especiales:*
• pocionvida  - Cura soldados ($400)
• escudomax   - Escudo clan  ($1500)
• trampa      - Trampa rival ($1000)
• boostxp     - +30% exp     ($1000)
Comandos:
• .clancomprararma <arma>
• .clancompraritem <item>
• .claninventario
╰━━━━━━━━━━━━━━━━━━━━━╯
`

  try {
    // Enviar imagen con el menú como caption
    await conn.sendMessage(m.chat, {
      image: { url: storeImage },
      caption: menu.trim(),
      viewOnce: false
    }, { quoted: m })
  } catch {
    try {
      // Método alternativo con sendFile
      await conn.sendFile(m.chat, storeImage, 'tienda.webp', menu.trim(), m, false)
    } catch {
      // Como último recurso, enviar solo texto
      return m.reply(menu.trim())
    }
  }
}

handler.help = ['clantienda', 'tiendaclan']
handler.tags = ['clan']
handler.command = ['clantienda', 'tiendaclan']
export default handler