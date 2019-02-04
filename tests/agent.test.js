const expect = require('chai').expect
const support = require('./support')

describe('Fbnix', () => {
  it('fetches post IDs for a page', async () => {
    const pageId = 774371002900647

    const postIds = await support.agent.getPagePostIds(pageId)

    expect(postIds)
      .to.be.a('array')
      .and.to.have.lengthOf.above(5)

    postIds.forEach(id => {
      expect(id).to.be.a('number')
        .and.be.greaterThan(200000000000000)
    })
  })

  it('returns error on page not found', async () => {
    // page doesn't exist
    await expect(support.agent.getPagePostIds(123))
      .to.be.rejectedWith('not found')

    // graph id exists but isnt a page
    await expect(support.agent.getPagePostIds(352940311570379))
      .to.be.rejectedWith('not found')
  })

  describe('fetches', () => {
    it('post not found', async () => {
      // post doesn't exist
      await expect(support.agent.getPost(56584930285769305832))
        .to.be.rejectedWith('not found')

      // either graph id isnt a post or is private
      await expect(support.agent.getPost(1005422149655522))
        .to.be.rejectedWith('not found')
    })

    it('text post', async () => {
      const postId = 774371639567250

      const post = await support.agent.getPost(postId)

      expect(post.id).to.equal(postId)
      expect(+post.date).to.equal(1541690705000)

      expect(post.by)
        .to.equal('Billy\'s Collectibles')

      expect(post.text)
        .to.equal('Here is the first post! Welcome!')

      expect(post.images)
        .to.equal(undefined)

      expect(post.link)
        .to.equal(undefined)
    })

    it('link post', async () => {
      const postId = 774377139566700

      const post = await support.agent.getPost(postId)

      expect(post.id).to.equal(postId)
      expect(+post.date).to.equal(1541691456000)

      expect(post.by)
        .to.equal('Billy\'s Collectibles')

      expect(post.link.href)
        .to.equal('https://www.carmagazine.co.uk/features/car-culture/hot-wheels-model-toy-cars/')

      expect(post.link.title)
        .to.equal('Hot Wheels at 50: a celebration of toy cars')
    })

    it('link post with text', async () => {
      const postId = 774938299510584

      const post = await support.agent.getPost(postId)

      expect(post.id).to.equal(postId)
      expect(+post.date).to.equal(1541776873000)

      expect(post.by)
        .to.equal('Billy\'s Collectibles')

      expect(post.text)
        .to.equal('I am going to buy an XBOX just for this!')

      expect(post.link.href)
        .to.equal('https://www.onmsft.com/news/forza-motorsport-7-players-get-free-hot-wheels-cars-on-xbox-one-windows-10')

      expect(post.link.title)
        .to.equal('Forza Motorsport 7 players get free Hot Wheels cars on Xbox One & Windows 10 | On MSFT')
    })

    it('share post', async () => {
      const postId = 774949062842841

      const post = await support.agent.getPost(postId)

      expect(post.id).to.equal(postId)
      expect(+post.date).to.equal(1541778513000)

      expect(post.by)
        .to.equal('Billy\'s Collectibles')

      expect(post.text).to.equal(undefined)

      // todo: what to do here?
    })

    it('share post with text', async () => {
      const postId = 774949562842791

      const post = await support.agent.getPost(postId)

      expect(post.id).to.equal(postId)
      expect(+post.date).to.equal(1541778612000)

      expect(post.by)
        .to.equal('Billy\'s Collectibles')

      expect(post.text)
        .to.equal('I am not sure if I should post to my page or wall.')

      // todo: what to do here?
    })

    it('image post', async () => {
      const postId = 774373759567038

      const post = await support.agent.getPost(postId)

      expect(post.id).to.equal(postId)
      expect(+post.date).to.equal(1541691001000)

      expect(post.by)
        .to.equal('Billy\'s Collectibles')

      expect(post.images).to.have.lengthOf(1)

      post.images.forEach(url => {
        expect(url).to.contain('https://')
          .and.to.contain('.fbcdn.net')
          .and.to.contain('.jpg')
      })
    })

    it('multi image post', async () => {
      const postId = 774372742900473

      const post = await support.agent.getPost(postId)

      expect(post.id).to.equal(postId)
      expect(+post.date).to.equal(1541690852000)

      expect(post.by)
        .to.equal('Billy\'s Collectibles')

      expect(post.text)
        .to.equal('Check out these awesome collectibles!')

      expect(post.images).to.have.lengthOf(4)

      post.images.forEach(url => {
        expect(url).to.contain('https://')
          .and.to.contain('.fbcdn.net')
          .and.to.contain('.jpg')
      })
    })
  })
})
