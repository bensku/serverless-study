import { Router } from 'itty-router';
import { Comment, TopicDetails } from './api';

export class TopicActor {
  state: DurableObjectState;
  router: Router;

  constructor(state: DurableObjectState) {
    this.state = state;
    this.router = Router();
    this.router.put('/init', async (req) => {
      const details: TopicDetails = await req.json?.()
      this.state.storage.put('meta', details.topic);
      this.state.storage.put('comments', details.comments);
      return new Response();
    })
    this.router.get('/details', async () => {
      const details: TopicDetails = {
        topic: await this.state.storage.get('meta') ?? {id: 'UNKNOWN', author: 'UNKNOWN', title: 'UNKNOWN'},
        comments: await this.state.storage.get('comments') ?? []
      }
      return new Response(JSON.stringify(details));
    });
    this.router.post('/comment', async (req) => {
      const comment: Comment = await req.json?.()
      const comments: Comment[] = await this.state.storage.get('comments') ?? [];
      comments.push(comment);
      this.state.storage.put('comments', comments);
      return new Response();
    })
  }

  async fetch(request: Request) {
    return this.router.handle(request);
  }
}