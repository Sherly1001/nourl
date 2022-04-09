import UrlService from '../services/UrlService'
import { makeAutoObservable } from 'mobx'
import { Url } from '../shared/interfaces'

class UrlsStore {
  urls: Array<Url>

  constructor() {
    makeAutoObservable(this)
    this.urls = []
  }

  setUrls(urls: Url[]) {
    this.urls = urls
  }

  get getUrls() {
    return this.urls
  }

  setUrl(url: Url, new_code: string, new_url: string) {
    url.url = new_url
    url.code = new_code
  }

  async createNewUrl(url: string, code: string) {
    const res = await UrlService.createNewUrl(url, code)
    if (res.stt === 'ok') this.urls = [...this.urls, res.data]
    return res.data
  }

  async getAllUrls() {
    const res = await UrlService.getAllUrls()
    this.setUrls(res.data.reverse())
    return res.data
  }

  async deleteUrl(code: string) {
    const res = await UrlService.deleteUrl(code)
    if (res.stt === 'ok')
      this.urls = this.urls.filter((url) => url.code !== code)
    return res.data
  }

  async updateUrl(old_code: string, new_code: string, new_url: string) {
    const res = await UrlService.updateUrl(old_code, new_code, new_url)
    if (res.stt === 'ok') {
      const index = this.urls.findIndex((url) => url.code === old_code)
      this.setUrl(this.urls[index], new_code, new_url)
    }
    return res.data
  }

  sortUrlsByCodeDown() {
    this.urls.sort((a, b) => a.code.localeCompare(b.code))
  }

  sortUrlsByCodeUp() {
    this.urls.sort((a, b) => b.code.localeCompare(a.code))
  }

  sortUrlsByTime() {
    this.urls.sort((a, b) => a.id.localeCompare(b.code))
  }
}

export default UrlsStore
