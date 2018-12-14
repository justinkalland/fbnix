const expect = require('chai').expect
const support = require('./support')

// todo: add date check to each test

describe('Fbnix', () => {
  it('fetches post IDs for a page', async () => {
    const pageId = 774371002900647

    const postIds = await support.agent.getPagePostIds(pageId)

    expect(postIds)
      .to.be.a('array')
      .and.to.have.lengthOf.above(5)
  })

  describe('fetches', () => {
    it('text post', async () => {
      const postId = 774371639567250

      const post = await support.agent.getPost(postId)

      expect(post.id).to.equal(postId)

      expect(post.name)
        .to.equal('Billy\'s Collectibles')

      expect(post.text)
        .to.equal('Here is the first post! Welcome!')
    })

    it('link post', async () => {
      const postId = 774377139566700

      const post = await support.agent.getPost(postId)

      expect(post.id).to.equal(postId)

      expect(post.name)
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

      expect(post.name)
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

      expect(post.name)
        .to.equal('Billy\'s Collectibles')

      // todo: what to do here?
    })

    it('share post with text', async () => {
      const postId = 774949562842791

      const post = await support.agent.getPost(postId)

      expect(post.id).to.equal(postId)

      expect(post.name)
        .to.equal('Billy\'s Collectibles')

      expect(post.text)
        .to.equal('I am not sure if I should post to my page or wall.')

      // todo: what to do here?
    })

    it('image post')
  })
})
