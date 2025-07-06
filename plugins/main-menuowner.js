import moment from 'moment-timezone';

let handler = async (m, { conn, args }) => {
let owner = `
╭─「 👑 *${botname}* 👑 」
│ ¡Hola! ٩(˘◡˘)۶ ✨
│ Comandos de Owners
╰────────────────────

🔑 *GESTIÓN OWNERS*
• #addowner • #delowner
• #codigo

💾 *ARCHIVOS*
• #backup • #copia
• #cleanfiles • #dsowner
• #cleartmp • #vaciartmp
• #deletefile

💰 *ECONOMÍA*
• #addcoins • #añadircoin
• #userpremium • #addprem
• #delprem #remove
• #addexp • #añadirxp
• #removecoin • #quitarcoin
• #deletedatauser • #resetuser
• #removexp • #quitarxp

📢 *COMUNICACIÓN*
• #bcgc • #let
• #reunion • #meeting

🚫 *BANEOS*
• #listban • #banlist
• #banuser • #unbanuser
• #block • #unblock
• #listblock • #blocklist

🤖 *ADMIN AUTO*
• #autoadmin

👥 *GRUPOS*
• #newgc #creargc
• #grouplist • #listgroup
• #join • #invite
• #leave • #salir

🌐 *WEB*
• #get • #fetch
• #plugin • #getplugin

⚙️ *CONFIGURACIÓN*
• #prefix • #resetprefix
• #reiniciar • #restart
• #setbanner • #setavatar
• #setimage • #setpfp
• #setmoneda • #setname
• #setbio • #setstatus
• #update

💾 *COMANDOS CUSTOM*
• #addcmd • #setcmd
• #delcmd • #cmdlist
• #listcmd • #savejs
• #savefile • #saveplugin

╭────────────────────
│ ✨ Usa con responsabilidad
╰────── 👑 OWNER 👑
`.trim();

await conn.sendMessage(m.chat, {
text: owner,
contextInfo: {
externalAdReply: {
title: packname,
body: dev,
thumbnailUrl: icono,
mediaType: 1,
showAdAttribution: true,
renderLargerThumbnail: true
}
}
}, { quoted: m });
};

handler.help = ['mods'];
handler.tags = ['main'];
handler.command = ['dev', 'owners'];
handler.rowner = true;

export default handler;
