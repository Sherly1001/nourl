import { observer } from 'mobx-react-lite'
import './urlstable.scss'
import useStores from '../../stores'
import { useEffect } from 'react'
import { EditOutlined, LinkOutlined } from '@ant-design/icons'
import {
  handleCopyToClipBoard,
  handleDeleteUrl,
  handleCancelDeleteUrl,
  handleConfirmDeleteUrl,
  handleEditUrl,
  handleKeyEnter,
  handleCancelEditUrl,
  handleConfirmEditUrl,
} from './UrlsTableFunction'
import { go_url } from '../../utils/const'

const UrlTable = () => {
  const { urlsStore } = useStores()

  useEffect(() => {
    urlsStore.getAllUrls()
  }, [])

  return (
    <div className="myurls">
      <div className="myurls-content">
        <h2>Your recent URLS</h2>
        <div className="urls-box">
          <table>
            <tbody>
              <tr>
                <th>No.</th>
                <th>Long URl</th>
                <th>Code</th>
                <th>URL shortened</th>
                <th></th>
              </tr>
              {urlsStore.urls
                .slice()
                .reverse()
                .map((url, index) => (
                  <tr data-url-id={url.id} key={url.id}>
                    <td>{index + 1}</td>
                    <td>
                      <p className="url">{url.url}</p>
                      <input
                        type="text"
                        className="new-url"
                        placeholder="Enter new url"
                        onKeyDown={(event) =>
                          handleKeyEnter(event, urlsStore, url.id, url.code)
                        }
                      />
                      <p className="error-url"></p>
                    </td>
                    <td>
                      <p className="code">{url.code}</p>
                      <input
                        type="text"
                        className="new-code"
                        placeholder="Enter new code"
                        onKeyDown={(event) =>
                          handleKeyEnter(event, urlsStore, url.id, url.code)
                        }
                      />
                      <p className="error-code"></p>
                    </td>
                    <td>
                      <div className="td-box">
                        <span
                          className="shortened-url"
                          onClick={handleCopyToClipBoard}
                        >
                          {`${go_url}/${encodeURI(url.code)}`}

                          <span className="copied" aria-hidden={true}>
                            Copied
                          </span>
                        </span>
                        <a
                          href={`${go_url}/${url.code}`}
                          target="_blank"
                          className="redirect-url"
                        >
                          <LinkOutlined />
                        </a>
                      </div>
                    </td>
                    <td>
                      <div className="button-box">
                        <button
                          className="delete-url"
                          onClick={() => handleDeleteUrl(url.id)}
                        >
                          Delete
                        </button>

                        <button
                          className="edit-url"
                          onClick={() => handleEditUrl(url.id)}
                        >
                          <EditOutlined />
                        </button>
                        <div className="confirm-edit">
                          <button
                            className="cancel-edit"
                            onClick={() => handleCancelEditUrl(url.id)}
                          >
                            Cancel
                          </button>
                          <button
                            className="ok-edit"
                            onClick={() =>
                              handleConfirmEditUrl(urlsStore, url.id, url.code)
                            }
                          >
                            OK
                          </button>
                        </div>
                        <div className="confirm-delete">
                          <button
                            className="cancel-delete"
                            onClick={() => handleCancelDeleteUrl(url.id)}
                          >
                            Cancel
                          </button>
                          <button
                            className="ok-delete"
                            onClick={() =>
                              handleConfirmDeleteUrl(urlsStore, url.code)
                            }
                          >
                            OK
                          </button>
                        </div>
                      </div>
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
