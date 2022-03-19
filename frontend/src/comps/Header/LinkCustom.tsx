import { useMatch, useResolvedPath, Link } from 'react-router-dom'
import { LinkProps } from 'react-router-dom'

const LinkCustom = ({ children, to }: LinkProps) => {
  const resolved = useResolvedPath(to)
  const match = useMatch({ path: resolved.pathname, end: true })
  return (
    <Link to={to} className={match ? 'active' : ''}>
      {children}
    </Link>
  )
}

export default LinkCustom
