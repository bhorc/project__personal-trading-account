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
}

export default ContainsService;
