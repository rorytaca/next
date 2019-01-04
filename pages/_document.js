import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render () {
    return (
      <html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
          />
          <link href="/static/stylesheets/global.css" rel="stylesheet" />
        </Head>
        <body>
          <div className="root">
            <Main />
          </div>
          <NextScript />
        </body>
      </html>
    )
  }
}