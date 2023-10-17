import PostCreate from "./PostCreate.jsx";
import PostList from "./PostList.jsx";

const App = () => {
  return (
    <div className="container">
      <PostCreate />
      <hr />
      <h1>Posts</h1>
      <PostList />
    </div>
  );
};

export default App;
