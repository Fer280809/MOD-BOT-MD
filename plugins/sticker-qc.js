import { sticker } from '../lib/sticker.js'
import axios from 'axios'

const handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        let text
        if (args.length >= 1) {
            text = args.slice(0).join(" ")
        } else if (m.quoted && m.quoted.text) {
            text = m.quoted.text
        } else {
            return conn.reply(m.chat, `❀ Por favor, ingresa un texto para crear el sticker.`, m)
        }
        
        if (!text) return conn.reply(m.chat, `❀ Por favor, ingresa un texto para crear el sticker.`, m)
        
        const mentionedUser = m.quoted ? m.quoted.sender : m.sender
        let pp
        let nombre
        
        try {
            pp = await conn.profilePictureUrl(mentionedUser, 'image').catch(() => 'https://telegra.ph/file/24fa902ead26340f3df2c.png')
            nombre = await conn.getName(mentionedUser) || mentionedUser.split('@')[0]
        } catch (error) {
            pp = 'https://telegra.ph/file/24fa902ead26340f3df2c.png'
            nombre = mentionedUser.split('@')[0]
        }
        
        // Limpiar menciones del texto
        const mentionRegex = new RegExp(`@${mentionedUser.split('@')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'g')
        const mishi = text.replace(mentionRegex, '').trim()
        
        if (mishi.length > 30) return conn.reply(m.chat, `✧ El texto no puede tener más de 30 caracteres.`, m)
        if (mishi.length < 1) return conn.reply(m.chat, `❀ Por favor, ingresa un texto válido para crear el sticker.`, m)
        
        const obj = {
            "type": "quote",
            "format": "png",
            "backgroundColor": "#000000",
            "width": 512,
            "height": 768,
            "scale": 2,
            "messages": [{
                "entities": [],
                "avatar": true,
                "from": {
                    "id": 1,
                    "name": nombre,
                    "photo": { 
                        "url": pp 
                    }
                },
                "text": mishi,
                "replyMessage": {}
            }]
        }
        
        // Enviar mensaje de carga
        const loadingMsg = await conn.reply(m.chat, `🔄 Generando sticker...`, m)
        
        // Realizar la petición con timeout y headers adicionales
        const response = await axios.post('https://bot.lyo.su/quote/generate', obj, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 30000 // 30 segundos de timeout
        })
        
        // Verificar que la respuesta sea válida
        if (!response.data || !response.data.result || !response.data.result.image) {
            throw new Error('Respuesta inválida del servidor')
        }
        
        const buffer = Buffer.from(response.data.result.image, 'base64')
        
        // Verificar que el buffer sea válido
        if (!buffer || buffer.length === 0) {
            throw new Error('Buffer de imagen inválido')
        }
        
        let userId = m.sender
        let packstickers = global.db.data.users[userId] || {}
        let texto1 = packstickers.text1 || global.packsticker || 'Bot'
        let texto2 = packstickers.text2 || global.packsticker2 || 'Sticker'
        
        let stiker = await sticker(buffer, false, texto1, texto2)
        
        if (stiker) {
            // Eliminar mensaje de carga
            await conn.sendMessage(m.chat, { delete: loadingMsg.key })
            return conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
        } else {
            throw new Error('Error al convertir a sticker')
        }
        
    } catch (error) {
        console.error('Error en comando qc:', error)
        
        // Mensajes de error más específicos
        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
            return conn.reply(m.chat, `⚠️ Error: Tiempo de espera agotado. Inténtalo nuevamente.`, m)
        } else if (error.response && error.response.status === 429) {
            return conn.reply(m.chat, `⚠️ Error: Demasiadas peticiones. Espera un momento e inténtalo nuevamente.`, m)
        } else if (error.response && error.response.status >= 500) {
            return conn.reply(m.chat, `⚠️ Error del servidor. Inténtalo más tarde.`, m)
        } else {
            return conn.reply(m.chat, `❌ Error al crear el sticker: ${error.message}`, m)
        }
    }
}

handler.help = ['qc']
handler.tags = ['sticker']
handler.group = true
handler.command = ['qc']

export default handler
