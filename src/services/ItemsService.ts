import { itemsRepository } from '../repositories/ItemsRepository';
import { Item } from '../types';

export class ItemsService {
  public async getItems(): Promise<Item[]> {
    return itemsRepository.getItems();
  }

  public async addItem(name: string): Promise<Item> {
    return itemsRepository.addItem(name);
  }
}

export const itemsService = new ItemsService();
