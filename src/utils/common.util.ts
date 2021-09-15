/**
 * @author songxiwen
 * @date  2021/9/12 17:38
 */
// eslint-disable-next-line import/prefer-default-export
export class CommonUtil {
  /**
   * 时间戳格式转换
   * @param date date类型的时间
   * @param format 日期格式 "yyy-MM-dd hh:mm:ss"
   */
  static formatDate(date: Date, format: string): string {
    const object: { [key: string]: number } = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds() // 毫秒
    };
    let formattedDate = format;
    if (/(y+)/.test(formattedDate)) {
      formattedDate = formattedDate.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
    }
    Object.keys(object).forEach((item: string) => {
      if (new RegExp(`(${item})`).test(formattedDate)) {
        const newWord = (RegExp.$1.length === 1)
          ? (object[item])
          : ((`00${object[item]}`).substr((`${object[item]}`).length));
        formattedDate = formattedDate.replace(RegExp.$1, newWord.toString());
      }
    });
    return formattedDate;
  }
}
