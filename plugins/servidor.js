import moment from 'moment-timezone';
let handler = async (m, { conn, args }) => {
let owner = `

*PROXIMAMENTE EL 1 DE AGOSTO DEL 2025*                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           

🌟 ¡BIENVENIDO A LOS PRIMOS T3! 🌟
🎮 Servidor Minecraft 24/7 - ¡Juega cuando quieras, con quien quieras!

🧱 🌍 Características del servidor:

✅ Disponible para Java y Bedrock
✅ Servidor 100% activo, sin caídas
✅ Survival + Comunidad activa y amigable
✅ Eventos semanales y premios especiales
✅ Sistema de economía, tiendas, y zonas seguras
✅ Terrenos protegidos contra grifeo
✅ Crossplay: Java & Bedrock pueden jugar juntos
✅ Servidor sin Pay to Win
✅ Staff activo 
✅ Entre otras cosas

🚀 Versiones compatibles:

🖥️ Java Edition:
🟢 Desde 1.20 hasta 1.21.7
🌐 IP: wally.hidencloud.com:24725

📱 Bedrock Edition:
🟢 Desde 1.20 hasta la más reciente
🌐 IP: wally.hidencloud.com
📌 Puerto: 24725

👑 ¿Por qué jugar en LOS PRIMOS T3?

✨ ¡Somos más que un servidor, somos una familia de jugadores apasionados por Minecraft!
🎁 Participa en sorteos, desafíos mensuales, y construye libremente en un mundo donde tú haces las reglas (bueno, casi 😄).
🛡️ Sistema anti-trampas, protección contra lag y un entorno sano para todos.

📢 Únete ya!
💬 Si tienes dudas, habla con el staff o usa los canales de ayuda.
🔗 Síguenos en redes y mantente al tanto de eventos y novedades.

💎 Nombre del servidor: LOS PRIMOS T3
🎉 ¡Te estamos esperando, jugador! 💎


`.trim();

await conn.sendMessage(m.chat, {
image: { url: 'https://files.catbox.moe/ul531s.jpg' },
caption: owner,
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
handler.help = ['servidor', 'minecraft', 'mc'];
handler.tags = ['main'];
handler.command = ['servidor', 'minecraft', 'mc', 'server', 'losprimos', 't3', 'T3'];
handler.rowner = false;

export default handler;
