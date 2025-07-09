import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { ArrowLeft, ExternalLink, BookOpen, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

// Reuse the same medicalImages array from Blog component
const medicalImages = [
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1579165466740-20d9714d528a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1504439468489-c8920d796a29?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
];

export default function Article() {
  const { pageid } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readingTime, setReadingTime] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!pageid) return;

    const fetchArticle = async () => {
      try {
        const response = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&pageids=${pageid}&prop=extracts|pageimages|info&inprop=url&pithumbsize=800&explaintext=1&exsectionformat=plain&format=json&origin=*`
        );
        const data = await response.json();
        const articleData = data.query.pages[pageid];

        const articleWithImage = {
          ...articleData,
          image: articleData.thumbnail?.source ||
            medicalImages[Math.floor(Math.random() * medicalImages.length)]
        };

        setArticle(articleWithImage);

        if (articleData.extract) {
          const wordCount = articleData.extract.split(/\s+/).length;
          setReadingTime(Math.max(1, Math.round(wordCount / 200)));
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [pageid]);

  const formatContent = (text) => {
    if (!text) return null;

    const restrictedPhrases = [
      'see also',
      'references',
      'external links',
      'further reading',
      'wikimedia',
      'notes',
      'bibliography',
      'sources',
      'citation',
      'footnotes'
    ];

    const lines = text.split('\n');
    const result = [];
    let shouldStop = false;

    for (const line of lines) {
      if (shouldStop) break;
      const trimmed = line.trim();
      if (!trimmed) continue;

      const hasRestricted = restrictedPhrases.some(phrase =>
        trimmed.toLowerCase().includes(phrase)
      );
      if (hasRestricted) {
        shouldStop = true;
        continue;
      }

      const headingMatch = trimmed.match(/^=+\s*(.*?)\s*=+$/);
      if (headingMatch) {
        const headingText = headingMatch[1].toLowerCase();
        if (restrictedPhrases.includes(headingText)) {
          shouldStop = true;
          continue;
        }
      }

      result.push(trimmed);
    }

    return processContent(result.join('\n'));
  };

  const processContent = (text) => {
    if (!text) return null;
    const sections = text.split(/\n(?==)/);
    const result = [];

    for (const section of sections) {
      const headingMatch = section.match(/^=+\s*(.*?)\s*=+/);
      if (headingMatch) {
        const level = headingMatch[0].match(/=/g).length - 1;
        const headingText = headingMatch[1];
        const headingSizes = {
          1: 'text-2xl',
          2: 'text-xl',
          3: 'text-lg',
          4: 'text-base'
        };

        result.push(
          <div key={`heading-${headingText}`} className="mt-12">
            {React.createElement(
              `h${Math.min(level + 1, 4)}`,
              {
                className: `font-bold text-gray-900 dark:text-white ${headingSizes[level] || 'text-base'} mb-4`
              },
              headingText
            )}
            <hr className="my-6 border-gray-200 dark:border-gray-700" />
          </div>
        );
      }

      const lines = section.split('\n').filter(line => line.trim().length > 0);
      const content = [];
      let currentList = [];
      let listType = null;

      const flushList = () => {
        if (currentList.length === 0) return;
        const ListComponent = listType === 'ol' ? 'ol' : 'ul';
        content.push(
          <ListComponent
            key={`list-${content.length}`}
            className={`${listType === 'ol' ? 'list-decimal' : 'list-disc'} pl-6 mb-5 text-gray-700 dark:text-gray-300`}
          >
            {currentList.map((item, i) => (
              <li key={i} className="pl-2">{item}</li>
            ))}
          </ListComponent>
        );
        currentList = [];
        listType = null;
      };

      lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.match(/^==+.+==+$/)) return;

        if (trimmed.startsWith('*')) {
          if (listType === 'ol') flushList();
          listType = 'ul';
          currentList.push(trimmed.replace(/^\*\s*/, ''));
          return;
        }

        const orderedMatch = trimmed.match(/^(\d+[\.\)])\s+(.*)/);
        if (orderedMatch) {
          if (listType === 'ul') flushList();
          listType = 'ol';
          currentList.push(orderedMatch[2]);
          return;
        }

        if (currentList.length > 0) flushList();

        if (trimmed.length < 80 && !trimmed.includes('.') && !trimmed.includes(',')) {
          content.push(
            <div key={`subh-${idx}`} className="mt-8">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">{trimmed}</h4>
              <hr className="my-4 border-gray-200 dark:border-gray-700 opacity-50" />
            </div>
          );
          return;
        }

        content.push(
          <p key={`para-${idx}`} className="mb-5 text-gray-700 dark:text-gray-300 leading-relaxed text-base">
            {trimmed}
          </p>
        );
      });

      if (currentList.length > 0) flushList();
      result.push(...content);
    }

    return result;
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 max-w-4xl"
      >
        <Skeleton className="h-10 w-3/4 mb-6" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (!article) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 max-w-4xl text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Article not found</h2>
        <Button onClick={() => navigate('/blog')}>Back to Blog</Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      <Button
        variant="outline"
        onClick={() => navigate('/blog')}
        className="mb-8 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Button>

      <article className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
        <header className="mb-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="rounded-lg overflow-hidden shadow-md">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 md:h-64 object-cover"
                  onError={(e) => {
                    e.target.src = medicalImages[Math.floor(Math.random() * medicalImages.length)];
                  }}
                />
              </div>
            </div>
            <div className={article.thumbnail ? "md:w-2/3" : "w-full"}>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {article.title}
              </h1>

              <div className="flex flex-wrap gap-4 mt-4 mb-6">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {readingTime} min read
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>

              {article.description && (
                <p className="text-lg text-gray-600 dark:text-gray-300 italic border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-2 mb-6">
                  {article.description}
                </p>
              )}
            </div>
          </div>
        </header>

        <section className="max-w-none">
          <div className="space-y-6">
            {formatContent(article.extract)}
          </div>
        </section>

        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Last updated: {new Date().toLocaleDateString()}
            </div>
            <a
              href={`https://en.wikipedia.org/?curid=${article.pageid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button variant="outline" className="w-full sm:w-auto">
                <ExternalLink className="h-4 w-4 mr-2" />
                Read full article on Wikipedia
              </Button>
            </a>
          </div>
        </footer>
      </article>
    </motion.div>
  );
}
