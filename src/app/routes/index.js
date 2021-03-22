import { Router } from 'express';

const routes = new Router();

routes.get('/', (req, res) => res.json({ message: 'DALE' }));

export default routes;
