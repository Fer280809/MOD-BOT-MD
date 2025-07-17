import db from '../lib/database.js'
import fs from 'fs'
import PhoneNumber from 'awesome-phonenumber'
import { createHash } from 'crypto'  
import fetch from 'node-fetch'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

let handler = async function (m, { conn, text, usedPrefix, command }) {
  // Emojis y símbolos ultra llamativos
  const emojis = {
    fire: '🔥',
    lightning: '⚡',
    crown: '👑',
    diamond: '💎',
    gem: '💠',
    star: '⭐',
    sparkle: '✨',
    boom: '💥',
    rocket: '🚀',
    trophy: '🏆',
    medal: '🏅',
    shield: '🛡️',
    sword: '⚔️',
    magic: '🪄',
    target: '🎯',
    winner: '🏆',
    vip: '🌟',
    exclusive: '💫',
    premium: '👑',
    legendary: '🔱',
    epic: '⚡',
    rare: '💎',
    special: '🎖️',
    verified: '✅',
    success: '✓',
    error: '❌',
    warning: '⚠️',
    user: '👤',
    id: '🆔',
    age: '🗓️',
    coin: '🪙',
    exp: '✨',
    token: '🎫',
    key: '🔑',
    lock: '🔒',
    unlock: '🔓',
    gift: '🎁',
    surprise: '🎉',
    party: '🎊',
    scroll: '📜',
    certificate: '📝'
  };

  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let mentionedJid = [who]
  let pp = await conn.profilePictureUrl(who, 'image').catch((_) => 'https://files.catbox.moe/xr2m6u.jpg')
  let user = global.db.data.users[m.sender]
  let name2 = conn.getName(m.sender)
  
  // Mensaje si ya está registrado - optimizado para móvil
  if (user.registered === true) {
    return m.reply(`
╔═══════════════════════╗
║ ${emojis.warning}${emojis.shield} DENEGADO ${emojis.shield}${emojis.warning} ║
╚═══════════════════════╝

${emojis.fire} ¡YA ERES VIP! ${emojis.fire}

${emojis.legendary} Cuenta activa
${emojis.premium} Estatus: VIP
${emojis.rocket} Reiniciar: *${usedPrefix}unreg*

${emojis.sword}═══════════════════${emojis.sword}

${emojis.boom}${emojis.fire}${emojis.lightning}${emojis.crown}${emojis.diamond}${emojis.trophy}${emojis.magic}${emojis.sparkle}${emojis.verified}${emojis.premium}${emojis.legendary}${emojis.epic}${emojis.rare}${emojis.special}${emojis.vip}${emojis.shield}${emojis.sword}${emojis.target}${emojis.gift}${emojis.gem}${emojis.star}${emojis.rocket}
`)
  }
  
  // Verificación de formato - optimizado para móvil
  if (!Reg.test(text)) {
    return m.reply(`
╔═══════════════════════╗
║ ${emojis.error}${emojis.target} FORMATO MAL ${emojis.target}${emojis.error} ║
╚═══════════════════════╝

${emojis.boom} ¡DATOS INVÁLIDOS! ${emojis.boom}

${emojis.key} **USO CORRECTO:**
${emojis.rocket} \`${usedPrefix + command} nombre.edad\`

${emojis.lightning} **EJEMPLO:**
${emojis.fire} \`${usedPrefix + command} ${name2}.18\`

${emojis.sword}═══════════════════${emojis.sword}

${emojis.boom}${emojis.fire}${emojis.lightning}${emojis.crown}${emojis.diamond}${emojis.trophy}${emojis.magic}${emojis.sparkle}${emojis.verified}${emojis.premium}${emojis.legendary}${emojis.epic}${emojis.rare}${emojis.special}${emojis.vip}${emojis.shield}${emojis.sword}${emojis.target}${emojis.gift}${emojis.gem}${emojis.star}${emojis.rocket}
`)
  }
  
  let [_, name, splitter, age] = text.match(Reg)
  
  // Validaciones más épicas y compactas
  if (!name) return m.reply(`${emojis.error}${emojis.boom} **¡NOMBRE REQUERIDO!** ${emojis.fire}${emojis.lightning}${emojis.crown}${emojis.diamond}${emojis.trophy}${emojis.magic}${emojis.sparkle}${emojis.verified}${emojis.premium}${emojis.legendary}${emojis.epic}${emojis.rare}${emojis.special}${emojis.vip}${emojis.shield}${emojis.sword}${emojis.target}${emojis.gift}${emojis.gem}${emojis.star}${emojis.rocket}`)
  if (!age) return m.reply(`${emojis.error}${emojis.boom} **¡EDAD REQUERIDA!** ${emojis.fire}${emojis.lightning}${emojis.crown}${emojis.diamond}${emojis.trophy}${emojis.magic}${emojis.sparkle}${emojis.verified}${emojis.premium}${emojis.legendary}${emojis.epic}${emojis.rare}${emojis.special}${emojis.vip}${emojis.shield}${emojis.sword}${emojis.target}${emojis.gift}${emojis.gem}${emojis.star}${emojis.rocket}`)
  if (name.length >= 100) return m.reply(`${emojis.error}${emojis.boom} **¡NOMBRE MUY LARGO!** ${emojis.fire}${emojis.lightning}${emojis.crown}${emojis.diamond}${emojis.trophy}${emojis.magic}${emojis.sparkle}${emojis.verified}${emojis.premium}${emojis.legendary}${emojis.epic}${emojis.rare}${emojis.special}${emojis.vip}${emojis.shield}${emojis.sword}${emojis.target}${emojis.gift}${emojis.gem}${emojis.star}${emojis.rocket}`)
  
  age = parseInt(age)
  if (age > 1000) return m.reply(`${emojis.error}${emojis.boom} **¡OYE INMORTAL!** ¿${age} años? ${emojis.fire}${emojis.lightning}${emojis.crown}${emojis.diamond}${emojis.trophy}${emojis.magic}${emojis.sparkle}${emojis.verified}${emojis.premium}${emojis.legendary}${emojis.epic}${emojis.rare}${emojis.special}${emojis.vip}${emojis.shield}${emojis.sword}${emojis.target}${emojis.gift}${emojis.gem}${emojis.star}${emojis.rocket}`)
  if (age < 5) return m.reply(`${emojis.error}${emojis.boom} **¡BEBÉ GENIO!** ¿${age} años? ${emojis.rocket}${emojis.fire}${emojis.lightning}${emojis.crown}${emojis.diamond}${emojis.trophy}${emojis.magic}${emojis.sparkle}${emojis.verified}${emojis.premium}${emojis.legendary}${emojis.epic}${emojis.rare}${emojis.special}${emojis.vip}${emojis.shield}${emojis.sword}${emojis.target}${emojis.gift}${emojis.gem}${emojis.star}`)
  
  // Registro del usuario
  user.name = name + emojis.verified
  user.age = age
  user.regTime = + new Date      
  user.registered = true
  
  // Recompensas ÉPICAS
  const rewards = {
    coin: 50,
    exp: 500,
    joincount: 30
  };
  
  global.db.data.users[m.sender].coin += rewards.coin
  global.db.data.users[m.sender].exp += rewards.exp
  global.db.data.users[m.sender].joincount += rewards.joincount
  
  // Generar código único de registro
  let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)
  
  // Mensaje de verificación ULTRA ÉPICO optimizado para móvil
  let regbot = `
╔═══════════════════════╗
║ ${emojis.crown}${emojis.fire} VERIFICADO ${emojis.fire}${emojis.crown} ║
╚═══════════════════════╝

${emojis.rocket}${emojis.lightning} ¡BIENVENIDO HERMANO! ${emojis.lightning}${emojis.rocket}

╭─────────────────────╮
│ ${emojis.legendary} PERFIL GUERRERO ${emojis.legendary} │
│                     │
│ ${emojis.user} **${name}** ${emojis.verified}        │
│ ${emojis.age} **${age} años** ${emojis.fire}       │
│ ${emojis.id} **${sn.substring(0, 8)}...** │
│ ${emojis.certificate} **VIP ACTIVO** ${emojis.premium}  │
╰─────────────────────╯

${emojis.sword}═══════════════════${emojis.sword}

╭─────────────────────╮
│ ${emojis.gift} RECOMPENSAS ${emojis.gift} │
│                     │
│ ${emojis.coin} **+${rewards.coin}** Monedas ${emojis.boom}   │
│ ${emojis.exp} **+${rewards.exp}** XP ${emojis.rocket}       │
│ ${emojis.token} **+${rewards.joincount}** Tokens ${emojis.lightning}   │
│                     │
│ ${emojis.trophy} **VIP DESBLOQUEADO** ${emojis.trophy} │
╰─────────────────────╯

${emojis.magic}${emojis.sparkle}${emojis.diamond}${emojis.sparkle}${emojis.magic}${emojis.sparkle}${emojis.diamond}${emojis.sparkle}${emojis.magic}

╭─────────────────────╮
│ ${emojis.scroll} CÓDIGO SEGURO ${emojis.shield} │
│                     │
│ \`${sn.substring(0, 16)}\` │
│                     │
│ ${emojis.warning} **¡GUÁRDALO!** ${emojis.warning}     │
│ ${emojis.key} Para recuperar     │
╰─────────────────────╯

${emojis.fire}${emojis.lightning}${emojis.crown} **¡GUERRERO VIP!** ${emojis.crown}${emojis.lightning}${emojis.fire}

${emojis.sword}═══════════════════${emojis.sword}

${emojis.boom}${emojis.rocket}${emojis.trophy}${emojis.diamond}${emojis.fire}${emojis.lightning}${emojis.crown}${emojis.magic}${emojis.sparkle}${emojis.verified}${emojis.premium}${emojis.legendary}${emojis.epic}${emojis.rare}${emojis.special}${emojis.vip}${emojis.exclusive}${emojis.winner}${emojis.medal}${emojis.shield}${emojis.sword}${emojis.target}${emojis.gift}${emojis.surprise}${emojis.party}${emojis.gem}${emojis.star}${emojis.sparkle}${emojis.boom}`;
  
  // Secuencia de reacciones épicas
  const reactionSequence = [
    emojis.rocket,
    emojis.boom,
    emojis.fire,
    emojis.crown,
    emojis.trophy,
    emojis.diamond,
    emojis.verified
  ];
  
  for (const emoji of reactionSequence) {
    await m.react(emoji);
    await new Promise(resolve => setTimeout(resolve, 400));
  }

  // Enviar mensaje con contexto ULTRA llamativo
  await conn.sendMessage(m.chat, {
    text: regbot,
    contextInfo: {
      externalAdReply: {
        title: `${emojis.crown}${emojis.fire}${emojis.lightning} VIP VERIFICADO ${emojis.lightning}${emojis.fire}${emojis.crown}`,
        body: `${emojis.rocket}${emojis.boom}${emojis.trophy} ¡${name} es ahora GUERRERO ÉLITE! ${emojis.trophy}${emojis.boom}${emojis.rocket}`,
        thumbnailUrl: pp,
        sourceUrl: global.channel || 'https://whatsapp.com',
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
}; 

handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar'] 

export default handler
