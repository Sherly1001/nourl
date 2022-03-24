import UrlService from '../services/UrlService'
import { makeAutoObservable } from 'mobx'
import { Url } from '../shared/interfaces'

class UrlsStore {
  urls: Array<Url>

  constructor() {
    makeAutoObservable(this)
    this.urls = []
  }

  async createNewUrl(url: string, code: string) {
    const res = await UrlService.createNewUrl(url, code)
    if (res.stt === 'ok') this.urls.unshift(res.data)
    return res.data
  }

  async getAllUrls() {
    const res = await UrlService.getAllUrls()
    this.setUrls(res.data)
    return res.data
  }

  setUrls(urls: Url[]) {
    this.urls = urls
  }

  async loadUrls() {
    const data = await this.getAllUrls()
    this.setUrls(data)
  }

  get getUrls() {
    return this.urls
  }
}

export default UrlsStore
