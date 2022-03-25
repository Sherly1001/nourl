import { observer } from 'mobx-react-lite'
import './urlstable.scss'
import useStores from '../../stores'
import { useEffect, SyntheticEvent } from 'react'
import { EditOutlined, LinkOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'

const UrlTable = () => {
  const { urlsStore } = useStores()

  useEffect(() => {
    urlsStore.getAllUrls()
  }, [])

  function handleCopyToClipBoard(e: SyntheticEvent) {
    const target = e.target as HTMLElement
    const copyElement = target.parentElement?.querySelector(
      '.copied'
    ) as HTMLElement
    copyElement?.classList.add('show')
    setTimeout(() => {
      copyElement?.classList.remove('show')
    }, 600)
    navigator.clipboard.writeText(target.innerText)
  }

  function handleDeleteUrl(code: string) {
    const trElement = document.querySelector(`tr[data-code="${code}"]`)
    trElement?.classList.add('delete')
  }

  function handleCancelDeleteUrl(code: string) {
    const trElement = document.querySelector(`tr[data-code="${code}"]`)
    trElement?.classList.remove('delete')
  }

  function handleConfirmDeleteUrl(code: string) {
    toast.promise(urlsStore.deleteUrl(code), {
      pending: 'Deleting...',
      success: 'Deleted',
      error: {
        render({ data }: any) {
          return `Delete failed: ${data.response.data.msg}`
        },
      },
    })
  }

  function handleEditUrl(code: string) {
    const trElement = document.querySelector(`tr[data-code="${code}"]`)
    trElement?.classList.add('edit')
    const inputCodeElement = trElement?.querySelector(
      '.new-code'
    ) as HTMLInputElement
    const urlElement = trElement?.querySelector('.url') as HTMLInputElement
    const inputUrlElement = trElement?.querySelector(
      '.new-url'
    ) as HTMLInputElement
    inputCodeElement.focus()
    inputCodeElement.value = code
    inputUrlElement.value = urlElement.innerText
  }

  function handleCancelEditUrl(code: string) {
    const trElement = document.querySelector(`tr[data-code="${code}"]`)
    trElement?.classList.remove('edit')
  }

  function handleConfirmEditUrl(code: string) {
    const trElement = document.querySelector(`tr[data-code="${code}"]`)
    trElement?.classList.add('edit')
    const inputCodeElement = trElement?.querySelector(
      '.new-code'
    ) as HTMLInputElement
    const inputUrlElement = trElement?.querySelector(
      '.new-url'
    ) as HTMLInputElement

    const newCode = inputCodeElement.value
    const newUrl = inputUrlElement.value
    toast.promise(urlsStore.updateUrl(code, newCode, newUrl), {
      pending: 'Updating...',
      success: 'Updated',
      error: {
        render({ data }: any) {
          return `Update failed: ${data.response.data.msg}`
        },
      },
    })
  }

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
                  <tr data-code={url.code} key={url.id}>
                    <td>{index + 1}</td>
                    <td>
                      <p className="url">{url.url}</p>
                      <input
                        type="text"
                        className="new-url"
                        placeholder="Enter new url"
                      />
                    </td>
                    <td>
                      <p className="code">{url.code}</p>
                      <input
                        type="text"
                        className="new-code"
                        placeholder="Enter new code"
                      />
                    </td>
                    <td>
                      <span
                        className="shorten-url"
                        onClick={handleCopyToClipBoard}
                      >
                        {`${import.meta.env.VITE_API_URL}/${url.code}`}
                        <span className="copied" aria-hidden={true}>
                          Copied
                        </span>
                      </span>
                      <a
                        href={`${import.meta.env.VITE_API_URL}/${url.code}`}
                        target="_blank"
                        className="redirect-url"
                      >
                        <LinkOutlined />
                      </a>
                    </td>
                    <td>
                      <div className="button-box">
                        <button
                          className="delete-url"
                          onClick={() => handleDeleteUrl(url.code)}
                        >
                          Delete
                        </button>

                        <button
                          className="edit-url"
                          onClick={() => handleEditUrl(url.code)}
                        >
                          <EditOutlined />
                        </button>
                        <div className="confirm-edit">
                          <button
                            className="cancel-edit"
                            onClick={() => handleCancelEditUrl(url.code)}
                          >
                            Cancel
                          </button>
                          <button
                            className="ok-edit"
                            onClick={() => handleConfirmEditUrl(url.code)}
                          >
                            OK
                          </button>
                        </div>
                        <div className="confirm-delete">
                          <button
                            className="cancel-delete"
                            onClick={() => handleCancelDeleteUrl(url.code)}
                          >
                            Cancel
                          </button>
                          <button
                            className="ok-delete"
                            onClick={() => handleConfirmDeleteUrl(url.code)}
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
