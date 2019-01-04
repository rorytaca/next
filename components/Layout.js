import Header from './Header'
import Footer from './Footer'

const Layout = (props) => (
  <div className="app">
    <Header
      title={props.title}
      description={props.description} />
    <main>{props.children}</main>
    <Footer />
  </div>
)

export default Layout