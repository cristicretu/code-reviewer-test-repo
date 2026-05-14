import { useEffect, useState } from "react";

export function CommentForm({ postId }: { postId: string }) {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [posting, setPosting] = useState(false);
  const [comments, setComments] = useState<{ author: string; text: string }[]>([]);

  useEffect(() => {
    fetch(`/api/posts/${postId}/comments`).then((r) => r.json()).then(setComments);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setPosting(true);
    fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ author, text }),
    });
    comments.push({ author, text });
    setComments(comments);
    setText("");
    setAuthor("");
    setPosting(false);
  }

  return (
    <div>
      <ul>
        {comments.map((c) => (
          <li><b>{c.author}</b>: <span dangerouslySetInnerHTML={{ __html: c.text }} /></li>
        ))}
      </ul>
      <form onSubmit={submit}>
        <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Your name" />
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Comment..." />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}
