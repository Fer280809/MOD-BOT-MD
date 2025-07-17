import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;
  
  const fkontak = { 
    "key": { 
      "participants":"0@s.whatsapp.net", 
      "remoteJid": "status@broadcast", 
      "fromMe": false, 
      "id": "Halo" 
    }, 
    "message": { 
      "contactMessage": { 
        "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` 
      }
    }, 
    "participant": "0@s.whatsapp.net"
  }
  
  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')
  let img = await (await fetch(`${pp}`)).buffer()
  let chat = global.db.data.chats[m.chat]
  
  // Títulos rediseñados más llamativos
  let txt = '🔥⚡ NUEVO GUERRERO ⚡🔥'
  let txt1 = '💀⚔️ SOLDADO CAÍDO ⚔️💀'
  
  let groupSize = participants.length
  if (m.messageStubType == 27) {
    groupSize++;
  } else if (m.messageStubType == 28 || m.messageStubType == 32) {
    groupSize--;
  }
  
  // Mensaje de bienvenida rediseñado
  if (chat.welcome && m.messageStubType == 27) {
    let bienvenida = `
╔══════════════════════════╗
║  🔥⚡ BIENVENIDO HERMANO ⚡🔥  ║
╚══════════════════════════╝

👑 ¡UN NUEVO GUERRERO HA LLEGADO! 👑

🎯 SOLDADO: @${m.messageStubParameters[0].split`@`[0]}
🏰 FORTALEZA: ${groupMetadata.subject}
⚔️ EJÉRCITO: ${groupSize} guerreros

━━━━━━━━━━━━━━━━━━━━━━━━━━━

💪 REGLAS DEL CAMPO DE BATALLA:
🔹 Lee las reglas en la descripción 
🔹 Respeta a tus compañeros de armas
🔹 Mantén el honor del grupo
🔹 Lucha con valentía y honor

⚡ ¡PREPÁRATE PARA LA BATALLA! ⚡

🔥 BIENVENIDO AL ESCUADRÓN 🔥
━━━━━━━━━━━━━━━━━━━━━━━━━━━

${global.welcom2 || ''}
`
    await conn.sendMini(m.chat, txt, dev, bienvenida, img, img, redes, fkontak)
  }
  
  // Mensaje de despedida rediseñado
  if (chat.welcome && (m.messageStubType == 28 || m.messageStubType == 32)) {
    let bye = `
╔══════════════════════════╗
║  💀⚔️ SOLDADO ELIMINADO ⚔️💀  ║
╚══════════════════════════╝

⚡ ¡UN GUERRERO HA CAÍDO! ⚡

🎯 SOLDADO CAÍDO: @${m.messageStubParameters[0].split`@`[0]}
🏰 FORTALEZA: ${groupMetadata.subject}
⚔️ EJÉRCITO: ${groupSize} guerreros restantes

━━━━━━━━━━━━━━━━━━━━━━━━━━━

💀 EL CAMPO DE BATALLA HABLA:
🔸 Un soldado menos en nuestras filas
🔸 Que su partida fortalezca al grupo
🔸 Los cobardes no merecen estar aquí
🔸 Solo los valientes permanecen

⚔️ ¡LA BATALLA CONTINÚA! ⚔️

🔥 EL ESCUADRÓN SIGUE FUERTE 🔥
━━━━━━━━━━━━━━━━━━━━━━━━━━━

${global.welcom2 || ''}
`
    await conn.sendMini(m.chat, txt1, dev, bye, img, img, redes, fkontak)
  }
}
