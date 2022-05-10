import { Environment } from '.';
import { Comment, Topic, TopicDetails } from './api';

export const topicApi = (env: Environment) => {
  const topics = env.TOPICS;
  const details = env.TOPIC_DETAILS;
  return {
    async getTopics(): Promise<Topic[]> {
      const results = await topics.list();
      return results.keys
        .map((key) => {
          const index = key.name.indexOf(':');
          return [key.name.substring(0, index), key.name.substring(index + 1)];
        })
        .map((parts) => {
          const details = JSON.parse(parts[1]);
          return {id: parts[0], author: details.author, title: details.title }
        })
        .reverse();
    },
    
    async getTopic(id: string): Promise<TopicDetails> {
      const topic = details.get(details.idFromName(id));
      const result = await topic.fetch('https://topics/details');
      return await result.json();
    },
    
    async createTopic(author: string, title: string, content: string): Promise<Topic> {
      const id = `${Date.now()}`;
      await topics.put(`${id}:${JSON.stringify({author, title})}`, '');
    
      // Initialize durable object
      const actor = details.get(details.idFromName(id));
      const topic: Topic = {
        id,
        author,
        title
      };
      const topicDetails: TopicDetails = {
        topic,
        comments: [{
          id: crypto.randomUUID(),
          author,
          content
        }]
      };
      await actor.fetch('https://topics/init', {
        method: 'PUT',
        body: JSON.stringify(topicDetails)
      });
    
      return topic; // Return basic topic details
    },
    
    async addComment(topicId: string, author: string, content: string): Promise<Comment> {
      const topic = details.get(details.idFromName(topicId));
      const comment: Comment = {
        id: crypto.randomUUID(),
        author,
        content
      };
      await topic.fetch('https://topics/comment', {
        method: 'POST',
        body: JSON.stringify(comment)
      });
      return comment;
    }
  };
};
