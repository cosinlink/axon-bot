const {TelegramClient} = require( 'messaging-api-telegram')
require('dotenv').config()
const config = process.env

module.exports = function (text) {
    if (!config.TELEGRAM_BOT_KEY) {
        throw new Error('cannot find TELEGRAM_BOT_KEY config')
    }

    const chat_id = config.TELEGRAM_CHANNEL_ID

    const client = TelegramClient.connect(config.TELEGRAM_BOT_KEY)

    client.sendMessage(
        chat_id,
        text,
        {
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
            disable_notification: false,
        }
    ).then(() => {
        console.log('send', text)
    })
}


