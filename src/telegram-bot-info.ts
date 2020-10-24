import * as config from './config'

import {TelegramClient} from 'messaging-api-telegram'

function getTgInfo() {
    console.log('config.TELEGRAM_BOT_KEY', config.TELEGRAM_BOT_KEY)
    const client = TelegramClient.connect(config.TELEGRAM_BOT_KEY)
    console.log(client)
    client.getUpdates({limit: 10}).then((text) => {
        console.log('getTgInfo end', text)
    })
}


getTgInfo()