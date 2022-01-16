/**
 * @author songxiwen
 * @date  2022/1/10 10:55
 */
import { message } from 'ant-design-vue';
import type { SectionArticleUpdateRequestType } from 'metagraph-constant';
import { reactive } from 'vue';
import { SectionApiService, SectionNoAuthApiService } from '@/api.service';

export const sectionModel = reactive<{
  title: string;
  content: string;
  contentHtml: string;
}>({
  title: '',
  content: '',
  contentHtml: ''
});

export class SectionArticle {
  async getSectionArticle(sectionId: string): Promise<void> {
    const result = await SectionNoAuthApiService
      .getSectionArticle({ sectionId });
    if (!result.data) {
      message.error('获取单元文章时失败！');
    } else {
      sectionModel.content = result.data.article.content;
      sectionModel.contentHtml = result.data.article.contentHtml;
      sectionModel.title = result.data.article.title;
    }
  }

  // todo 暂时用不到这个方法
  async saveSectionArticle(params: SectionArticleUpdateRequestType): Promise<void> {
    const result = await SectionApiService.saveSectionArticle(params);
    if (result.code !== 0) {
      message.error('文章保存失败！');
    }
  }
}
