const URL = require('url').URL
const cheerio = require('cheerio')

class Post {
  constructor ($, id) {
    this.$ = $
    this.id = +id
  }

  get by () {
    if (this.event !== undefined) {
      return this.$.find('[data-testid="event_permalink_privacy"]').first().parent().find('a').first().text()
    } else {
      return this.$.find('h5 .fwb a').first().text()
    }
  }

  get text () {
    return this.$.find('.userContent').first().text() || undefined
  }

  get event () {
    if (this.$.find('#event_header_primary').length === 0) {
      return undefined
    }

    let [startTime, endTime] = this.$.find('#event_time_info td [content]').last().attr('content').split(' to ')
    startTime = new Date(startTime)
    endTime = new Date(endTime)
    const title = this.$.find('[data-testid="event-permalink-event-name"]').first().text()
    const details = this.$.find('#people_card').parent().find('div:nth-child(2)').find('span').last().text()
    const location = this.$.find('#event_time_info').first().parent().find('td').last().text()

    return {
      title,
      startTime,
      endTime,
      details,
      location
    }
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

  get sharedId () {
    const timestamps = this.$.find('.timestampContent')
    if (timestamps.length <= 1) {
      return undefined
    }

    let permaLink = timestamps.last().parent().parent()
    permaLink = permaLink.attr('ajaxify') || permaLink.attr('href')

    const link = new URL(permaLink, 'https://www.facebook.com/')
    const linkParams = link.searchParams

    const id = linkParams.get('story_fbid') || // story (like text)
      linkParams.get('fbid') || // image
      link.pathname.split('/')[3] ||
      link.pathname.split('/')[2] // event

    return +id
  }

  get time () {
    if (this.event !== undefined) {
      return this.event.startTime
    } else {
      const epoch = this.$.find('.timestampContent').first().parent().attr('data-utime')
      return new Date(epoch * 1000)
    }
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
    const data = {
      id: this.id,
      sharedId: this.sharedId,
      by: this.by,
      text: this.text,
      link: this.link,
      time: this.time.toJSON(),
      images: this.images,
      event: this.event
    }

    if (data.event !== undefined) {
      data.event.startTime = data.event.startTime.toJSON()
      data.event.endTime = data.event.endTime.toJSON()
    }

    return data
  }
}

module.exports = Post
