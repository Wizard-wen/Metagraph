export interface Knowledge {

}

export interface KnowledgeMapInterface {
  // 搜索知识点
  search(): void;
  // 搜索知识点之间的最短路径
  findPath(from: Knowledge, to: Knowledge): void;
  // 放大地图
  zoomIn(): void;
  // 缩小地图
  zoomOut(): void;
  // 针对知识点，生成学习路径
  generateLearningPath(): void
}
