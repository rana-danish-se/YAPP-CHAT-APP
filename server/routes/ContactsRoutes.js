import express from 'express';
import {
  getAllContacts,
  getContactsForDMList,
  searchContact,
} from '../controllers/ContactsController.js';
import { verifyToken } from '../middlewares/AuthMiddleware.js';

const contactRouter = express.Router();

contactRouter.post('/search', verifyToken, searchContact);
contactRouter.get('/get-contacts-for-dm', verifyToken, getContactsForDMList);

contactRouter.get('/get-all-contacts', verifyToken, getAllContacts);

export default contactRouter;
