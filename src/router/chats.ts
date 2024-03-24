import express from 'express';
import { getChatMessages, sendChatMessages, updateChatMessage, deleteChatMessage} from '../controllers/chats';
import { isAuthenticated, isChatOwner } from '../middlewares'

export default(router: express.Router) => {
  router.get('/chats', [ isAuthenticated ], getChatMessages);
  router.post('/chats', [isAuthenticated], sendChatMessages);
  router.delete('/chats/:id', [isAuthenticated, isChatOwner], deleteChatMessage);
  router.patch('/chats/:id', [isAuthenticated, isChatOwner], updateChatMessage);
};