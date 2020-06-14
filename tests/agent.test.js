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
          title: 'CAR magazine UK hails the golden anniversary of Hot Wheels toy cars'
        },
        time: '2018-11-08T15:37:36.000Z',
        images: [
          'https://external-frt3-2.xx.fbcdn.net/safe_image.php?d=AQD9q4SUKocrn99Y&w=540&h=282&url=https%3A%2F%2Fcar-images.bauersecure.com%2Fpagefiles%2F84980%2Fhot_wheels_00.jpg&cfs=1&upscale=1&fallback=news_d_placeholder_publisher&_nc_hash=AQCL2vV3gmQ22YXO'
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
          title: 'This year is the 50th anniversary of Hot Wheels, and to celebrate, Mattel and Microsoft are partnering to bring Hot Wheels themed cars to Forza Motorsport 7. Forza Horizon 3 also received a Hot Wheels expansion pack of its own, so it\'s nice to see something similar come to Motorsport 7. In addition....'
        },
        time: '2018-11-09T15:21:13.000Z',
        images: [
          'https://external-frt3-2.xx.fbcdn.net/safe_image.php?d=AQAOY3cudgm46Q1Y&w=540&h=282&url=https%3A%2F%2Fwww.onmsft.com%2Fwp-content%2Fuploads%2F2018%2F11%2FHot-Wheels-Bone-Shaker-Forza-Motorsports-7-1031x580.jpg&cfs=1&upscale=1&fallback=news_d_placeholder_publisher&_nc_hash=AQBQ2wLDL1lTZuBx'
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
          'https://scontent-frx5-1.xx.fbcdn.net/v/t1.0-0/s526x296/45613776_774373762900371_5654657438293426176_o.jpg?_nc_cat=105&_nc_sid=8024bb&_nc_oc=AQn86jiKzEV3M4IjbrQXWlH8s31JkIKPTE4Jp5hkrY0rFzOcQXDyac8b34bBvl1gNp4&_nc_ht=scontent-frx5-1.xx&_nc_tp=7&oh=f9dfb1af6e2341cee97c77b0c7c04db5&oe=5F0D662E'
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
          'https://scontent-frx5-1.xx.fbcdn.net/v/t1.0-9/45494942_774372489567165_5172707475698221056_n.jpg?_nc_cat=105&_nc_sid=8024bb&_nc_oc=AQnQFJWFOIm4IypMosy8AOPVzJPjPLW6CKIgXUqCHeCNVZCtOeeOCqB5RXRZDqOtaBc&_nc_ht=scontent-frx5-1.xx&oh=c31f0278b77d45b8e7e6a9409688a949&oe=5F0CD0D2',
          'https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-9/45763732_774372542900493_9109028393843687424_n.jpg?_nc_cat=101&_nc_sid=8024bb&_nc_oc=AQkDf6fB6gDECFCb0svVmeYxyGZMfK_TsjHol6EA9yB5EC3CVDFvR66_Ls9wy2tgxNA&_nc_ht=scontent-frt3-2.xx&oh=04e77549e4d86cf0e146643e6efe9920&oe=5F0B345A',
          'https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-9/45622105_774372509567163_5978916529859723264_n.jpg?_nc_cat=101&_nc_sid=8024bb&_nc_oc=AQltDZMxSurCbbubpsn6rqFD9w6ktNq6ByGAgSLz1Mj6d_M8TnqDZRE6cDPmm6_xWeo&_nc_ht=scontent-frt3-2.xx&oh=e779cca71f58a35ab49d8078d6e83a94&oe=5F0A9340',
          'https://scontent-frx5-1.xx.fbcdn.net/v/t1.0-9/45622100_774372559567158_3822025249919074304_n.jpg?_nc_cat=100&_nc_sid=8024bb&_nc_oc=AQkzFqypJqXP4oSlC8Z2jIH7LvaqgWW4I9WvAlw-mDvNmM-wmHDIUqAev6JHmMdIB2k&_nc_ht=scontent-frx5-1.xx&oh=c7c0fb29f2805e3cd82c203b281f8a12&oe=5F0AE6CC'
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
          'https://scontent-frt3-1.xx.fbcdn.net/v/t1.0-0/p526x296/45643927_774376706233410_1326532251738963968_o.jpg?_nc_cat=106&_nc_sid=b386c4&_nc_oc=AQkJoEyOzy6WZNtne81q6BbaWgWwqkkTV0V41e9vtTKnk84RBgLxOCUZEYVGD_xUS8U&_nc_ht=scontent-frt3-1.xx&_nc_tp=6&oh=a188f3bfbe7be3f546525db1f592e56c&oe=5F098669'
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
