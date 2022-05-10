import { Router } from 'itty-router'
import { topicApi } from './topic';
import { createAccount, login, validateLogin } from './user';

export { TopicActor } from './topicDetails';

const router = Router();

router.post('/user/login', async (req, env: Environment) => {
  const body = await req.json?.();
  const token = await login(new TextEncoder().encode(env.JWT_SECRET), env.USERS, body.user, body.password);
  if (!token) {
    return new Response('login_failed', {status: 403});
  }
  return new Response(JSON.stringify({name: body.user, authToken: token}));
});

router.post('/user/register', async (req, env: Environment) => {
  const body = await req.json?.();
  const token = await createAccount(new TextEncoder().encode(env.JWT_SECRET), env.USERS, body.user, body.password);
  if (!token) {
    return new Response('create_account_failed', {status: 403});
  }
  return new Response(JSON.stringify({name: body.user, authToken: token}));

});

router.get('/topics', async (req, env: Environment) => {
  return new Response(JSON.stringify(await topicApi(env).getTopics()));
});

router.post('/topics', async (req, env: Environment, user: string | null) => {
  if (!user) {
    return new Response(null, {
      status: 401
    }); 
  }
  const body = await req.json?.();
  if (!body) {
    return new Response(null, {
      status: 400
    });
  }
  const topic = await topicApi(env).createTopic(user, body.title, body.content);
  return new Response(JSON.stringify(topic));
});

router.get('/topics/:id', async (req, env: Environment) => {
  const topicId = req.params?.id;
  if (!topicId) {
    return new Response(null, {
      status: 400
    });
  }
  return new Response(JSON.stringify(await topicApi(env).getTopic(topicId)));
});

router.post('/topics/:id', async (req, env: Environment, user: string | null) => {
  if (!user) {
    return new Response(null, {
      status: 401
    }); 
  }
  const topicId = req.params?.id;
  if (!topicId) {
    return new Response(null, {
      status: 400
    });
  }
  const body = await req.json?.();
  if (!body) {
    return new Response(null, {
      status: 400
    });
  }
  const comment = await topicApi(env).addComment(topicId, user, body.content);
  return new Response(JSON.stringify(comment));
});

export default {
  async fetch(request: Request, env: Environment) {
    const authToken = request.headers.get('authToken');
    const user = authToken != null ? await validateLogin(new TextEncoder().encode(env.JWT_SECRET), authToken) : null;
    const response: Response = request.method == 'OPTIONS' ? new Response() : await router.handle(request, env, user);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Headers', '*');
    return response;
  }
}

export interface Environment {
  JWT_SECRET: string
  USERS: KVNamespace;
  TOPICS: KVNamespace;
  TOPIC_DETAILS: DurableObjectNamespace;
}