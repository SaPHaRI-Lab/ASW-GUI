import { Request, Response } from 'express';
import { itemsService } from '../services/ItemsService';
import { ApiResponse, Item } from '../types';

export class ItemsController {
  public async getItems(req: Request, res: Response): Promise<void> {
    try {
      const items = await itemsService.getItems();
      res.status(200).json({
        success: true,
        data: items
      } as ApiResponse);
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message
      } as ApiResponse);
    }
  }

  public async addItem(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      const newItem = await itemsService.addItem(name);
      res.status(200).json({
        success: true,
        data: newItem
      } as ApiResponse);
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message
      } as ApiResponse);
    }
  }
}

export const itemsController = new ItemsController();
