export type TreeItemType = {
  title: string,
  name: string,
  key: string,
  data?: { [key: string]: any },
  children?: TreeItemType[]
}

export type TreeItemUIType = {
  title: string,
  name: string,
  key: string,
  data?: { [key: string]: any },
  isActive: boolean;
  isExpand: boolean;
  children?: TreeItemType[]
}
