import { Router } from 'express';

interface Route {
  router: Router;
  url: string;
}

export default Route;