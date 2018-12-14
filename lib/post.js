const urlParse = require('url').parse
const cheerio = require('cheerio')

class Post {
  constructor ($) {
    this.$ = $
  }

  get name () {
    const titleElement = this.$.find('h5').first()
    const name = titleElement.find('.fwb').first().text()

    return name || null
  }

  get text () {
    const text = this.$.find('.userContent').first().text()

    return text || null
  }

  get link () {
    const link = this.$.find('a[data-ad-preview="headline"]').first()

    if (link.length === 0) {
      return null
    }

    return {
      href: urlParse(link.attr('href'), true).query.u.split('#')[0],
      title: link.text()
    }
  }

  get id () {
    let permaLink = this.$.find('.timestampContent').parent().parent()

    permaLink = permaLink.attr('ajaxify') || permaLink.attr('href')

    const parsedPermaLink = urlParse(permaLink, true).query

    const id = parsedPermaLink.story_fbid || // story (like text)
      parsedPermaLink.fbid || // image
      permaLink.split('/')[2] // event

    return +id || null
  }

  get date () {
    const epoch = this.$.find('.timestampContent').parent().attr('data-utime')

    if (epoch.length === 0) {
      return null
    }

    return new Date(epoch * 1000)
  }

  get images () {
    const imageElements = this.$.find('.uiScaledImageContainer').find('img')
    const images = []

    if (imageElements.length === 0) {
      return null
    }

    imageElements.each(function () {
      images.push(cheerio(this).attr('src'))
    })

    return images
  }

  toJSON () {
    // todo: return shallow object of each getter
    // (in a dynamic way would be best, but maybe remove any nulls?)
  }
}

module.exports = Post
