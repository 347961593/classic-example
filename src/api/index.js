import { generatePointData } from '../utils/pointData'
import { generateBuildingData } from '../utils/buildingData'

// 模拟API延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const mapApi = {
  // 获取聚合点数据
  async getPoints() {
    await delay(500) // 模拟网络延迟
    return generatePointData()
  },

  // 获取建筑数据
  async getBuildings() {
    await delay(500)
    return generateBuildingData()
  },

  // 空间分析API
  async bufferAnalysis(point, radius) {
    await delay(300)
    // 返回缓冲区结果
    return {
      center: point,
      radius: radius,
      affectedPoints: Math.floor(Math.random() * 50)
    }
  }
}