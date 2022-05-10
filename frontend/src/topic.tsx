import { FormEvent, ReactElement, useContext, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Comment, createComment, createTopic, getTopic, listTopics, Topic, TopicDetails, UserContext } from './api';

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
    <Link to={`/topics/${topic.id}`}>{topic.title}</Link>
    <div>by {topic.author}</div>
  </div>;
}

export const CreateTopicPage = (): ReactElement => {
  const user = useContext(UserContext).user;
  if (!user) {
    return <Navigate to='/login' />;
  }

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const tryPost = async (event: FormEvent) => {
    event.preventDefault();
    const topic = await createTopic(user, title, content);
    navigate(`/topics/${topic.id}`);
  }

  return <section>
    <h1>Create a new topic</h1>
    <form onSubmit={tryPost}>
      <input type='text' placeholder='Topic Title' value={title} onChange={(event) => setTitle(event.target.value)} />
      <textarea placeholder='Topic content' value={content} onChange={(event) => setContent(event.target.value)} />
      <input type='submit' value='Post a topic!' />
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

  const commentAdded = (comment: Comment) => {
    const newDetails = {...details};
    newDetails.comments.push(comment);
    setDetails(newDetails);
  };

  return <section>
    <h1>{details.topic.title}</h1>
    {details.comments.map(comment => <CommentEntry comment={comment} />)}
    <CommentForm topicId={id} commentAdded={commentAdded} />
  </section>;
}

const CommentEntry = ({comment}: {comment: Comment}): ReactElement => {
  return <div>
    <h2>Comment by {comment.author}</h2>
    <span>{comment.content}</span>
  </div>;
}

const CommentForm = ({topicId, commentAdded}:
    {topicId: string, commentAdded: (comment: Comment) => void}): ReactElement => {
  const user = useContext(UserContext).user;

  const [content, setContent] = useState('');
  if (user) {
    const tryComment = async (event: FormEvent) => {
      event.preventDefault();
      const comment = await createComment(user, topicId, content);
      commentAdded(comment)
    }
    return <form onSubmit={tryComment}>
      <textarea placeholder='Write a comment...' value={content} onChange={(event) => setContent(event.target.value)} />
      <input type='submit' value='Post comment!' />
    </form>;
  } else {
    return <div>Log in to comment.</div>;
  }
}


