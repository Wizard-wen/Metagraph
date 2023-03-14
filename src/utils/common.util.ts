/**
 * @author songxiwen
 * @date  2021/9/12 21:38
 */

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
    Object.keys(object)
      .forEach((item: string) => {
        if (new RegExp(`(${item})`).test(formattedDate)) {
          const newWord = (RegExp.$1.length === 1)
            ? (object[item])
            : ((`00${object[item]}`).substr((`${object[item]}`).length));
          formattedDate = formattedDate.replace(RegExp.$1, newWord.toString());
        }
      });
    return formattedDate;
  }

  static async changeFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  static timeAgo(dateTimeStamp: number): string | undefined {
    let result;
    const minute = 1000 * 60; // 把分，时，天，周，半个月，一个月用毫秒表示
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const halfamonth = day * 15;
    const month = day * 30;
    const now = new Date().getTime(); // 获取当前时间毫秒
    console.log(now);
    const diffValue = now - dateTimeStamp;// 时间差

    if (diffValue < 0) {
      return undefined;
    }
    const minC = diffValue / minute; // 计算时间差的分，时，天，周，月
    const hourC = diffValue / hour;
    const dayC = diffValue / day;
    const weekC = diffValue / week;
    const monthC = diffValue / month;
    if (monthC >= 1 && monthC <= 3) {
      result = ` ${parseInt(monthC.toString(), 10)}月前`;
    } else if (weekC >= 1 && weekC <= 3) {
      result = ` ${parseInt(weekC.toString(), 10)}周前`;
    } else if (dayC >= 1 && dayC <= 6) {
      result = ` ${parseInt(dayC.toString(), 10)}天前`;
    } else if (hourC >= 1 && hourC <= 23) {
      result = ` ${parseInt(hourC.toString(), 10)}小时前`;
    } else if (minC >= 1 && minC <= 59) {
      result = ` ${parseInt(minC.toString(), 10)}分钟前`;
    } else if (diffValue >= 0 && diffValue <= minute) {
      result = '刚刚';
    } else {
      const datetime = new Date();
      datetime.setTime(dateTimeStamp);
      const Nyear = datetime.getFullYear();
      const Nmonth = datetime.getMonth() + 1 < 10 ? `0${datetime.getMonth() + 1}` : datetime.getMonth() + 1;
      const Ndate = datetime.getDate() < 10 ? `0${datetime.getDate()}` : datetime.getDate();
      const Nhour = datetime.getHours() < 10 ? `0${datetime.getHours()}` : datetime.getHours();
      const Nminute = datetime.getMinutes() < 10 ? `0${datetime.getMinutes()}` : datetime.getMinutes();
      const Nsecond = datetime.getSeconds() < 10 ? `0${datetime.getSeconds()}` : datetime.getSeconds();
      result = `${Nyear}-${Nmonth}-${Ndate}`;
    }
    return result;
  }
}
