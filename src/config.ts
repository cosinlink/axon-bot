import home from 'home';
import fs from 'fs';
require('dotenv').config()

const config = process.env
console.log("bot config:", config.telegram_bot_key);

export const DEV_MODE = config.dev_mode;
export const TELEGRAM_BOT_KEY = config.telegram_bot_key
export const TELEGRAM_CHAT_ID = DEV_MODE ? config.telegram_channel_id : config.telegram_axon_group;
export const ROOT_PATH = home.resolve('~/.axon-bot');

function init() {
    if (!fs.existsSync(ROOT_PATH)) {
        fs.mkdirSync(ROOT_PATH)
    }
}

init()