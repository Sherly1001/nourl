import { SyntheticEvent } from 'react'
import { toast } from 'react-toastify'
import UrlsStore from '../../stores/UrlStore'
import * as yup from 'yup'

export function handleCopyToClipBoard(e: SyntheticEvent) {
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

export function handleDeleteUrl(code: string) {
  const trElement = document.querySelector(`tr[data-code="${code}"]`)
  trElement?.classList.add('delete')
}

export function handleCancelDeleteUrl(code: string) {
  const trElement = document.querySelector(`tr[data-code="${code}"]`)
  trElement?.classList.remove('delete')
}

export function handleConfirmDeleteUrl(urlsStore: UrlsStore, code: string) {
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

export function handleEditUrl(code: string) {
  const trElement = document.querySelector(`tr[data-code="${code}"]`)
  trElement?.classList.add('edit')
  const inputCodeElement = trElement?.querySelector(
    '.new-code'
  ) as HTMLInputElement
  const inputUrlElement = trElement?.querySelector(
    '.new-url'
  ) as HTMLInputElement
  const urlElement = trElement?.querySelector('.url') as HTMLInputElement
  const codeElement = trElement?.querySelector('.code') as HTMLInputElement
  inputCodeElement.focus()
  inputCodeElement.value = codeElement.innerText
  inputUrlElement.value = urlElement.innerText
}

export function handleKeyEnter(
  e: React.KeyboardEvent<HTMLInputElement>,
  urlsStore: UrlsStore,
  code: string
) {
  if (e.key === 'Enter') {
    handleConfirmEditUrl(urlsStore, code)
  }
}

export async function handleValidateEditUrl(
  urlsStore: UrlsStore,
  code: string
) {
  const trElement = document.querySelector(`tr[data-code="${code}"]`)
  const inputCodeElement = trElement?.querySelector(
    '.new-code'
  ) as HTMLInputElement
  const inputUrlElement = trElement?.querySelector(
    '.new-url'
  ) as HTMLInputElement
  const errorCode = trElement?.querySelector('.error-code') as HTMLInputElement
  const errorUrl = trElement?.querySelector('.error-url') as HTMLInputElement

  let customValidation = yup.object().shape({
    code: yup.string().required('Code is required'),
    url: yup.string().required('Url is required').url('Invalid url'),
  })

  const new_code = inputCodeElement.value
  const new_url = inputUrlElement.value
  errorCode.innerText = ''
  errorUrl.innerText = ''

  await customValidation
    .validate(
      {
        url: new_url,
        code: new_code,
      },
      { abortEarly: false }
    )
    .then(() => {
      toast.promise(urlsStore.updateUrl(code, new_code, new_url), {
        pending: 'Updating...',
        success: {
          render() {
            trElement?.classList.remove('edit')
            return `Updated`
          },
        },
        error: {
          render({ data }: any) {
            return `Update failed: ${data.response.data.msg}`
          },
        },
      })
    })
    .catch(function (err) {
      err.inner.forEach((e: { message: string; path: string }) => {
        if (e.path === 'code') {
          errorCode.innerText = e.message
        }
        if (e.path === 'url') {
          errorUrl.innerText = e.message
        }
      })
    })
}

export function handleCancelEditUrl(code: string) {
  const trElement = document.querySelector(`tr[data-code="${code}"]`)
  const errorCode = trElement?.querySelector('.error-code') as HTMLInputElement
  const errorUrl = trElement?.querySelector('.error-url') as HTMLInputElement
  errorCode.innerText = ''
  errorUrl.innerText = ''
  trElement?.classList.remove('edit')
}

export function handleConfirmEditUrl(urlsStore: UrlsStore, code: string) {
  handleValidateEditUrl(urlsStore, code)
}
