const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const urlParse = require('url').parse

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

    page.close()

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

      const parsedPermaLink = urlParse(permaLink, true).query

      const postId = parsedPermaLink.story_fbid || // story (like text)
        parsedPermaLink.fbid || // image
        permaLink.split('/')[2] // event

      postIds.push(postId)
    })

    return postIds
  }

  async getPost (postId) {
    const $ = await this._fetchPage('https://www.facebook.com/' + postId)
    const postElement = $('.userContentWrapper').first()
    const post = {}

    const titleElement = postElement.find('h5').first()
    post.name = titleElement.find('.fwb').first().text()
    post.text = postElement.find('.userContent').first().text() || ''

    let type = 'text'
    const link = postElement.find('a[data-ad-preview="headline"]').first()

    if (link.length) {
      type = 'link'
    }

    switch (type) {
      case 'link':
        post.linkHref = urlParse(link.attr('href'), true).query.u.split('#')[0]
        post.linkTitle = link.text()
        break
    }

    // todo: check if post has images and attach urls

    return post
  }
}

module.exports = Agent
