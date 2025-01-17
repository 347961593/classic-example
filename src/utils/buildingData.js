export const generateBuildingData = () => {
    const buildings = []
    // 生成100个建筑物数据
    for (let i = 0; i < 100; i++) {
      buildings.push({
        id: i,
        position: [
          116.3 + Math.random() * 0.5 - 0.25,
          39.9 + Math.random() * 0.5 - 0.25
        ],
        height: 20 + Math.random() * 100, // 20-120米
        color: '#' + Math.floor(Math.random()*16777215).toString(16),
        name: `Building ${i}`,
        type: ['办公', '商场', '住宅'][Math.floor(Math.random() * 3)]
      })
    }
    return buildings
  }