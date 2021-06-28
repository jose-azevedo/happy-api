import { Router } from 'express';
import multer from 'multer';

import uploadConfig from './config/upload'
import DashboardController from './Controllers/DashboardController';
import OrphanagesController from './Controllers/OrphanagesController';
import UsersController from './Controllers/UsersController';

const routes = Router();
const upload = multer(uploadConfig);

routes.get('/orphanages', OrphanagesController.index);
routes.get('/orphanages/:id', OrphanagesController.show);
routes.post('/orphanages', upload.array('images'), OrphanagesController.create);

routes.post('/users', UsersController.create);
routes.post('/users/login', UsersController.login);

routes.get('/dashboard', DashboardController.index)

  export default routes;