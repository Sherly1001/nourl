import { useMatch, useResolvedPath, Link } from 'react-router-dom'
import { LinkProps } from 'react-router-dom'

const LinkCustom = ({ children, to, className }: LinkProps) => {
  const resolved = useResolvedPath(to)
  const match = useMatch({ path: resolved.pathname, end: true })
  return (
    <Link to={to} className={`${className} ${match ? 'active' : ''}`}>
      {children}
    </Link>
  )
}

export default LinkCustom
