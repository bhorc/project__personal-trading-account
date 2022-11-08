import mapObject from 'map-obj'

class ContainsService {
  static second = 1000;
  static minute = 60 * this.second;
  static hour = 60 * this.minute;
  static day = 24 * this.hour;
  static month = 30 * this.day;
  static isEmpty(structure) {
    switch (true) {
      case this.isNil(structure):
      case this.isStringEmpty(structure):
      case this.isArrayEmpty(structure):
      case this.isObjectEmpty(structure):
        return true;
      default:
        return false;
    }
  }
  static async isJson(structure) {
    try {
      JSON.parse(structure);
      return true;
    } catch (error) {
      return false;
    }
  }
  static isNull(structure) {
    return typeof structure === 'object' && structure === null;
  }
  static isUndefined(structure) {
    return typeof structure === 'undefined';
  }
  static isNil(structure) {
    return this.isNull(structure) || this.isUndefined(structure);
  }
  static isString(structure) {
    return typeof structure === 'string';
  }
  static isNumber(structure) {
    return typeof structure === 'number';
  }
  static isArray(structure) {
    return structure instanceof Array;
  }
  static isObject(structure) {
    return structure instanceof Object;
  }
  static isStringEmpty(string) {
    return this.isString(string) && string.length === 0;
  }
  static isArrayEmpty(array) {
    return this.isArray(array) && array.length === 0;
  }
  static isObjectEmpty(obj) {
    return this.isObject(obj) && Object.keys(obj).length === 0;
  }
  static renameObj(data, filter) {
    return mapObject(data, (key, value) => [filter[key] || key, value], { deep: true });
  }
  static renameObjects(data, filter) {
    return data.map((item) => this.renameObj(item, filter));
  }
}

export default ContainsService;
