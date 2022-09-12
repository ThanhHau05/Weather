import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
        <link
      href="https://fonts.googleapis.com/css?family=Sarabun:normal,300,400,500,600,700,400italic,700italic&display=swap"
      rel="stylesheet"
    />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument