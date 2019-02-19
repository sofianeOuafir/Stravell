import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <html>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/static/images/favicon.png" />  
        <meta name="google-site-verification" content="_3GsWLdx2YWaGidwUcPqulfw4iEC1Vvh88fO9vZuzz0" />
        <script type="text/javascript" src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_PLACES_API_KEY}&libraries=places`}></script>
      </Head>
        <body className="custom_class">
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}