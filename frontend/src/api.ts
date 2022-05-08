import { Context, createContext, useContext } from 'react';

let apiBase = ''; // TODO

export type UserDetails = {
  name: string;
  authToken: string;
} | null;
export type UserAccess = {
  user: UserDetails;
  setUser: (user: UserDetails) => void;
}

const defaultAccess: UserAccess = {
  user: null,
  setUser: () => {}
}
export const UserContext: Context<UserAccess> = createContext(defaultAccess);

export async function logIn(user: string, password: string): Promise<UserDetails> {
  const result = await fetch(`${apiBase}/user/login`, {
    body: JSON.stringify({user, password})
  });
  const success = (await result.status) == 200;
  if (success) {
    return await result.json();
  }
  return null;
}

export async function createAccount(user: string, password: string): Promise<UserDetails> {
  const result = await fetch(`${apiBase}/user/register`);
  const success = (await result.status) == 200;
  if (success) {
    return await result.json();
  }
  return null;
}

export interface Topic {
  id: string;
  title: string;
  author: string;
}

export interface TopicDetails {
  topic: Topic;
  comments: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  content: string;
}

export async function listTopics(): Promise<Topic[]> {
  const result = await fetch(`${apiBase}/topic/list`);
  return await result.json();
}

export async function getTopic(id: string): Promise<TopicDetails> {
  const result = await fetch(`${apiBase}/topic/${id}`);
  return await result.json();
}