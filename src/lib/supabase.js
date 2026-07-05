import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5bnF0bGdyeWZ6amNvZnpuemV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjU4MDMwOCwiZXhwIjoyMDk4MTU2MzA4fQ.8cbculRXEKGCWUAdZ65AndmQN1jE1apabWjYA7U-GGs'
export const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
})

// ─── PRODUCTS API ────────────────────────────────────────────────────────────
export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (err) {
    console.error("Supabase products fetch failed:", err.message)
    throw err
  }
}

function sanitizeProduct(product) {
  const sanitized = {
    id: product.id,
    name: product.name,
    sku: product.sku,
    price: product.price,
    originalPrice: product.originalPrice,
    stock: product.stock,
    category: product.category,
    subcategory: product.subcategory,
    collection: product.collection,
    brand: product.brand,
    weight: product.weight,
    image: product.image,
    images: product.images,
    available: product.available,
    tag: product.tag,
    description: product.description,
    sizes: product.sizes,
    colors: product.colors,
    seo_title: product.seo_title,
    seo_description: product.seo_description,
    fabric_info: product.fabric_info,
    washing_instructions: product.washing_instructions,
    size_guide: product.size_guide,
    size_chart: product.size_chart
  }
  if (product.created_at !== undefined) {
    sanitized.created_at = product.created_at
  }
  return sanitized
}

export async function insertProduct(product) {
  const newProduct = {
    ...product,
    id: product.id || `bb-${Date.now()}`,
    created_at: new Date().toISOString()
  }

  try {
    const sanitized = sanitizeProduct(newProduct)
    const { data, error } = await adminSupabase
      .from('products')
      .insert([sanitized])
      .select()
    if (error) throw error
    return data[0]
  } catch (err) {
    console.error("Supabase product insertion failed:", err.message)
    throw err
  }
}

export async function updateProduct(productId, product) {
  try {
    const sanitized = sanitizeProduct({ ...product, id: productId })
    const { data, error } = await adminSupabase
      .from('products')
      .update(sanitized)
      .eq('id', productId)
      .select()
    if (error) throw error
    return data[0]
  } catch (err) {
    console.error("Supabase product update failed:", err.message)
    throw err
  }
}

export async function deleteProduct(productId) {
  try {
    const { error } = await adminSupabase
      .from('products')
      .delete()
      .eq('id', productId)
    if (error) throw error
    return true
  } catch (err) {
    console.error("Supabase product deletion failed:", err.message)
    throw err
  }
}

export async function decrementProductStock(productId, quantityToSubtract) {
  try {
    const { data: product, error: fetchError } = await adminSupabase
      .from('products')
      .select('stock')
      .eq('id', productId)
      .single()

    if (fetchError) throw fetchError
    if (!product) return

    const currentStock = product.stock || 0
    const newStock = Math.max(0, currentStock - quantityToSubtract)

    const { error: updateError } = await adminSupabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', productId)

    if (updateError) throw updateError
  } catch (err) {
    console.error(`Failed to decrement stock for product ${productId}:`, err.message)
    throw err
  }
}

// ─── ORDERS API ──────────────────────────────────────────────────────────────
export async function getOrders() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data || []).map(order => ({
      ...order,
      status: order.status ? (order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()) : 'Pending',
      payment_status: order.payment_status ? (order.payment_status.toLowerCase() === 'pending' ? 'Pending' : order.payment_status) : 'Unpaid'
    }))
  } catch (err) {
    console.error("Supabase orders fetch failed:", err.message)
    throw err
  }
}

export async function insertOrder(order) {
  const newOrder = {
    ...order,
    id: order.id || `BB-${Math.floor(100000 + Math.random() * 900000)}`,
    status: order.status ? (order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()) : 'Pending',
    payment_status: order.payment_status ? (order.payment_status.toLowerCase() === 'pending' ? 'Pending' : order.payment_status) : 'Unpaid',
    created_at: new Date().toISOString()
  }

  try {
    const { data, error } = await adminSupabase
      .from('orders')
      .insert([newOrder])
      .select()
    if (error) throw error
    return data[0]
  } catch (err) {
    console.error("Supabase order insertion failed:", err.message)
    throw err
  }
}

export async function updateOrderStatus(orderId, status) {
  try {
    const normalizedStatus = status ? (status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()) : 'Pending'
    const { error } = await adminSupabase
      .from('orders')
      .update({ status: normalizedStatus })
      .eq('id', orderId)
    if (error) throw error
    return true
  } catch (err) {
    console.error("Supabase order status update failed:", err.message)
    throw err
  }
}

// ─── USERS API ───────────────────────────────────────────────────────────────
export async function getUsers() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  } catch (err) {
    console.error("Supabase users fetch failed:", err.message)
    return []
  }
}

// ─── INQUIRIES API ────────────────────────────────────────────────────────────
export async function getInquiries() {
  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  } catch (err) {
    console.error("Supabase inquiries fetch failed:", err.message)
    throw err
  }
}

export async function insertInquiry(inquiry) {
  const newInquiry = {
    ...inquiry,
    id: inquiry.id || `inq-${Date.now()}`,
    created_at: new Date().toISOString()
  }

  try {
    const { data, error } = await adminSupabase
      .from('inquiries')
      .insert([newInquiry])
      .select()
    if (error) throw error
    return data[0]
  } catch (err) {
    console.error("Supabase inquiry insertion failed:", err.message)
    throw err
  }
}

export async function deleteInquiry(id) {
  try {
    const { error } = await adminSupabase
      .from('inquiries')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  } catch (err) {
    console.error("Supabase inquiry deletion failed:", err.message)
    throw err
  }
}

// ─── CATEGORIES API ───────────────────────────────────────────────────────────
export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })
    if (error) throw error
    return data || []
  } catch (err) {
    console.error("Supabase categories fetch failed:", err.message)
    throw err
  }
}

export async function insertCategory(category) {
  const newCat = {
    ...category,
    id: category.id || `cat-${Date.now()}`,
    slug: category.slug || category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    sort_order: category.sort_order !== undefined ? Number(category.sort_order) : 0,
    created_at: new Date().toISOString()
  }

  try {
    const { data, error } = await adminSupabase
      .from('categories')
      .insert([newCat])
      .select()
    if (error) throw error
    return data[0]
  } catch (err) {
    console.error("Supabase category insertion failed:", err.message)
    throw err
  }
}

export async function deleteCategory(categoryId) {
  try {
    const { error } = await adminSupabase
      .from('categories')
      .delete()
      .eq('id', categoryId)
    if (error) throw error
    return true
  } catch (err) {
    console.error("Supabase category deletion failed:", err.message)
    throw err
  }
}

export async function updateCategory(categoryId, categoryUpdates) {
  try {
    const { error } = await adminSupabase
      .from('categories')
      .update(categoryUpdates)
      .eq('id', categoryId)
    if (error) throw error
    return true
  } catch (err) {
    console.error("Supabase category update failed:", err.message)
    throw err
  }
}

// Pre-cached ratings database lookup
let ratingsCache = {};

export async function preloadRatingsCache() {
  try {
    const reviews = await getApprovedReviews();
    const cache = {};
    reviews.forEach(r => {
      if (!cache[r.product_name]) cache[r.product_name] = [];
      cache[r.product_name].push(r.rating);
    });
    ratingsCache = cache;
  } catch (e) {
    console.error("Failed to build ratings cache:", e);
  }
}

export function getProductRating(productName) {
  const ratings = ratingsCache[productName];
  if (!ratings || ratings.length === 0) return 0;
  const total = ratings.reduce((sum, r) => sum + r, 0);
  return Number((total / ratings.length).toFixed(1));
}

// ─── NEW DB ENDPOINTS: COUPONS, REVIEWS, SETTINGS ───────────────────────────

export async function getCoupons() {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Supabase getCoupons error:", err.message);
    throw err
  }
}

export async function insertCoupon(coupon) {
  const newC = {
    ...coupon,
    id: coupon.id || `c-${Date.now()}`,
    created_at: new Date().toISOString()
  };

  try {
    const { data, error } = await adminSupabase
      .from('coupons')
      .insert([newC])
      .select();
    if (error) throw error;
    return data[0];
  } catch (err) {
    console.error("Supabase insertCoupon error:", err.message);
    throw err;
  }
}

export async function deleteCoupon(id) {
  try {
    const { error } = await adminSupabase
      .from('coupons')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Supabase deleteCoupon error:", err.message);
    throw err;
  }
}

export async function getReviews() {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Supabase getReviews error:", err.message);
    throw err
  }
}

export async function getApprovedReviews() {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('approved', true);
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Supabase getApprovedReviews error:", err.message);
    return []
  }
}

export async function insertReview(review) {
  const newR = {
    id: review.id || `r-${Date.now()}`,
    product_id: review.product_id || null,
    product_name: review.product_name || null,
    customer_name: review.customer_name || review.name || 'Anonymous',
    name: review.name || review.customer_name || 'Anonymous',
    user_id: review.user_id || null,
    rating: review.rating,
    review: review.review || review.comment || '',
    approved: review.approved ?? false,
    created_at: new Date().toISOString()
  };

  try {
    const { data, error } = await adminSupabase
      .from('reviews')
      .insert([newR])
      .select();
    if (error) throw error;
    preloadRatingsCache();
    return data[0];
  } catch (err) {
    console.error("Supabase insertReview error:", err.message);
    throw err;
  }
}

export async function approveReview(id) {
  try {
    const { error } = await adminSupabase
      .from('reviews')
      .update({ approved: true })
      .eq('id', id);
    if (error) throw error;
    preloadRatingsCache();
    return true;
  } catch (err) {
    console.error("Supabase approveReview error:", err.message);
    throw err;
  }
}

export async function deleteReview(id) {
  try {
    const { error } = await adminSupabase
      .from('reviews')
      .delete()
      .eq('id', id);
    if (error) throw error;
    preloadRatingsCache();
    return true;
  } catch (err) {
    console.error("Supabase deleteReview error:", err.message);
    throw err;
  }
}

export async function getStoreSettings() {
  const defaultSettings = {
    shipping_threshold: 1499,
    shipping_flat_rate: 99,
    enable_cod: true,
    store_address: 'The Boujee Bazar, Kolkata, IN'
  };

  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('value')
      .eq('key', 'global_settings')
      .maybeSingle();
    if (error) throw error;
    return data?.value || defaultSettings;
  } catch (err) {
    console.error("Supabase getStoreSettings error:", err.message);
    return defaultSettings;
  }
}

export async function saveStoreSettings(settings) {
  try {
    const { data, error } = await adminSupabase
      .from('store_settings')
      .upsert({ key: 'global_settings', value: settings, updated_at: new Date().toISOString() })
      .select();
    if (error) throw error;
    return data[0]?.value || settings;
  } catch (err) {
    console.error("Supabase saveStoreSettings error:", err.message);
    throw err;
  }
}

export async function getHomepageConfig() {
  const defaultHomepage = {
    hero_images: [
      '/images/img1.webp',
      '/images/img2.webp',
      '/images/img3.webp',
      '/images/img4.webp',
      '/images/img5.webp'
    ],
    hero_cards: [
      { image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80', label: 'Layered Necklace' },
      { image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=600&q=80', label: 'Crystal Earrings' },
      { image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=600&q=80', label: 'Stackable Rings' },
      { image: 'https://images.unsplash.com/photo-1573408301185-9519f94815f0?auto=format&fit=crop&w=600&q=80', label: 'Charm Bracelet' },
      { image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80', label: 'Pearl Studs' },
      { image: 'https://images.unsplash.com/photo-1631982690223-8aa4cf87b7f5?auto=format&fit=crop&w=600&q=80', label: 'Gold Bangle' }
    ],
    featured_product_ids: ['ftw-sig-01', 'ftw-cyber-02', 'ftw-acid-03', 'ftw-box-04'],
    sale_product_ids: ['ftw-sale-01', 'ftw-sale-02'],
    coming_soon_title: '',
    coming_soon_subtitle: '',
    coming_soon_description: '',
    coming_soon_countdown: null,
    coming_soon_images: [],
    hero_bg_banner: '/images/banner.webp'
  };

  try {
    let localBanner = null;
    let localCards = null;
    if (typeof window !== 'undefined') {
      localBanner = localStorage.getItem('boujee_hero_bg_banner');
      const storedCards = localStorage.getItem('boujee_hero_cards');
      if (storedCards) {
        try { localCards = JSON.parse(storedCards); } catch (e) {}
      }
    }

    let storeBanner = null;
    let storeCards = null;
    try {
      const { data: bannerData } = await supabase
        .from('store_settings')
        .select('key, value')
        .in('key', ['hero_bg_banner', 'hero_cards']);
      if (bannerData) {
        const b = bannerData.find(x => x.key === 'hero_bg_banner');
        const c = bannerData.find(x => x.key === 'hero_cards');
        if (b?.value?.url) storeBanner = b.value.url;
        if (c?.value?.cards) storeCards = c.value.cards;
      }
    } catch (e) {}

    const { data, error } = await supabase
      .from('homepage_config')
      .select('*')
      .eq('id', 'main')
      .maybeSingle();

    const resultBanner = data?.hero_bg_banner || storeBanner || localBanner || defaultHomepage.hero_bg_banner;
    const resultCards = data?.hero_cards || storeCards || localCards || defaultHomepage.hero_cards;

    if (!data) {
      if (typeof window !== 'undefined') {
        const localConfig = localStorage.getItem('boujee_homepage_config');
        if (localConfig) {
          try {
            const parsed = JSON.parse(localConfig);
            return { ...defaultHomepage, ...parsed, hero_bg_banner: resultBanner, hero_cards: resultCards };
          } catch (e) {}
        }
      }
      return { ...defaultHomepage, hero_bg_banner: resultBanner, hero_cards: resultCards };
    }

    return {
      hero_images: data.hero_images || defaultHomepage.hero_images,
      hero_cards: resultCards,
      featured_product_ids: data.featured_product_ids || defaultHomepage.featured_product_ids,
      sale_product_ids: data.sale_product_ids || defaultHomepage.sale_product_ids,
      coming_soon_title: data.coming_soon_title || defaultHomepage.coming_soon_title,
      coming_soon_subtitle: data.coming_soon_subtitle || defaultHomepage.coming_soon_subtitle,
      coming_soon_description: data.coming_soon_description || defaultHomepage.coming_soon_description,
      coming_soon_countdown: data.coming_soon_countdown || defaultHomepage.coming_soon_countdown,
      coming_soon_images: Array.isArray(data.coming_soon_images) ? data.coming_soon_images : defaultHomepage.coming_soon_images,
      hero_bg_banner: resultBanner
    };
  } catch (err) {
    console.error("Supabase getHomepageConfig error:", err.message);
    let localBanner = null;
    let localCards = null;
    if (typeof window !== 'undefined') {
      localBanner = localStorage.getItem('boujee_hero_bg_banner');
      const storedCards = localStorage.getItem('boujee_hero_cards');
      if (storedCards) {
        try { localCards = JSON.parse(storedCards); } catch (e) {}
      }
    }
    return { ...defaultHomepage, hero_bg_banner: localBanner || defaultHomepage.hero_bg_banner, hero_cards: localCards || defaultHomepage.hero_cards };
  }
}

export async function saveHomepageConfig(config) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('boujee_homepage_config', JSON.stringify(config));
      if (config.hero_bg_banner) {
        localStorage.setItem('boujee_hero_bg_banner', config.hero_bg_banner);
      }
      if (config.hero_cards) {
        localStorage.setItem('boujee_hero_cards', JSON.stringify(config.hero_cards));
      }
    }

    try {
      await adminSupabase
        .from('store_settings')
        .upsert({ key: 'hero_bg_banner', value: { url: config.hero_bg_banner }, updated_at: new Date().toISOString() });
      if (config.hero_cards) {
        await adminSupabase
          .from('store_settings')
          .upsert({ key: 'hero_cards', value: { cards: config.hero_cards }, updated_at: new Date().toISOString() });
      }
    } catch (e) {
      console.warn("Could not save banner/cards to store_settings:", e.message);
    }

    const payload = {
      id: 'main',
      hero_images: config.hero_images,
      hero_cards: config.hero_cards,
      featured_product_ids: config.featured_product_ids,
      sale_product_ids: config.sale_product_ids,
      coming_soon_title: config.coming_soon_title,
      coming_soon_subtitle: config.coming_soon_subtitle,
      coming_soon_description: config.coming_soon_description,
      coming_soon_countdown: config.coming_soon_countdown,
      coming_soon_images: config.coming_soon_images,
      hero_bg_banner: config.hero_bg_banner,
      updated_at: new Date().toISOString()
    };

    let { data, error } = await adminSupabase
      .from('homepage_config')
      .upsert(payload)
      .select();

    if (error && error.message && (error.message.includes('hero_bg_banner') || error.message.includes('hero_cards'))) {
      console.warn("Column hero_bg_banner or hero_cards missing in DB schema, saving without them...");
      const { hero_bg_banner, hero_cards, ...payloadWithoutBanner } = payload;
      const res = await adminSupabase
        .from('homepage_config')
        .upsert(payloadWithoutBanner)
        .select();
      if (res.error) throw res.error;
      data = res.data;
    } else if (error) {
      throw error;
    }

    return data?.[0] || config;
  } catch (err) {
    console.error("Supabase saveHomepageConfig error:", err.message);
    throw err;
  }
}

// Initial preload of ratings cache
preloadRatingsCache();

// ─── CUSTOM DESIGNS API ──────────────────────────────────────────────────────
export async function saveCustomDesign(design) {
  let targetId = design.id || `des-${Date.now()}`

  // Server/DB-side security safeguard: If this design is already associated with an order,
  // we must NEVER overwrite it, even if someone manually bypassed the read-only URL parameters.
  // We check the orders table for any placed orders containing this design ID.
  if (design.id) {
    try {
      const { data: orders } = await supabase
        .from('orders')
        .select('items')

      const isOrdered = orders?.some(order =>
        order.items?.some(item => item.designId === design.id)
      )

      if (isOrdered) {
        targetId = `des-${Date.now()}`
      }
    } catch (e) {
      console.error("Failed to check order association for design:", e)
    }
  }

  const newDesign = {
    ...design,
    id: targetId,
    created_at: new Date().toISOString()
  }

  try {
    const { data, error } = await adminSupabase
      .from('custom_designs')
      .upsert([newDesign])
      .select()
    if (error) throw error
    return data[0]
  } catch (err) {
    console.error("Supabase custom design save failed:", err.message)
    throw err
  }
}

export async function getUserCustomDesigns(userId) {
  try {
    const { data, error } = await supabase
      .from('custom_designs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  } catch (err) {
    console.error("Supabase user custom designs fetch failed:", err.message)
    throw err
  }
}

export async function getAdminCustomDesigns() {
  try {
    const { data, error } = await supabase
      .from('custom_designs')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  } catch (err) {
    console.error("Supabase admin custom designs fetch failed:", err.message)
    throw err
  }
}

export async function getCustomDesign(id) {
  try {
    const { data, error } = await supabase
      .from('custom_designs')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  } catch (err) {
    console.error("Supabase custom design fetch failed:", err.message)
    throw err
  }
}

export async function deleteCustomDesign(id) {
  try {
    const { error } = await adminSupabase
      .from('custom_designs')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  } catch (err) {
    console.error("Supabase custom design deletion failed:", err.message)
    throw err
  }
}

export async function getCustomizerConfig() {
  try {
    const { data, error } = await supabase
      .from('customizer_mockups')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    const allRows = data || [];
    // Separate the special __pricing__ row from actual color rows
    const pricingRow = allRows.find(r => r.name === '__pricing__');
    const colors = allRows.filter(r => r.name !== '__pricing__');
    const pricing = pricingRow?.pricing_settings || {};
    return { colors, pricing };
  } catch (err) {
    console.error("Supabase getCustomizerConfig error:", err.message);
    return { colors: [], pricing: {} };
  }
}

export async function saveCustomizerConfig(config) {
  try {
    // 1. Fetch currently stored colors to identify which ones were deleted
    const { colors: existingColors } = await getCustomizerConfig();
    const existingNames = existingColors.map(c => c.name);
    const newNames = (config.colors || []).map(c => c.name);

    const namesToDelete = existingNames.filter(
      name => !newNames.includes(name) && name !== 'none' && name !== '__pricing__'
    );

    if (namesToDelete.length > 0) {
      const { error: deleteError } = await adminSupabase
        .from('customizer_mockups')
        .delete()
        .in('name', namesToDelete);
      if (deleteError) throw deleteError;
    }

    // 2. Upsert pricing settings into dedicated __pricing__ row
    if (config.pricing) {
      const { error: pricingError } = await adminSupabase
        .from('customizer_mockups')
        .upsert({
          name: '__pricing__',
          hex: '',
          mockups: {},
          pricing_settings: config.pricing,
          created_at: new Date(0).toISOString() // epoch ensures it sorts first
        }, { onConflict: 'name' });
      if (pricingError) throw pricingError;
    }

    // 3. Upsert colors
    if (config.colors && config.colors.length > 0) {
      const rowsToUpsert = config.colors.map((col, index) => ({
        name: col.name,
        hex: col.hex,
        mockups: col.mockups,
        created_at: new Date(Date.now() + index * 10).toISOString()
      }));

      const { data, error: upsertError } = await adminSupabase
        .from('customizer_mockups')
        .upsert(rowsToUpsert, { onConflict: 'name' })
        .select();
      if (upsertError) throw upsertError;
      return { colors: data, pricing: config.pricing };
    }

    return { colors: [], pricing: config.pricing };
  } catch (err) {
    console.error("Supabase saveCustomizerConfig error:", err.message);
    throw err;
  }
}
