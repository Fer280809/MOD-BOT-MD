export async function before(m) {
  if (!m.text || !global.prefix.test(m.text)) return;
  
  const usedPrefix = global.prefix.exec(m.text)[0];
  const command = m.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase();
  
  // Emojis ultra llamativos
  const emojis = {
    fire: '🔥',
    lightning: '⚡',
    boom: '💥',
    rocket: '🚀',
    crown: '👑',
    diamond: '💎',
    gem: '💠',
    star: '⭐',
    sparkle: '✨',
    shield: '🛡️',
    sword: '⚔️',
    target: '🎯',
    banned: '🚫',
    lock: '🔒',
    unlock: '🔓',
    key: '🔑',
    warning: '⚠️',
    error: '❌',
    success: '✅',
    info: '💡',
    search: '🔍',
    menu: '📋',
    help: '🆘',
    tip: '💡',
    magic: '🪄',
    trophy: '🏆',
    medal: '🏅',
    vip: '🌟',
    premium: '👑',
    legendary: '🔱',
    epic: '⚡',
    rare: '💎',
    special: '🎖️',
    admin: '👑',
    user: '👤',
    bot: '🤖',
    skull: '💀',
    ghost: '👻',
    alien: '👽',
    robot: '🤖',
    gear: '⚙️',
    settings: '🔧',
    power: '🔋',
    signal: '📡',
    wifi: '📶',
    phone: '📱',
    computer: '💻',
    game: '🎮',
    joystick: '🕹️',
    dice: '🎲',
    party: '🎉',
    confetti: '🎊',
    balloon: '🎈',
    gift: '🎁',
    present: '🎀',
    cake: '🎂',
    candy: '🍭',
    cookie: '🍪',
    donut: '🍩',
    pizza: '🍕',
    burger: '🍔',
    fries: '🍟',
    drink: '🥤',
    coffee: '☕',
    tea: '🍵',
    beer: '🍺',
    wine: '🍷',
    cocktail: '🍸',
    tropical: '🍹',
    bottle: '🍾',
    glasses: '🥂',
    cheers: '🍻'
  };
  
  const validCommand = (cmd, plugins) => {
    return Object.values(plugins).some(plugin => {
      if (!plugin.command) return false;
      const commands = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
      return commands.includes(cmd);
    });
  };
  
  if (!command || command === "bot") return;
  
  if (validCommand(command, global.plugins)) {
    let chat = global.db.data.chats[m.chat];
    let user = global.db.data.users[m.sender];
    
    if (chat.isBanned) {
      const aviso = `
╔═══════════════════════╗
║ ${emojis.banned}${emojis.lock} BOT BLOQUEADO ${emojis.lock}${emojis.banned} ║
╚═══════════════════════╝

${emojis.skull}${emojis.fire} ¡ACCESO DENEGADO! ${emojis.fire}${emojis.skull}

╭─────────────────────╮
│ ${emojis.robot} **${botname}** ${emojis.robot}          │
│ ${emojis.warning} **DESACTIVADO** ${emojis.warning}     │
│                     │
│ ${emojis.key} **REACTIVAR:**     │
│ ${emojis.rocket} \`${usedPrefix}bot on\`   │
│ ${emojis.admin} *Solo admins* ${emojis.admin}   │
╰─────────────────────╯

${emojis.sword}═══════════════════${emojis.sword}

${emojis.boom}${emojis.fire}${emojis.lightning}${emojis.crown}${emojis.diamond}${emojis.skull}${emojis.ghost}${emojis.alien}${emojis.robot}${emojis.gear}${emojis.settings}${emojis.power}${emojis.signal}${emojis.wifi}${emojis.phone}${emojis.computer}${emojis.game}${emojis.joystick}${emojis.dice}${emojis.party}${emojis.confetti}${emojis.balloon}${emojis.gift}${emojis.present}${emojis.cake}${emojis.candy}${emojis.cookie}${emojis.donut}${emojis.pizza}${emojis.burger}${emojis.fries}${emojis.drink}${emojis.coffee}${emojis.tea}${emojis.beer}${emojis.wine}${emojis.cocktail}${emojis.tropical}${emojis.bottle}${emojis.glasses}${emojis.cheers}`;
      
      await m.reply(aviso);
      return;
    }
    
    user.commands = (user.commands || 0) + 1;
  } else {
    const cmd = m.text.trim().split(' ')[0];
    
    const errorMsg = `
╔═══════════════════════╗
║ ${emojis.error}${emojis.boom} COMANDO INVÁLIDO ${emojis.boom}${emojis.error} ║
╚═══════════════════════╝

${emojis.skull}${emojis.fire} ¡COMANDO NO EXISTE! ${emojis.fire}${emojis.skull}

╭─────────────────────╮
│ ${emojis.search} **COMANDO:**       │
│ ${emojis.target} **${cmd}** ${emojis.ghost}           │
│                     │
│ ${emojis.error} **NO ENCONTRADO** ${emojis.error}  │
╰─────────────────────╯

${emojis.sword}═══════════════════${emojis.sword}

╭─────────────────────╮
│ ${emojis.menu} **VER COMANDOS** ${emojis.menu}   │
│                     │
│ ${emojis.rocket} \`#help\` ${emojis.magic}        │
│ ${emojis.lightning} \`#menu\` ${emojis.sparkle}        │
│                     │
│ ${emojis.tip} **¡Revisa escritura!** │
╰─────────────────────╯

${emojis.fire}${emojis.lightning}${emojis.crown} **¡GUERRERO VIP!** ${emojis.crown}${emojis.lightning}${emojis.fire}

${emojis.sword}═══════════════════${emojis.sword}

${emojis.boom}${emojis.fire}${emojis.lightning}${emojis.crown}${emojis.diamond}${emojis.skull}${emojis.ghost}${emojis.alien}${emojis.robot}${emojis.gear}${emojis.settings}${emojis.power}${emojis.signal}${emojis.wifi}${emojis.phone}${emojis.computer}${emojis.game}${emojis.joystick}${emojis.dice}${emojis.party}${emojis.confetti}${emojis.balloon}${emojis.gift}${emojis.present}${emojis.cake}${emojis.candy}${emojis.cookie}${emojis.donut}${emojis.pizza}${emojis.burger}${emojis.fries}${emojis.drink}${emojis.coffee}${emojis.tea}${emojis.beer}${emojis.wine}${emojis.cocktail}${emojis.tropical}${emojis.bottle}${emojis.glasses}${emojis.cheers}`;
    
    await m.reply(errorMsg);
  }
}
