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

  async getPostIds (groupOrPageId) {
    let $
    let postWrappers

    try {
      $ = await this._fetchPage(`https://www.facebook.com/groups/${groupOrPageId}/`)
      postWrappers = $('.userContentWrapper')
      if (postWrappers.length === 0 && $('#login_form').length === 1) {
        throw new Error('not found')
      }
    } catch (error) {
      if (error.message === 'not found') {
        $ = await this._fetchPage(`https://www.facebook.com/pg/${groupOrPageId}/posts/`)
        postWrappers = $('.userContentWrapper')
        if (postWrappers.length === 0 && $('#login_form').length === 2) {
          throw new Error('not found')
        }
      } else {
        throw error
      }
    }

    const postIds = []
    postWrappers.each(function () {
      let permaLink = $(this)
        .find('.timestampContent')
        .parent().parent()

      permaLink = permaLink.attr('ajaxify') || permaLink.attr('href')

      const link = new URL(permaLink, 'https://www.facebook.com/')
      const linkParams = link.searchParams
      const pathParts = link.pathname.replace(/^\/+|\/+$/g, '').split('/')

      const postId = linkParams.get('story_fbid') || // story (like text)
          linkParams.get('fbid') || // image
          pathParts.pop() // get from URL

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
