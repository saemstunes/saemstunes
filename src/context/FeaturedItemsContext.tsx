// src/context/FeaturedItemsContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface FeaturedItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  is_external?: boolean;
  order?: number;
}

interface FeaturedItemsContextType {
  featuredItems: FeaturedItem[];
  loading: boolean;
  error: string | null;
  refreshItems: () => Promise<void>;
}

const FeaturedItemsContext = createContext<FeaturedItemsContextType | null>(null);

export const FeaturedItemsProvider = ({ children }: { children: React.ReactNode }) => {
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('featured_items')
        .select('*')
        .order('order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeaturedItems(data || []);
    } catch (err) {
      setError('Failed to load featured items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    
    // Realtime updates
    const channel = supabase
      .channel('featured-items-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'featured_items'
      }, () => fetchItems())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <FeaturedItemsContext.Provider value={{ 
      featuredItems, 
      loading, 
      error,
      refreshItems: fetchItems
    }}>
      {children}
    </FeaturedItemsContext.Provider>
  );
};

export const useFeaturedItems = () => {
  const context = useContext(FeaturedItemsContext);
  if (!context) {
    throw new Error('useFeaturedItems must be used within a FeaturedItemsProvider');
  }
  return context;
};
