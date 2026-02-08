import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, TrendingUp } from 'lucide-react';
import { blogApi } from '../api/stockApi';

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedTag, setSelectedTag] = useState('all');
  const [loading, setLoading] = useState(true);

  const tags = ['all', 'tech', 'finance', 'market-analysis', 'crypto', 'trading'];

  useEffect(() => {
    fetchBlogs();
  }, [selectedTag]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = selectedTag !== 'all' ? { tag: selectedTag } : {};
      const response = await blogApi.getBlogs(params);
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      // Mock data
      const mockBlogs = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        title: `Understanding Stock Market Trends ${i + 1}`,
        excerpt: 'Learn about the latest market trends and how to make informed investment decisions...',
        author: 'John Doe',
        date: '2 days ago',
        tags: ['market-analysis', 'trading'],
        image: `https://source.unsplash.com/800x600/?stock,market,${i}`,
        readTime: '5 min read',
      }));
      setBlogs(mockBlogs);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-dark-text mb-4">
            Blogs & News
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Stay updated with the latest market insights and analysis
          </p>
        </motion.div>

        {/* Tags Filter */}
        <div className="flex items-center space-x-3 mb-8 overflow-x-auto pb-2">
          <Tag className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
          {tags.map((tag) => (
            <motion.button
              key={tag}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTag(tag)}
              className={`px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                selectedTag === tag
                  ? 'bg-light-button dark:bg-dark-accent text-white shadow-lg'
                  : 'bg-light-card dark:bg-dark-card text-gray-700 dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent/50'
              }`}
            >
              {tag.replace('-', ' ')}
            </motion.button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-light-button dark:border-dark-accent border-t-transparent rounded-full"
            />
          </div>
        )}

        {/* Blogs Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, index) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="card cursor-pointer group overflow-hidden"
              >
                <div className="relative h-48 mb-4 -m-6 mb-4 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text mb-2 group-hover:text-light-button dark:group-hover:text-dark-accent transition-colors">
                  {blog.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {blog.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{blog.date}</span>
                  </div>
                  <span>{blog.readTime}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-light-accent/20 dark:border-dark-accent/20">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    By {blog.author}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
