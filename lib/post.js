const urlParse = require('url').parse

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
    // todo: return Facebook ID
  }

  get date () {
    // todo: return date object that the post was made
    // (careful with time zones, hopefully an EPOCH can be scraped)
  }

  get images () {
    // todo: return array of any image URLs that were in the post
  }

  toJSON () {
    // todo: return shallow object of each getter
    // (in a dynamic way would be best, but maybe remove any nulls?)
  }
}

module.exports = Post
