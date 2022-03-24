import { observer } from 'mobx-react-lite'
import './urlstable.scss'
import useStores from '../../stores'
import { ChangeEvent, useEffect, FormEvent, SyntheticEvent } from 'react'

const UrlTable = () => {
  const { urlsStore } = useStores()

  useEffect(() => {
    urlsStore.getAllUrls()
  }, [])

  function handleCopyToClipBoard(e: SyntheticEvent) {
    const target = e.target as HTMLElement
    navigator.clipboard.writeText(target.innerText)
  }

  return (
    <div className="myurl">
      <div className="myurl-content">
        <h2>Your recent URLS</h2>
        <div className="urls-box">
          <table>
            <tbody>
              <tr>
                <th>No.</th>
                <th>Long URl</th>
                <th>Code</th>
                <th>URL shortened</th>
              </tr>
              {urlsStore.urls.map((url, index) => (
                <tr key={url.id}>
                  <td>{index + 1}</td>
                  <td>
                    <p className="url">{url.url}</p>
                  </td>
                  <td>
                    <p className="code">{url.code}</p>
                  </td>
                  <td>
                    <p className="shorten-url" onClick={handleCopyToClipBoard}>
                      {`${import.meta.env.VITE_API_URL}/${url.code}`}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default observer(UrlTable)
