export interface UserDetails {
  name: string;
  authToken: string;
}

export interface Topic {
  id: string;
  author: string;
  title: string;
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
