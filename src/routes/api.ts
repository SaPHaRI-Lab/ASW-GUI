import { Router } from 'express';
import { itemsController } from '../controllers/ItemsController';

var apiRouter = Router();

apiRouter.get('/items', itemsController.getItems);
apiRouter.post('/items', itemsController.addItem);

export default apiRouter;
