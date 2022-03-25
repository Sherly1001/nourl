import axios from './custom_axios'

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

  async updateUrl(oldCode: string, newCode: string, newUrl: string) {
    const res = await axios.put('/api/urls/update', {
      oldCode,
      info: {
        code: newCode,
        url: newUrl,
      },
    })
    return res.data
  }

  async deleteUrl(code: string) {
    const res = await axios.delete(`/api/urls/${code}`)
    return res.data
  }
}

export default new UrlService()
