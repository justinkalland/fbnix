const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const URL = require('url').URL
const Post = require('./post')

class Agent {
  async close () {
    return this.browser.close()
  }

  async _fetchPage (url) {
    if (!this.browser) {
      this.browser = await puppeteer.launch({ headless: true })
    }

    const page = await this.browser.newPage()

    const response = await page.goto(url, { timeout: 50000 })

    if (response.status() === 404) {
      await page.close()
      throw new Error('not found')
    }

    const $ = cheerio.load(await page.content())

    await page.close()

    return $
  }

  async getPagePostIds (pageId) {
    const $ = await this._fetchPage(`https://www.facebook.com/pg/${pageId}/posts/`)

    const postWrappers = $('.userContentWrapper')

    if (postWrappers.length === 0 && $('#login_form').length === 2) {
      // indicates fb found the graph ID but it is not a page
      throw new Error('not found')
    }

    const postIds = []
    postWrappers.each(function () {
      let permaLink = $(this)
        .find('.timestampContent')
        .parent().parent()

      permaLink = permaLink.attr('ajaxify') || permaLink.attr('href')

      const link = new URL(permaLink, 'https://www.facebook.com/')
      const linkParams = link.searchParams

      const postId = linkParams.get('story_fbid') || // story (like text)
        linkParams.get('fbid') || // image
        link.pathname.split('/')[3] ||
        link.pathname.split('/')[2] // event

      postIds.push(+postId)
    })

    return postIds
  }

  async getPost (postId) {
    const $ = await this._fetchPage('https://www.facebook.com/' + postId)
    const element = $('.userContentWrapper').first()

    if (element.length === 0) {
      throw new Error('not found')
    }

    return new Post(element)
  }
}

module.exports = Agent
