const parseArgs = require('minimist')
const Fbnix = require('../')
const sinon = require('sinon')
const fs = require('fs')
const crypto = require('crypto')
const cheerio = require('cheerio')

const agent = new Fbnix()

const argv = parseArgs(process.argv.slice(2), {
  boolean: ['cache']
})

before(function () {
  if (!argv['cache']) {
    return
  }

  if (!fs.existsSync('tests/cache/')) {
    fs.mkdirSync('tests/cache/')
  }

  const originalGetPage = agent._fetchPage
  sinon.stub(agent, '_fetchPage').callsFake(async function (url) {
    const fileName = 'tests/cache/' + crypto.createHash('md5').update(url).digest('hex')

    let $

    try {
      $ = cheerio.load(fs.readFileSync(fileName))
    } catch (err) {
      $ = await originalGetPage.call(agent, url)
      fs.writeFileSync(fileName, $.html())
    }

    return $
  })
})

after(() => {
  agent.close()
})

module.exports = {
  agent
}
