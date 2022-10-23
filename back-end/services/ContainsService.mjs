class ContainsService {
  static async isEmpty(structure) {
    switch (true) {
      case !structure:
      case typeof structure === 'string' && structure.length === 0:
      case structure instanceof Array && structure.length === 0:
      case structure instanceof Object && Object.keys(structure).length === 0:
        return true;
      default:
        return false;
    }
  }
  static async isEmptyString(string) {
    return string && string.length === 0;
  }
  static async isJson(structure) {
    try {
      JSON.parse(structure);
      return true;
    } catch (error) {
      return false;
    }
  }
  static async isArray(structure) {
    return structure instanceof Array;
  }
}

export default ContainsService;
