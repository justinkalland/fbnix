const URL = require('url').URL
const cheerio = require('cheerio')

class Post {
  constructor ($) {
    this.$ = $
  }

  get by () {
    const name = this.$.find('h5 .fwb a').first().text()

    return name
  }

  get text () {
    const text = this.$.find('.userContent').first().text()

    return text || undefined
  }

  get link () {
    let link
    this.$.find('a[data-lynx-mode="async"]').each(function () {
      if (cheerio(this).text()) {
        link = cheerio(this)
      }
    })

    if (link === undefined) {
      return undefined
    }

    const linkParams = new URL(link.attr('href'), 'https://www.facebook.com/').searchParams

    return {
      href: linkParams.get('u').split('#')[0],
      title: link.text()
    }
  }

  get id () {
    let permaLink = this.$.find('.timestampContent').parent().parent()

    permaLink = permaLink.attr('ajaxify') || permaLink.attr('href')

    const link = new URL(permaLink, 'https://www.facebook.com/')
    const linkParams = link.searchParams

    const id = linkParams.get('story_fbid') || // story (like text)
      linkParams.get('fbid') || // image
      link.pathname.split('/')[3] ||
      link.pathname.split('/')[2] // event

    return +id
  }

  get date () {
    const epoch = this.$.find('.timestampContent').parent().attr('data-utime')

    return new Date(epoch * 1000)
  }

  get images () {
    const imageElements = this.$.find('.uiScaledImageContainer').find('img')
    const images = []

    if (imageElements.length === 0) {
      return undefined
    }

    imageElements.each(function () {
      images.push(cheerio(this).attr('src'))
    })

    return images
  }

  toJSON () {
    return {
      id: this.id,
      by: this.by,
      text: this.text,
      link: this.link,
      date: this.date.toJSON(),
      images: this.images
    }
  }
}

module.exports = Post
