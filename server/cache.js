function getCacheKey (req) {
  return `${req.url}`
}

exports.renderAndCache = async function(app, ssrCache, req, res, pagePath, queryParams) {
  const key = getCacheKey(req)

  // If page is in the cache serve it
  if (ssrCache.has(key)) {
    console.log('cache hit')
    res.setHeader('x-cache', 'HIT')
    return res.send(ssrCache.get(key))
  }

  // If page is not cached, render it
  try {
    console.log('non-cached')

    const html = await app.renderToHTML(req, res, pagePath, queryParams)

    // Something is wrong with the request, let's skip the cache
    if (res.statusCode !== 200) {
      return res.send(html)
    }

    // Let's cache this page
    ssrCache.set(key, html)

    res.setHeader('x-cache', 'MISS')
    res.send(html)
  } catch (err) {
    app.renderError(err, req, res, pagePath, queryParams)
  }
}