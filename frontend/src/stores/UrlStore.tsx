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

  async createNewUrl(url: string, code: string) {
    const res = await UrlService.createNewUrl(url, code)
    if (res.stt === 'ok') this.urls = [...this.urls, res.data]
    return res.data
  }

  async getAllUrls() {
    const res = await UrlService.getAllUrls()
    this.setUrls(res.data)
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
      const urls = this.urls.find((url) => url.code === old_code)
      urls!.code = new_code
      urls!.url = new_url
    }
    return res.data
  }
}

export default UrlsStore
