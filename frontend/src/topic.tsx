import { ReactElement, useContext, useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Comment, getTopic, listTopics, Topic, TopicDetails, UserContext } from './api';

export const TopicListPage = (): ReactElement => {
  const [topics, setTopics] = useState([] as Topic[]);

  useEffect(() => {
    (async () => {
      setTopics(await listTopics());
    })();
  }, []);

  return <section>
    <h1>Topics</h1>
    {topics.map(topic => <TopicEntry topic={topic} />)}
  </section>;
}

const TopicEntry = ({topic}: {topic: Topic}): ReactElement => {
  return <div>
    <Link to={`/topic/${topic.id}`}>{topic.title}</Link>
    <div>by {topic.author}</div>
  </div>;
}

export const CreateTopicPage = (): ReactElement => {
  const userCtx = useContext(UserContext);
  if (!userCtx.user) {
    return <Navigate to='/login' />;
  }
  return <section>
    <h1>Create a new topic</h1>
    <form>
      <input type='text' placeholder='Topic Title' />
      <textarea placeholder='Topic content' />
    </form>
  </section>;
}

export const TopicPage = (): ReactElement => {
  const id = useParams().topicId;
  if (!id) {
    return <Navigate to='/' />;
  }

  const [details, setDetails] = useState(null as TopicDetails | null);
  useEffect(() => {
    (async () => {
      setDetails(await getTopic(id))
    })();
  }, []);

  // Loading...
  if (!details) {
    return <section></section>;
  }

  return <section>
    <h1>{details.topic.title}</h1>
    {details.comments.map(comment => <CommentEntry comment={comment} />)}
    <CommentForm />
  </section>;
}

const CommentEntry = ({comment}: {comment: Comment}): ReactElement => {
  return <div>
    <h2>{comment.author}</h2>
    <div>{comment.content}</div>
  </div>;
}

const CommentForm = (): ReactElement => {
  const userCtx = useContext(UserContext);
  if (userCtx.user) {
    return <form>
      <textarea placeholder='Write a comment...' />
      <button type='submit' value='Post comment!' />
    </form>;
  } else {
    return <div>Log in to comment.</div>;
  }
}


