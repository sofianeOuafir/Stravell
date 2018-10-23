import React from 'react';
import { Link } from 'react-router-dom';
import PostList from './PostList';

const DashboardPage = () => (
  <div>
    <Link to="posts/create" className="button">
      Create Post
    </Link>
    <PostList />
  </div>
);

export default DashboardPage;
