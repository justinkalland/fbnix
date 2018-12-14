const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const URL = require('url').URL
const Post = require('./post')

class Agent {
  async close () {
    if (this.browser) {
      return this.browser.close()
    }
  }

  async _fetchPage (url) {
    if (!this.browser) {
      this.browser = await puppeteer.launch()
    }

    const page = await this.browser.newPage()

    await page.goto(url, { timeout: 50000 })

    const $ = cheerio.load(await page.content())

    await page.close()

    return $
  }

  async getPagePostIds (pageId) {
    const $ = await this._fetchPage(`https://www.facebook.com/pg/${pageId}/posts/`)
    const postIds = []

    $('.userContentWrapper').each(function () {
      let permaLink = $(this)
        .find('.timestampContent')
        .parent().parent()

      permaLink = permaLink.attr('ajaxify') || permaLink.attr('href')

      const linkParams = new URL(permaLink, 'https://www.facebook.com/').searchParams

      const postId = linkParams.get('story_fbid') || // story (like text)
        linkParams.get('fbid') || // image
        permaLink.split('/')[2] // event

      postIds.push(postId)
    })

    return postIds
  }

  async getPost (postId) {
    const $ = await this._fetchPage('https://www.facebook.com/' + postId)
    const element = $('.userContentWrapper').first()

    return new Post(element)
  }
}

module.exports = Agent
