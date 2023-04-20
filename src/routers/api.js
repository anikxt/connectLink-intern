import { auth, guest } from '../middlewares/index.js';
import { authController, postController } from '../controllers/index.js';
import { Router } from 'express';

const apiRouter = Router();

apiRouter.get('/protected', authController().protected);
apiRouter.get('/login', guest, authController().login);
apiRouter.post('/login', authController().postLogin);
apiRouter.get('/register', guest, authController().register);
apiRouter.post('/register', authController().postRegister);
apiRouter.post('/logout', authController().logout);

apiRouter.get('/', auth, postController().index);
apiRouter.get('/createpost', auth, postController().createPost);
apiRouter.post('/createpost', auth, postController().postPost);
apiRouter.get('/postrecipe', auth, postController().createRecipe);
apiRouter.post('/postrecipe', auth, postController().postRecipe);

apiRouter.post('/requestrecipe', auth, postController().requestRecipe);
apiRouter.get('/recipe', auth, postController().recipe);

export default apiRouter;
