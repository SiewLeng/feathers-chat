import path from 'path';
import favicon from 'serve-favicon';
import compress from 'compression';
import helmet from 'helmet';
import cors from 'cors';

import feathers from '@feathersjs/feathers';
import configuration from '@feathersjs/configuration';
import express from '@feathersjs/express';
import socketio from '@feathersjs/socketio';


import { Application } from './declarations';
import logger from './logger';
import middleware from './middleware';
import services from './services';
import appHooks from './app.hooks';
import channels from './channels';
import { HookContext as FeathersHookContext } from '@feathersjs/feathers';
import mongoose from './mongoose';
// Don't remove this comment. It's needed to format import lines nicely.

const app: Application = express(feathers());
export type HookContext<T = any> = { app: Application } & FeathersHookContext<T>;

// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio());

app.configure(mongoose);

// Configure other middleware (see `middleware/index.ts`)
app.configure(middleware);
// Set up our services (see `services/index.ts`)
app.configure(services);
// Set up event channels (see channels.ts)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger } as any));

app.hooks(appHooks);


app.service('users').find({
  query: { email: 'strawberry@gmail.com'}
}).then((result) => {
  console.log(result);
});

/*
app.service('users').create({
  id: '09f8348a-b2fb-477f-bd6e-a634dfb33b62',
  email: 'siewleng.lim@gmail.com',
  password: '123456',
  dateOfBirth: new Date('12/04/9170'),
  hobbies: ['running', 'watching kdrama']
});
*/

/*
app.service('users').create({
  id: 'e4c46a7a-19cf-40ad-a97d-a8ded41c4ae6',
  email: 'sherry.ong@gmail.com',
  password: '123456',
  dateOfBirth: new Date('12/04/1988'),
  hobbies: ['dining korean food']
});
*/

/*
app.service('messages').create({
  id: '7a429ee7-2624-41b5-9fde-9ae95f1c841e',
  userId: '09f8348a-b2fb-477f-bd6e-a634dfb33b62',
  text: 'Where are you?'
});
*/

export default app