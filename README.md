# fbnix
Agent library for scraping Facebook

This library is in early development. The intention is the ability to scrape Facebook pages and groups (something Facebook does not provide full APIs for). I created this to build services that can pull updates from pages (such as events) without having to join Facebook.

Fbnix uses Puppeteer (headless Chromium) to render and scrape data from Facebook.

## Contributing
Running integration tests:

```
npm test
```

You can also run the integration tests with caching. This saves the DOM fetched from Facebook so subsequent test runs are faster.

```
npm test -- --cache
```
*To reset the cache delete the `tests\cache\` folder*