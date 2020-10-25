const {isWorkDay, alarm} = require('./main')

async function testWorkDay() {
  const testVectors = [
    {
      'input': '2020-10-01',
      'output': false
    },
    {
      'input': '2020-10-02',
      'output': false
    },
    {
      'input': '2020-10-03',
      'output': false
    },
    {
      'input': '2020-10-08',
      'output': false
    },
    {
      'input': '2019-10-01',
      'output': false
    },
    {
      'input': '2020-10-25',
      'output': false
    },
    {
      'input': '2020-10-26',
      'output': true
    },
    {
      'input': '2020-09-30',
      'output': true
    },
    {
      'input': '2020-10-10',
      'output': true
    },
  ]

  for (let i = 0; i < testVectors.length; i++) {
    const date = new Date(testVectors[i].input)
    const res = await isWorkDay(date)
    console.assert(res === testVectors[i].output, `test ${i} error, date=${date}`)
    if (res) {
      alarm()
    }
  }
}

testWorkDay().then()
