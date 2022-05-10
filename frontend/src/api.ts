import { Context, createContext } from 'react';
import { Comment, Topic, TopicDetails, UserDetails } from '../../shared/types';
export type { Comment, Topic, TopicDetails, UserDetails };

let apiBase = 'http://localhost:8787'; // TODO

export type UserAccess = {
  user: UserDetails | null;
  setUser: (user: UserDetails | null) => void;
}

const defaultAccess: UserAccess = {
  user: null,
  setUser: () => {}
}
export const UserContext: Context<UserAccess> = createContext(defaultAccess);

export async function logIn(user: string, password: string): Promise<UserDetails | null> {
  const result = await fetch(`${apiBase}/user/login`, {
    method: 'POST',
    body: JSON.stringify({user, password})
  });
  const success = (await result.status) == 200;
  if (success) {
    return result.json();
  }
  return null;
}

export async function createAccount(user: string, password: string): Promise<UserDetails | null> {
  const result = await fetch(`${apiBase}/user/register`, {
    method: 'POST',
    body: JSON.stringify({user, password})
  });
  const success = (await result.status) == 200;
  if (success) {
    return result.json();
  }
  return null;
}

export async function listTopics(): Promise<Topic[]> {
  const result = await fetch(`${apiBase}/topics`);
  return result.json();
}

export async function getTopic(id: string): Promise<TopicDetails> {
  const result = await fetch(`${apiBase}/topics/${id}`);
  return result.json();
}

export async function createTopic(auth: UserDetails, title: string, content: string): Promise<Topic> {
  const result = await fetch(`${apiBase}/topics`, {
    method: 'POST',
    body: JSON.stringify({title, content}),
    headers: {authToken: auth.authToken}
  });
  return result.json();
}

export async function createComment(auth: UserDetails, topicId: string, content: string): Promise<Comment> {
  const result = await fetch(`${apiBase}/topics/${topicId}`, {
    method: 'POST',
    body: JSON.stringify({content}),
    headers: {authToken: auth.authToken}
  });
  return result.json();
}