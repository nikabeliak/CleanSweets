import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Blog from './components/Blog';
import Articles from './components/Articles';
import Article from './components/Article';
import Categories from './components/Categories';
import Post from './components/Post';
import Search from './components/Search';
import Contact from './components/Contact';
import Portfolio from './components/Portfolio';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:postId" element={<Post />} />
          <Route path="articles" element={<Articles />} />
          <Route path="articles/:articleId" element={<Article />} />
          <Route path="categories" element={<Categories />} />
          <Route path="search" element={<Search />} />
          <Route path="contact" element={<Contact />} />
          <Route path="portfolio" element={<Portfolio />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}