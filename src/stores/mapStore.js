import { defineStore } from 'pinia'
import { mapApi } from '../api'

export const useMapStore = defineStore('map', {
  state: () => ({
    pointData: [], // 聚合点数据
    analysisResult: null // 空间分析结果
  }),
  actions: {
    async fetchPointData() {
      try {
        this.pointData = await mapApi.getPoints()
      } catch (error) {
        console.error('Failed to fetch point data:', error)
        // 可以在这里添加错误处理，比如显示提示消息
      }
    },
    async performBufferAnalysis(point, radius) {
      try {
        this.analysisResult = await mapApi.bufferAnalysis(point, radius)
      } catch (error) {
        console.error('Failed to perform buffer analysis:', error)
      }
    },
  }
})
