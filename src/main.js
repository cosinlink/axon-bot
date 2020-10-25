const sendToTg = require("./notification")
require('dotenv').config()
const config = process.env
const superagent = require('superagent');
const log = console.log.bind(console)
const sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
const alarmTimeArr = ['22:30', '14:23', '14:24', '14:25', '14:26']


function dateFormat(fmt, date) {
    let ret
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    }
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt)
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
    }
    return fmt
}

function extractHolidays (arr) {
    const res = []
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] && arr[i].list) {
            res.push(...arr[i].list)
        }
    }
    return res
}

function isInHolidays (dateString, allHolidays) {
    // example: 20201009 -> 2020-10-9
    let y = dateString.slice(0, 4)
    let m = dateString.slice(4, 6)
    let d = dateString.slice(6, 8)
    m = m.startsWith('0') ? m.slice(1) : m
    d = d.startsWith('0') ? d.slice(1) : d
    const newDateString = y + '-' + m + '-' + d
    for (let i = 0; i < allHolidays.length; i++) {
        const obj = allHolidays[i]
        if (!obj) {
            continue
        }
        if (newDateString === obj.date && obj.status === '1') {
            return true
        }
    }

    return false
}

const isWorkDay = async function (dateString) {
    if (!dateString) {
        dateString = dateFormat("YYYYmmdd", new Date())
    }
    // http://opendata.baidu.com/api.php?query=20201008&resource_id=6018&format=json
    while (true) {
        let res = await superagent.get(`http://opendata.baidu.com/api.php?query=${dateString}&resource_id=6018&format=json`)
        if (res.text) {
            const data = JSON.parse(res.text)
            const arr = data.data[0] ? data.data[0].holiday : null
            if (arr && arr.length > 0) {
                const allHolidays = extractHolidays(arr)
                return !isInHolidays(dateString, allHolidays)
            }
        }
        await sleep(10000)
    }
}

const isAlarmTime = async function (date) {
    log('begin isAlarmTime')
    // 1. check if alarm time
    log(dateFormat("HH:MM", date))
    if (!alarmTimeArr.includes(dateFormat("HH:MM", date))) {
        return false
    }

    // 2. check if workDay
    log(dateFormat("YYYYmmdd", date))
    if (!(await isWorkDay(dateFormat("YYYYmmdd", date)))) {
        return false
    }
}

const alarm = function () {
    log('begin alarm')
    sendToTg("https://github.com/nervosnetwork/axon-internal/issues?q=is%3Aopen+Weekly")
}

const main = async function () {
    log('begin main')
    while (true) {
        if (await isAlarmTime(new Date())) {
            alarm()
        }
        await sleep(3000)
    }
}


main().then()
