import LinkCustom from '../comps/Header/LinkCustom'

const NoPage = () => {
  return (
    <div className="nopage">
      <h1>404 - Looks like you're lost.</h1>
      <p className="header">Something Missing</p>
      <p className="desc">
        This page is missing or you assembled the link incorrectly.
      </p>
      <LinkCustom to="/" className="button">
        Return Home
      </LinkCustom>
    </div>
  )
}

export default NoPage
