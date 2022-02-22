/**
 * Created by Labbor on 2017/8/28.
 */

class Dictionary {
  constructor(datastore) {
    if (datastore)
      this.datastore = datastore;
    else
      this.datastore = {};
    //this.print()
  }

  /**
   * 根据key查询结果
   * @param key
   * @param def  可选.无结果时返回的默认值
   * @returns {*}
   */
  find(key, def) {
    if (this.datastore.hasOwnProperty(key)) {
      return this.datastore[key];
    }
    return def || "";
  }

  /**
   * 根据value查询结果
   * @param value
   * @param def  可选.无结果时返回的默认值
   * @returns {*}
   */
  findKeyByValue(value, def) {
    for (let o in this.datastore) {
      if (this.datastore[o] == value) {
        return o;
      }
    }
    return def || "";
  }

  /**
   * 根据key数组查询结果
   * @param keys
   * @param def
   * @returns {string}
   */
  findByKeys(keys, def) {
    let result = "";
    if (keys && Array.isArray(keys)) {
      keys.forEach(type => result += this.find(type, def))
    }
    return result;
  }

  /**
   * 根据key拼接的字符串, 获取结果
   * @param keysStr
   * @param separator
   * @param def
   * @returns {string}
   */
  findByKeysStr(keysStr, separator, def) {
    let keys = (keysStr + '').split(separator || ',');
    return this.findByKeys(keys, def);
  }

  /**
   * obj属性转为 label/value的数组
   */
  toArray(def) {
    if (!this.datastore) return def;
    if (Array.isArray(this.datastore)) return this.datastore;

    let arr = [];
    for (let key in this.datastore) {
      arr.push({label: this.datastore[key], value: key});
    }
    return arr;
  }

  add() {
  }

  remove() {
  }

  clear() {
  }

  print() {
    console.log(this);
  }
}

class DynamicDictionary extends Dictionary {

  constructor(httpGet) {
    super(null);
    this.getData(httpGet);
  }

  async getData(httpGet) {
    let resp = await httpGet();
    this.datastore = resp || [];
  }
}
export {
  Dictionary,
  DynamicDictionary
}
