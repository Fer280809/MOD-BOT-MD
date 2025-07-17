import moment from 'moment-timezone';
let handler = async (m, { conn, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
    let user = global.db.data.users[userId];
    let name = conn.getName(userId);
    let _uptime = process.uptime() * 1000;
    let uptime = clockString(_uptime);
    let totalreg = Object.keys(global.db.data.users).length;
    let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length;
    
    let txt = `
╔═══════════════════════╗
║    🌸✨ 𝐆𝐀𝐂𝐇𝐀 ✨🌸    ║
║   ¡𝑪𝒐𝒍𝒆𝒄𝒄𝒊𝒐𝒏𝒂 𝒘𝒂𝒊𝒇𝒖𝒔!   ║
╚═══════════════════════╝
┌─── 🎲 𝐁Á𝐒𝐈𝐂𝐎 ───┐
│ 🎯 #rollwaifu #rw
│    └ Gacha aleatoria
│ ⭐ #claim #c  
│    └ Reclamar waifu
│ 💕 #harem #waifus
│    └ Ver colección
│ 🖼️ #charimage #wimage
│    └ Imagen de personaje
│ ℹ️ #charinfo #winfo
│    └ Info de personaje
│ 🎁 #givechar #regalar
│    └ Regalar personaje
│ 🗳️ #vote #votar
│    └ Votar por waifu
│ 🏆 #waifustop #topwaifus
│    └ Top de waifus
└─────────────────────
┌─── 🏪 𝐌𝐄𝐑𝐂𝐀𝐃𝐎 ───┐
│ 💳 #comprar #buy
│    └ Comprar waifu
│ 📋 #mercado #market
│    └ Ver mercado
└─────────────────────
┌─── 💰 𝐕𝐄𝐍𝐓𝐀𝐒 ───┐
│ 📦 #misventas #ventas
│    └ Mis waifus en venta
│ 💲 #cambiarprecio
│    └ Cambiar precio
│ ❌ #quitarventa
│    └ Quitar de venta
│ ⚡ #editarventas
│    └ Edición masiva
│   • bajar <porcentaje>
│   • subir <cantidad>
│   • fijar <precio>
└─────────────────────
┌─── 🎨 𝐄𝐗𝐓𝐑𝐀 ───┐
│ 🌸 #waifu
│    └ Waifu aleatoria
└─────────────────────
> ✨ ¡Colecciona, comercia y 
> conviértete en el mejor!
> 💡 Usa #help [comando] para
> más detalles específicos
    `.trim();
    
    await conn.sendMessage(m.chat, { 
        image: { url: 'https://files.catbox.moe/usbgye.jpg' },
        caption: txt,
        contextInfo: {
            mentionedJid: [m.sender, userId],
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: channelRD.id,
                newsletterName: channelRD.name,
                serverMessageId: -1,
            },
            forwardingScore: 999,
            externalAdReply: {
                title: "🌸 Sistema Gacha",
                body: "¡Colecciona waifus y husbandos!",
                thumbnailUrl: banner,
                mediaType: 1,
                showAdAttribution: true,
                renderLargerThumbnail: true,
            },
        },
    }, { quoted: m });
};
handler.help = ['gachamenu'];
handler.tags = ['gacha'];
handler.command = ['gachamenu', 'menuwaifus', 'waifumenu', 'gachahelp'];
export default handler;
function clockString(ms) {
    let seconds = Math.floor((ms / 1000) % 60);
    let minutes = Math.floor((ms / (1000 * 60)) % 60);
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return `${hours}h ${minutes}m ${seconds}s`;
}
