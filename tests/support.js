const parseArgs = require('minimist')
const Fbnix = require('../')
const sinon = require('sinon')
const fs = require('fs')
const crypto = require('crypto')
const cheerio = require('cheerio')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

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
      try {
        $ = await originalGetPage.call(agent, url)
        fs.writeFileSync(fileName, $.html())
      } catch (err) {
        fs.writeFileSync(fileName, `<span id="cached_error">${err.message}</span>`)
        throw new Error(err.message)
      }
    }

    if ($('#cached_error').length === 1) {
      throw new Error($('#cached_error').text())
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
