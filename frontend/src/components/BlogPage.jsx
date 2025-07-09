import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter 
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { 
  Search, 
  ArrowRight, 
  Heart, 
  Bookmark, 
  Share2,
  Stethoscope,
  Activity,
  Pill,
  Brain,
  HeartPulse,
  Bone
} from 'lucide-react';
import { motion } from 'framer-motion';
import Swal from "sweetalert2";


const categories = [
  { name: 'Medicine', icon: <Pill className="h-4 w-4 mr-2" />, searchTerm: 'medical treatments' },
  { name: 'Treatment', icon: <Stethoscope className="h-4 w-4 mr-2" />, searchTerm: 'medical procedures' },
  { name: 'Fitness', icon: <Activity className="h-4 w-4 mr-2" />, searchTerm: 'fitness health' },
  { name: 'Diseases', icon: <HeartPulse className="h-4 w-4 mr-2" />, searchTerm: 'common diseases' },
  { name: 'Symptoms', icon: <Brain className="h-4 w-4 mr-2" />, searchTerm: 'medical symptoms' },
  { name: 'Procedures', icon: <Bone className="h-4 w-4 mr-2" />, searchTerm: 'surgical procedures' },
  { name: 'Nutrition', icon: <Pill className="h-4 w-4 mr-2" />, searchTerm: 'nutrition health' },
  { name: 'Wellness', icon: <HeartPulse className="h-4 w-4 mr-2" />, searchTerm: 'wellness tips' }
];

// Expanded medical images array with more appropriate images
const medicalImages = [
  // Doctors and medical professionals
  'https://images.unsplash.com/photo-1550831107-1553da8c8464?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80',
  
  // Medical equipment
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  
  // Healthy lifestyle
  'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  
  // Medical research
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  
  // Hospital settings
  'https://images.unsplash.com/photo-1579165466740-20d9714d528a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1504439468489-c8920d796a29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
  
  // Anatomy and biology
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1579154343072-d3c575e515a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  
  // Mental health
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2011&q=80',
  
  // Nutrition
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80',
  
  // Fitness
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  
  // Alternative medicine
  'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  
  // Pediatrics
  'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
  
  // Geriatrics
  'https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80'
];

// Categorized images for better matching with articles
const categorizedImages = {
  medicine: [
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80'
  ],
  treatment: [
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  ],
  fitness: [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
  ],
  diseases: [
    'https://images.unsplash.com/photo-1579154343072-d3c575e515a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1579165466740-20d9714d528a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  ],
  symptoms: [
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2011&q=80',
    'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80'
  ],
  procedures: [
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  ],
  nutrition: [
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80'
  ],
  wellness: [
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  ]
};

export default function Blog() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();
  const [medicalTerms, setMedicalTerms] = useState([]);


  useEffect(() => {
  fetchDefaultArticles();
  // Load valid terms
  fetch('/data/blogsearch.json')
    .then((res) => res.json())
    .then((data) => setMedicalTerms(data.map(term => term.toLowerCase())))
    .catch((err) => console.error('Failed to load medical terms:', err));
}, []);


  useEffect(() => {
    fetchDefaultArticles();
  }, []);



  
  const fetchDefaultArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrnamespace=0&gsrsearch=medical&gsrlimit=10&prop=pageimages|extracts&exintro&explaintext&exlimit=max&format=json&origin=*&pithumbsize=500`
      );
      const data = await response.json();
      const articles = data.query ? Object.values(data.query.pages) : [];
      setArticles(processArticles(articles));
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = () => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
      footer: '<a href="#">Why do I have this issue?</a>'
    });
  };

  const searchArticles = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrnamespace=0&gsrsearch=${encodeURIComponent(
          query
        )}&gsrlimit=10&prop=pageimages|extracts&exintro&explaintext&exlimit=max&format=json&origin=*&pithumbsize=500`
      );
      const data = await response.json();
      const articles = data.query ? Object.values(data.query.pages) : [];
      setArticles(processArticles(articles));
    } catch (error) {
      console.error('Error searching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const processArticles = (articles) => {
    return articles.map((article, index) => {
      // Try to match category for better image selection
      const categoryMatch = categories.find(cat => 
        article.title.toLowerCase().includes(cat.name.toLowerCase()) || 
        article.extract.toLowerCase().includes(cat.name.toLowerCase())
      );
      
      const categoryKey = categoryMatch ? categoryMatch.name.toLowerCase() : '';
      const categoryImages = categorizedImages[categoryKey] || [];
      
      // Select image priority: Wikipedia thumbnail > category-specific image > general medical image
      const image = article.thumbnail?.source || 
                   (categoryImages.length > 0 ? categoryImages[index % categoryImages.length] : 
                   medicalImages[index % medicalImages.length]);
      
      return {
        ...article,
        image,
        extract: cleanExtract(article.extract),
        category: categoryMatch ? categoryMatch.name : categories[index % categories.length].name
      };
    });
  };

  const cleanExtract = (text) => {
    if (!text) return '';
    return text.replace(/\[\d+\]/g, '').substring(0, 200) + '...';
  };

 const handleSearch = () => {
  const input = searchQuery.trim().toLowerCase();
  if (!input) return;

  // Check if input is part of any medical term (partial match)
  const isValid = medicalTerms.some(term => term.includes(input));

  if (!isValid) {
Swal.fire({
  icon: "error",
  title: "oops...",
  text: "Please search medical terms"
  // footer: '<a href="#">Why do I have this issue?</a>'
});    return;
  }

  searchArticles(searchQuery);
};


  const filterByCategory = (category) => {
    setSelectedCategory(category.name);
    setSearchQuery(category.name);
    searchArticles(category.searchTerm);
  };

  const navigateToArticle = (pageid) => {
    navigate(`/blog/${pageid}`);
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-blue-50/30 dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}


      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16 text-center"
      >
        <div className="inline-flex items-center justify-center px-6 py-2 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-6">
          <span className="text-blue-600 dark:text-blue-300 font-medium">MediSense Knowledge Center</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
          Your Trusted Health Resource
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Evidence-based medical information to help you make informed decisions about your health
        </p>
      </motion.div>

      {/* Search Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4 mb-12"
      >
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-blue-400" />
          </div>
          <Input
            type="text"
            placeholder="Search symptoms, treatments, medications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-12 pr-6 py-6 text-lg rounded-xl border-2 border-blue-100 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm bg-white dark:bg-gray-800"
          />
        </div>
        <Button 
          onClick={handleSearch} 
          className="py-6 text-lg rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 shadow-lg transition-all duration-300"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </span>
          ) : (
            <span className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Search
            </span>
          )}
        </Button>
      </motion.div>

      {/* Categories */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white flex items-center">
          <Stethoscope className="h-6 w-6 mr-2 text-blue-500" />
          Browse Health Topics
        </h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <motion.div
              key={category.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge
                variant={selectedCategory === category.name ? 'default' : 'outline'}
                className={`px-5 py-3 rounded-lg text-sm font-medium cursor-pointer transition-all flex items-center ${
                  selectedCategory === category.name 
                    ? 'bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-md' 
                    : 'hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-300 hover:shadow-sm border-blue-100 dark:border-gray-700'
                }`}
                onClick={() => filterByCategory(category)}
              >
                {category.icon}
                {category.name}
              </Badge>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Content Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-blue-50 dark:border-gray-800">
                <CardHeader className="p-0">
                  <Skeleton className="h-48 w-full rounded-t-xl" />
                </CardHeader>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-2" />
                  <Skeleton className="h-4 w-4/6" />
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Skeleton className="h-10 w-24 rounded-lg" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white flex items-center">
              {selectedCategory ? (
                <>
                  <Pill className="h-6 w-6 mr-2 text-blue-500" />
                  {selectedCategory} Articles
                </>
              ) : (
                <>
                  <Bookmark className="h-6 w-6 mr-2 text-blue-500" />
                  Latest Medical Articles
                </>
              )}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <motion.div
                  key={article.pageid}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card 
                    className="rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-blue-50 dark:border-gray-800 bg-white dark:bg-gray-800 group"
                    onClick={() => navigateToArticle(article.pageid)}
                  >
                    <CardHeader className="p-0 relative">
                      <div className="h-48 w-full overflow-hidden">
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            // Fallback to a general medical image if the primary image fails to load
                            e.target.src = medicalImages[index % medicalImages.length];
                          }}
                        />
                      </div>
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-full bg-white/90 hover:bg-white shadow-sm text-gray-600 hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add to favorites logic here
                          }}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-full bg-white/90 hover:bg-white shadow-sm text-gray-600 hover:text-blue-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Share article logic here
                          }}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-3">
                        <Badge variant="outline" className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                          {article.category}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">5 min read</span>
                      </div>
                      <CardTitle className="text-xl font-bold mb-2 line-clamp-2 text-gray-800 dark:text-white">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {article.extract}
                      </CardDescription>
                  <Button 
                    variant="link" 
                    className="px-0 text-blue-600 dark:text-blue-400 hover:no-underline group"
                    onClick={() => navigateToArticle(article.pageid)}
                  >
                    Read more
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto max-w-md">
              <div className="h-40 w-40 mx-auto mb-6 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Search className="h-16 w-16 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-medium mb-2 text-gray-800 dark:text-white">No articles found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Try a different search term or browse our categories above
              </p>
              <Button 
                variant="outline" 
                onClick={fetchDefaultArticles}
                className="border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/30"
              >
                Show Latest Articles
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* CTA Section */}

    </div>
  );
}