
interface StoreItem {
  key: string;
  value: string | boolean | object;
}

export class Persistance {
  static handleError(action: string, error: any): boolean {
    console.error(`Error ${action}`, error);
    return false;
  }

  static storeData(item: StoreItem): boolean {
    try {
      sessionStorage.setItem(item.key, JSON.stringify(item.value));
      return true;
    } catch (error) {
      return this.handleError('saving data', error);
    }
  }

  static retrieveData(key: string): any | null {
    try {
      const result = sessionStorage.getItem(key);
      return result ? JSON.parse(result || '{}') : null;
    } catch (error) {
      return this.handleError('retrieving data', error);
    }
  }

  static removeData(key: string): boolean {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      return this.handleError('removing data', error);
    }
  }
}
