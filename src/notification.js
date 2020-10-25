const {TelegramClient} = require( 'messaging-api-telegram')
require('dotenv').config()

module.exports = function (text) {
    const config = process.env
    console.log('config', config)
    if (!config.TELEGRAM_BOT_KEY) {
        throw new Error('cannot find TELEGRAM_BOT_KEY config')
    }

    const chat_id = config.DEV ? config.TELEGRAM_CHANNEL_ID : config.TELEGRAM_AXON_GROUP
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


