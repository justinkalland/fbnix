const expect = require('chai').expect
const support = require('./support')

describe('Fbnix', () => {
  it('fetches post IDs for a page', async () => {
    const groupOrPageId = 774371002900647

    const postIds = await support.agent.getPostIds(groupOrPageId)

    expect(postIds)
      .to.be.a('array')
      .and.to.have.lengthOf.above(5)

    postIds.forEach(id => {
      expect(id).to.be.a('number')
        .and.be.greaterThan(200000000000000)
    })
  })

  it('fetches post IDs for a group', async () => {
    const groupOrPageId = 505507649588383

    const postIds = await support.agent.getPostIds(groupOrPageId)

    expect(postIds)
      .to.be.a('array')
      .and.to.have.lengthOf.above(5)

    postIds.forEach(id => {
      expect(id).to.be.a('number')
        .and.be.greaterThan(200000000000000)
    })
  })

  it('fetches the name of a page', async () => {
    const pageId = 774371002900647
    const name = await support.agent.getName(pageId)

    expect(name).to.equal('Billy\'s Collectibles')
  })

  it('fetches the name of a group', async () => {
    const pageId = 505507649588383
    const name = await support.agent.getName(pageId)

    expect(name).to.equal('Neil deGrasse Tyson')
  })

  it('returns error on fetching name page/group not found', async () => {
    // page doesn't exist
    await expect(support.agent.getName(123))
      .to.be.rejectedWith('not found')

    // graph id exists but isnt a page or group
    await expect(support.agent.getName(100029987083896))
      .to.be.rejectedWith('not found')
  })

  it('returns error on page/group not found', async () => {
    // page doesn't exist
    await expect(support.agent.getPostIds(123))
      .to.be.rejectedWith('not found')

    // graph id exists but isnt a page or group
    await expect(support.agent.getPostIds(100029987083896))
      .to.be.rejectedWith('not found')

    // closed group (not public)
    await expect(support.agent.getPostIds(352940311570379))
      .to.be.rejectedWith('not found')
  })

  describe('page posts', () => {
    it('not found', async () => {
      // post doesn't exist
      await expect(support.agent.getPost(56584930285769305832))
        .to.be.rejectedWith('not found')

      // either graph id isnt a post or is private
      await expect(support.agent.getPost(1005422149655522))
        .to.be.rejectedWith('not found')
    })

    it('text', async () => {
      const post = await support.agent.getPost(774371639567250)

      expect(post.toJSON()).to.deep.equal({
        id: 774371639567250,
        sharedId: undefined,
        by: "Billy's Collectibles",
        text: 'Here is the first post! Welcome!',
        link: undefined,
        time: '2018-11-08T15:25:05.000Z',
        images: undefined,
        event: undefined
      })
    })

    it('link', async () => {
      const post = await support.agent.getPost(774377139566700)

      expect(post.toJSON()).to.deep.equal({
        id: 774377139566700,
        sharedId: undefined,
        by: "Billy's Collectibles",
        text: undefined,
        link: {
          href: 'https://www.carmagazine.co.uk/features/car-culture/hot-wheels-model-toy-cars/',
          title: 'Hot Wheels at 50: a celebration of toy cars'
        },
        time: '2018-11-08T15:37:36.000Z',
        images: [
          'https://external-dfw5-1.xx.fbcdn.net/safe_image.php?d=AQD9q4SUKocrn99Y&w=540&h=282&url=https%3A%2F%2Fcar-images.bauersecure.com%2Fpagefiles%2F84980%2Fhot_wheels_00.jpg&cfs=1&upscale=1&fallback=news_d_placeholder_publisher&_nc_hash=AQCL2vV3gmQ22YXO'
        ],
        event: undefined
      })
    })

    it('link with text', async () => {
      const post = await support.agent.getPost(774938299510584)

      expect(post.toJSON()).to.deep.equal({
        id: 774938299510584,
        sharedId: undefined,
        by: "Billy's Collectibles",
        text: 'I am going to buy an XBOX just for this!',
        link: {
          href: 'https://www.onmsft.com/news/forza-motorsport-7-players-get-free-hot-wheels-cars-on-xbox-one-windows-10',
          title: 'Forza Motorsport 7 players get free Hot Wheels cars on Xbox One & Windows 10 | On MSFT'
        },
        time: '2018-11-09T15:21:13.000Z',
        images: [
          'https://external-dfw5-1.xx.fbcdn.net/safe_image.php?d=AQAOY3cudgm46Q1Y&w=540&h=282&url=https%3A%2F%2Fwww.onmsft.com%2Fwp-content%2Fuploads%2F2018%2F11%2FHot-Wheels-Bone-Shaker-Forza-Motorsports-7-1031x580.jpg&cfs=1&upscale=1&fallback=news_d_placeholder_publisher&_nc_hash=AQBQ2wLDL1lTZuBx'
        ],
        event: undefined
      })
    })

    it('share', async () => {
      const post = await support.agent.getPost(774949062842841)

      expect(post.toJSON()).to.deep.equal({
        id: 774949062842841,
        sharedId: 106707477005488,
        by: "Billy's Collectibles",
        text: undefined,
        link: undefined,
        time: '2018-11-09T15:48:33.000Z',
        images: undefined,
        event: undefined
      })
    })

    it('share with added text', async () => {
      const post = await support.agent.getPost(774949562842791)

      expect(post.toJSON()).to.deep.equal({
        id: 774949562842791,
        sharedId: 109186700090899,
        by: "Billy's Collectibles",
        text: 'I am not sure if I should post to my page or wall.',
        link: undefined,
        time: '2018-11-09T15:50:12.000Z',
        images: undefined,
        event: undefined
      })
    })

    it('image', async () => {
      const post = await support.agent.getPost(774373759567038)

      expect(post.toJSON()).to.deep.equal({
        id: 774373759567038,
        sharedId: undefined,
        by: "Billy's Collectibles",
        text: undefined,
        link: undefined,
        time: '2018-11-08T15:30:01.000Z',
        images: [
          'https://scontent-dfw5-1.xx.fbcdn.net/v/t1.0-0/s526x296/45752118_774373766233704_3375132528380739584_n.jpg?_nc_cat=107&_nc_ht=scontent-dfw5-1.xx&oh=1a73be4021f0a7f4b71ad0dcc45a3d86&oe=5CF50612'
        ],
        event: undefined
      })
    })

    it('multi image', async () => {
      const post = await support.agent.getPost(774372742900473)

      expect(post.toJSON()).to.deep.equal({
        id: 774372742900473,
        sharedId: undefined,
        by: "Billy's Collectibles",
        text: 'Check out these awesome collectibles!',
        link: undefined,
        time: '2018-11-08T15:27:32.000Z',
        images: [
          'https://scontent-dfw5-1.xx.fbcdn.net/v/t1.0-9/45494942_774372489567165_5172707475698221056_n.jpg?_nc_cat=105&_nc_ht=scontent-dfw5-1.xx&oh=e2997651ae2bb5a3a7a7a909ec227152&oe=5CF0932E',
          'https://scontent-dfw5-1.xx.fbcdn.net/v/t1.0-9/45763732_774372542900493_9109028393843687424_n.jpg?_nc_cat=101&_nc_ht=scontent-dfw5-1.xx&oh=331219e0a87a20fc6fef0e51a559509a&oe=5CB6DC26',
          'https://scontent-dfw5-1.xx.fbcdn.net/v/t1.0-9/45622105_774372509567163_5978916529859723264_n.jpg?_nc_cat=101&_nc_ht=scontent-dfw5-1.xx&oh=444f6e813f11bb373a75f88fc99647fe&oe=5CB77D40',
          'https://scontent-dfw5-1.xx.fbcdn.net/v/t1.0-9/45622100_774372559567158_3822025249919074304_n.jpg?_nc_cat=100&_nc_ht=scontent-dfw5-1.xx&oh=19716ba70bb130b18dca9ffc49a42662&oe=5CEE88B4'
        ],
        event: undefined
      })
    })

    it('event', async () => {
      const post = await support.agent.getPost(299449697564073)

      expect(post.toJSON()).to.deep.equal({
        id: 299449697564073,
        sharedId: undefined,
        by: "Billy's Collectibles",
        text: undefined,
        link: undefined,
        time: '2022-11-11T15:33:00.000Z',
        images: [
          'https://scontent-dfw5-1.xx.fbcdn.net/v/t1.0-0/s526x296/45700303_774376702900077_2989510362883162112_n.jpg?_nc_cat=104&_nc_ht=scontent-dfw5-1.xx&oh=d75998f58a9f45d2789bbabc9bfac320&oe=5CF38311'
        ],
        event: {
          title: 'First Collectible Bash',
          startTime: '2022-11-11T15:33:00.000Z',
          endTime: '2022-11-11T16:33:00.000Z',
          details:
          "We will be getting together in Erik's garage. Really looking forward to the BBQ.",
          location: "Erik's Garage"
        }
      })
    })
  })
})
