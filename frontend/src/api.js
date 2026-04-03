import axios from 'axios'

const API = axios.create({
  baseURL: '/api',
})

export const quizApi = {
  getQuestions: () => API.get('/quiz/questions').then(res => res.data),
  evaluate: (answers) => API.post('/quiz/evaluate', { answers }).then(res => res.data),
}

export const portfolioApi = {
  get: (profile) => API.get('/portfolio/' + profile).then(res => res.data),
}

export const simulationApi = {
  run: (params) => API.get('/report/summary/' + params.profile, { params }).then(res => res.data),
}

export const reportApi = {
  getInsight: (params) => API.post('/report/insight', params).then(res => res.data),
}

export default API
