# fbnix
Agent library for scraping Facebook

This library is in early development. The intention is the ability to scrape Facebook pages and groups (something Facebook does not provide full APIs for). I created this to build services that can pull updates from pages (such as events) without having to join Facebook.

Fbnix uses Puppeteer (headless Chromium) to render and scrape data from Facebook.

## Usage
Install Fbnix:
```
npm i fbnix
```

### Example to get post ids of [a page](https://facebook.com/774371002900647):
```js
const Fbnix = require('fbnix')

const agent = new Fbnix()

agent.getPagePostIds(774371002900647).then(postIds => {
  console.log(postIds)
})
```
Outputs:
```console
[ '774949562842791',
  '774949062842841',
  '774938299510584',
  '774377139566700',
  '299449697564073',
  '774374466233634',
  '774373759567038',
  '774372742900473',
  '774371639567250' ]
```

### Example with [a post](https://facebook.com/774371639567250):
```js
const Fbnix = require('fbnix')

const agent = new Fbnix()

agent.getPost(774371639567250).then(post => {
  console.log('  Post by: ', post.by)
  console.log('Post date: ', post.date)
  console.log('Post text: ', post.text)
})
```
Outputs:
```console
  Post by:  Billy's Collectibles
Post date:  2018-11-08T15:25:05.000Z
Post text:  Here is the first post! Welcome!
```

### Further examples:
The best place to look is the [integration tests](https://github.com/justinkalland/fbnix/blob/master/tests/agent.test.js)

## Contributing
Running integration tests:

```
npm test
```

You can also run the integration tests with caching. This saves the DOM fetched from Facebook so subsequent test runs are faster. This doesn't provide code coverage.

```
npm run test-cache
```
*To reset the cache delete the `tests\cache\` folder*