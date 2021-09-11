import { SectionApiService } from "@/api.service";
import type { SectionTreeNodeType, SectionCreateRequestType, SectionResponseType } from 'edu-graph-constant'

interface SectionTreeModelInterface {
  tree: SectionTreeNodeType[];
  expandedKeys: string[];
  autoExpandParent: boolean;
  checkedKeys: string[];
  selectedKeys: string[];

  generate(): Promise<this>;
  create(params: SectionCreateRequestType): Promise<SectionResponseType | undefined>;
}

export class SectionTreeModel implements SectionTreeModelInterface {
  tree!: SectionTreeNodeType[];
  expandedKeys: string[];
  autoExpandParent: boolean;
  checkedKeys: string[];
  selectedKeys: string[];

  constructor(
    private readonly repositoryId: string,
    private readonly initData?: {
      expandedKeys: string[];
      autoExpandParent: boolean;
      checkedKeys: string[];
      selectedKeys: string[];
    }
  ) {
    this.expandedKeys = initData?.expandedKeys || [];
    this.autoExpandParent = initData?.autoExpandParent || false;
    this.checkedKeys = initData?.checkedKeys || [];
    this.selectedKeys = initData?.selectedKeys || [];
  }

  async generate(): Promise<this> {
    const response = await SectionApiService.getSectionTree({ repositoryId: this.repositoryId });
    if (response.data) {
      this.tree = response.data
    }
    return this;
  }

  async create(params: SectionCreateRequestType): Promise<SectionResponseType | undefined> {
    const response = await SectionApiService.createSectionTree(params);
    if (response.data) {
      await this.generate();
      return response.data;
    }
    return undefined;
  }

  // get sectionTree(): SectionTreeNodeType {
  //   return this.tree
  // }
}
