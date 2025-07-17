let handler = async (m, { conn, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length
    let botname = typeof global.botname !== "undefined" ? global.botname : "BOT"
    
    let txt = `
🌟⭐ *${botname}* ⭐🌟
╭─━━━━━━━━━━━━━━━━━━━─╮
│ 🎭 ¡Hola @${userId.split('@')[0]}! 💖
╰─━━━━━━━━━━━━━━━━━─╯

✨ *ɪɴғᴏ ʙᴏᴛ* ✨
┏━━━━━━━━━━━━━━━━━━━━┓
┃ 🤖 Estado: ${(conn.user.jid == global.conn.user.jid ? '🟢 PREMIUM' : '🔗 prem-ʙᴏᴛ')}
┃ ⚡ Activo: 『${uptime}』
┃ 👥 Users: 『${totalreg}』🔥
┃ 🛠️ Comandos: 『${totalCommands}』⚙️
┃ 📅 Fecha: ${moment().tz('America/Mexico_City').format('DD/MM/YYYY')}
┃ 🕐 Hora: ${moment().tz('America/Mexico_City').format('HH:mm:ss')}
┃ 🌍 Servidor: México 🇲🇽
┃ 📡 Ping: Online ✅
┃ 💾 Memoria: Estable 📊
┃ 🔒 Modo: Privado 🔐
┗━━━━━━━━━━━━━━━━━━━┛

• :･ﾟ⊹˚• \`『 𝐽𝑢𝑒𝑔𝑜𝑠 』\` •˚⊹:･ﾟ•

❍ Juegos para divertirte en grupo:

ᰔᩚ *#quiz*
> ✦ Inicia una trivia rápida.
ᰔᩚ *#cartas*
> ✦ Inicia un juego de cartas.
ᰔᩚ *#rankingquiz*
> ✦ Ver ranking de aciertos en quiz.
ᰔᩚ *#terminarquiz*
> ✦ Finaliza la pregunta activa del quiz.

ᰔᩚ *#palabracadena*
> ✦ Inicia el juego de palabra encadenada.
ᰔᩚ *#terminarcadena*
> ✦ Finaliza el juego de palabra encadenada.

ᰔᩚ *#comenzar*
> ✦ Comienza tu aventura RPG en el "Reino de las Sombras".
ᰔᩚ *#mision*
> ✦ Ve tus misiones RPG del "Reino de las Sombras".
ᰔᩚ *#menumision*
> ✦ Menú de misiones RPG.
ᰔᩚ *#estado*
> ✦ Ver tu estado en el RPG.
ᰔᩚ *#rendirse*
> ✦ Reinicia tu personaje RPG.
ᰔᩚ *(1-10)*
> ✦ Elige tu ataque RPG (durante combate).
ᰔᩚ *#bonus*
> ✦ Usa tu bonificación especial RPG.
ᰔᩚ *#menuataques*
> ✦ Info de todos los ataques RPG.
ᰔᩚ *#infopj @usuario*
> ✦ Ver el estado RPG de otro usuario.

ᰔᩚ *#adivinar*
> ✦ Adivina el personaje o pelicula

ᰔᩚ *#impostor*
> ✦ Adivina quien es el impostor

• :･ﾟ⊹˚• \`『 Pezca & Caza 』\` •˚⊹:･ﾟ•
ᰔᩚ *#pescar • #pesca • #fish*
> ✦ Lanza la caña y pesca peces, tesoros o basura.
ᰔᩚ *#inventario*
> ✦ Muestra tu inventario de pesca.
ᰔᩚ *#venderpez • #venderpecez • #venderpescado*
> ✦ Vende los peces que hayas pescado.
ᰔᩚ *#vercaña*
> ✦ Ve el estado de tu caña de pescar.
ᰔᩚ *#comprar <tipo>*
> ✦ Compra una nueva caña o mejora.
ᰔᩚ *#abrir*
> ✦ Abre cofres que hayas pescado.

ᰔᩚ *#cazar • #hunt • #caceria*
> ✦ Ve de cacería y atrapa animales, objetos raros o basura.
ᰔᩚ *#inventarioanimal*
> ✦ Muestra tu inventario de animales cazados.
ᰔᩚ *#venderanimal • #vendercaza*
> ✦ Vende los animales que cazaste.
ᰔᩚ *#valorarcaza*
> ✦ Consulta el valor de tu inventario de caza.
ᰔᩚ *#comprararma <objeto>*
> ✦ Compra un arma para mejorar tus cacerías.
ᰔᩚ *#verarma*
> ✦ Ve el estado de tu arma de caza.
ᰔᩚ *#ayudacaza*
> ✦ Ver menú explicativo y ayuda para la caza.

• :･ﾟ⊹˚• \`『 Más juegos 』\` •˚⊹:･ﾟ•
ᰔᩚ *#amistad • #amigorandom* 
> ✦ Haz un amigo con un juego. 
ᰔᩚ *#chaqueta • #jalamela*
> ✦ Hazte una chaqueta.
ᰔᩚ *#chiste*
> ✦ La bot te cuenta un chiste.
ᰔᩚ *#consejo* 
> ✦ La bot te da un consejo. 
ᰔᩚ *#doxeo • #doxear* + <mención>
> ✦ Simular un doxeo falso.
ᰔᩚ *#facto*
> ✦ La bot te lanza un facto. 
ᰔᩚ *#formarpareja*
> ✦ Forma una pareja. 
ᰔᩚ *#frase*
> ✦ La bot te da una frase.
ᰔᩚ *#huevo*
> ✦ Agárrale el huevo a alguien.
ᰔᩚ *#chupalo* + <mención>
> ✦ Haz que un usuario te la chupe.
ᰔᩚ *#aplauso* + <mención>
> ✦ Aplaudirle a alguien.
ᰔᩚ *#marron* + <mención>
> ✦ Burlarte del color de piel de un usuario. 
ᰔᩚ *#suicidar*
> ✦ Suicídate. 
ᰔᩚ *#iq • #iqtest* + <mención>
> ✦ Calcular el iq de alguna persona. 
ᰔᩚ *#meme*
> ✦ La bot te envía un meme aleatorio. 
ᰔᩚ *#morse*
> ✦ Convierte un texto a código morse. 
ᰔᩚ *#nombreninja*
> ✦ Busca un nombre ninja aleatorio. 
ᰔᩚ *#paja • #pajeame* 
> ✦ La bot te hace una paja.
ᰔᩚ *#personalidad* + <mención>
> ✦ La bot busca tu personalidad. 
ᰔᩚ *#piropo*
> ✦ Lanza un piropo.
ᰔᩚ *#pregunta*
> ✦ Hazle una pregunta a la bot.
ᰔᩚ *#ship • #pareja*
> ✦ La bot te da la probabilidad de enamorarte de una persona.
ᰔᩚ *#sorteo*
> ✦ Empieza un sorteo. 
ᰔᩚ *#top*
> ✦ Empieza un top de personas.
ᰔᩚ *#formartrio* + <mención>
> ✦ Forma un trío.
ᰔᩚ *#ahorcado*
> ✦ Diviértete con el bot jugando el ahorcado.
ᰔᩚ *#genio*
> ✦ Comienza una pregunta con el genio.
ᰔᩚ *#mates • #matematicas*
> ✦ Responde las preguntas de matemáticas para ganar recompensas.
ᰔᩚ *#ppt*
> ✦ Juega piedra papel o tijeras con la bot.
ᰔᩚ *#sopa • #buscarpalabra*
> ✦ Juega el famoso juego de sopa de letras.
ᰔᩚ *#pvp • #suit* + <mención>
> ✦ Juega un pvp contra otro usuario.
ᰔᩚ *#ttt*
> ✦ Crea una sala de juego de tres en raya.
`.trim()

    await conn.sendMessage(m.chat, { 
        text: txt,
        contextInfo: {
            mentionedJid: [m.sender, userId]
        }
    }, { quoted: m })
}

handler.help = ['menujuegos', 'juegos', 'games']
handler.tags = ['main']
handler.command = ['menujuegos', 'juegos', 'games']

export default handler

function clockString(ms) {
    let seconds = Math.floor((ms / 1000) % 60)
    let minutes = Math.floor((ms / (1000 * 60)) % 60)
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
    return `${hours}h ${minutes}m ${seconds}s`
}
