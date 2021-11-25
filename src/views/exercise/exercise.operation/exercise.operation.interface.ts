export interface ExerciseOperationInterface {
  // 高亮题目中涉及的知识点
  highLightKnowledge(): void;

  // 为习题添加标签
  addTag(): void;

  // 编辑题解
  editAnswer(): void;

  // 为当前题目涉及的知识点构图
  generateGraphOfTheExercise(): void;
}
