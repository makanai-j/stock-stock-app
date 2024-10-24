/// 参考url
/// https://qiita.com/al_tarte/items/eaaf404554f553fa3909

import fnv from 'fnv-plus'

class HashStr {
  private static str62 =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  private static str52 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

  static hash11(value: string | null | undefined = null): string {
    let hashStr = ''
    const baseNum = 62

    while (hashStr.length != 11 || !(value && hashStr != '')) {
      if (value === undefined || value === null) {
        const digit = 10 ** 5
        const num = new Date().getTime()
        const rand = Math.floor(Math.random() * digit)
        value = (num * digit + rand).toString()
      }

      let hashNum = Number('0x' + fnv.fast1a64(value))

      while (hashNum >= baseNum) {
        const remainder = hashNum % baseNum
        hashNum = Math.floor(hashNum / baseNum)

        hashStr += HashStr.str62[remainder]
      }

      hashStr += HashStr.str62[hashNum]
    }

    return hashStr
  }

  static randCode(num = 5): string {
    let randStr = ''
    // 引数が0でも一文字は返す
    const si = Math.floor(Math.random() * (HashStr.str52.length - 1))
    randStr += HashStr.str52[si]
    for (let i = 0; i < num - 1; i++) {
      const l = Math.floor(Math.random() * (HashStr.str62.length - 1))
      randStr += HashStr.str62[l]
    }
    return randStr
  }
}

export default HashStr
