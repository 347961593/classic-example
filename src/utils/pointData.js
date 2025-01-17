export const generatePointData = () => {
    const points = []
    // 生成北京市范围内的1000个随机点
    for (let i = 0; i < 1000; i++) {
      points.push({
        id: i,
        lat: 39.9 + Math.random() * 0.5 - 0.25, // 北京纬度范围
        lng: 116.3 + Math.random() * 0.5 - 0.25, // 北京经度范围
        value: Math.floor(Math.random() * 100),
        type: ['商业', '住宅', '公共设施'][Math.floor(Math.random() * 3)]
      })
    }
    return points
  }