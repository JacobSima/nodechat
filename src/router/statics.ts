import express, { Application, Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import { resolve } from 'path';
import { isAuthenticated, isChatOwner } from '../middlewares'

export default(router: express.Router) => {
  router.get('/', (req, res) => {
    res.sendFile(resolve(__dirname, '../index.html'));
  })
};