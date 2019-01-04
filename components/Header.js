import Link from 'next/link'
import Head from 'next/head'

const Header = (props) => (
  <div>
    <Head>
      <title>{props.title}</title>
      <meta 
        name='description' 
        content={props.description} />
    </Head>
    <header>
      <Link href="/">
        <a>Home</a>
      </Link>
      <Link href="/about">
        <a>About</a>
      </Link>
    </header>
  </div>
)

export default Header