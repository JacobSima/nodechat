import express from 'express';
import { getMessages, addMessage, getSingleChat, getSingleMessage, updateMessage, deleteMessage } from "../db/chats";
import { Message } from "../types/interfaces";
import { get } from 'lodash';

export const getChatMessages = async(req: express.Request, res: express.Response) => {
  try {
    const messages = await getMessages();
    return res.status(200).json(messages);
  } catch(error){
    console.log(error);
    return res.sendStatus(400);
  }
}

export const sendChatMessages = async(req: express.Request, res: express.Response) => {
  try{
    const { content} = req.body;
    const currentUserId = get(req, 'identity._id');
    const message: Message = {
      sender: currentUserId,
      content
    };
    const messages: any = await addMessage(message);

    return res
      .status(200)
      .json(messages)
      .end();

  }catch(error){
    console.log(error);
    return res.sendStatus(400);
  }
}

export const updateChatMessage = async(req: express.Request, res: express.Response) => {
  try {
    const { content } = req.body;
    const { id } = req.params;
    
    if(!content)
      return res.sendStatus(400);
  
    const chat = await getSingleChat();
    if(!chat)
      return res.sendStatus(400);

    let message: any = await getSingleMessage(id);
    if(!message)
      return res.sendStatus(400);

    message = await updateMessage(id, content);

    return res.status(200).json(message).end();
    
  } catch(error){
    console.log(error);
    return res.sendStatus(400); 
  }
}

export const deleteChatMessage = async(req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const chat = await getSingleChat();
    if(!chat)
      return res.sendStatus(400);

    let message: any = await getSingleMessage(id);
    if(!message)
      return res.sendStatus(400);

    await deleteMessage(id);

    return res.status(200).end();
    
  } catch(error){
    console.log(error);
    return res.sendStatus(400); 
  }
}