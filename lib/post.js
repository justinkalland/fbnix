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
}

module.exports = Post
