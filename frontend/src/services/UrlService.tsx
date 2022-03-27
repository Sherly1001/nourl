import axios from './custom_axios'
import { Url } from '../shared/interfaces'

class UrlService {
  async getAllUrls() {
    const res = await axios.get('/api/urls')
    return res.data
  }

  async getUrlWithCode(code: string) {
    const res = await axios.get(`/api/urls/${code}`)
    return res.data
  }

  async createNewUrl(url: string, code: string) {
    const res = await axios.post('/api/urls/create', {
      code,
      url,
    })
    return res.data
  }

  async updateUrl(old_code: string, new_code: string, new_url: string) {
    let res: { data: { stt: string; data: Url } }
    if (old_code === new_code) {
      res = await axios.put('/api/urls/update', {
        old_code,
        info: {
          url: new_url,
        },
      })
    } else {
      res = await axios.put('/api/urls/update', {
        old_code,
        info: {
          code: new_code,
          url: new_url,
        },
      })
    }
    return res.data
  }

  async deleteUrl(code: string) {
    const res = await axios.delete(`/api/urls/${code}`)
    return res.data
  }
}

export default new UrlService()
