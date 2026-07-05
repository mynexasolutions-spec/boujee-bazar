import React, { useState } from 'react'
import { Globe, Save, Plus, Trash, Image, Link, Clock, Sparkles, Upload, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { uploadToCloudinary } from '../../lib/cloudinary'

export default function HomepageTab({
  products,
  homepageConfig,
  handleSaveHomepageConfig
}) {
  const [config, setConfig] = useState({
    hero_images: homepageConfig?.hero_images || [],
    hero_cards: homepageConfig?.hero_cards || [
      { image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80', label: 'Layered Necklace' },
      { image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=600&q=80', label: 'Crystal Earrings' },
      { image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=600&q=80', label: 'Stackable Rings' },
      { image: 'https://images.unsplash.com/photo-1573408301185-9519f94815f0?auto=format&fit=crop&w=600&q=80', label: 'Charm Bracelet' },
      { image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80', label: 'Pearl Studs' },
      { image: 'https://images.unsplash.com/photo-1631982690223-8aa4cf87b7f5?auto=format&fit=crop&w=600&q=80', label: 'Gold Bangle' }
    ],
    featured_product_ids: homepageConfig?.featured_product_ids || [],
    sale_product_ids: homepageConfig?.sale_product_ids || [],
    coming_soon_title: homepageConfig?.coming_soon_title || '',
    coming_soon_subtitle: homepageConfig?.coming_soon_subtitle || '',
    coming_soon_description: homepageConfig?.coming_soon_description || '',
    coming_soon_countdown: homepageConfig?.coming_soon_countdown ? new Date(homepageConfig.coming_soon_countdown).toISOString().substring(0, 16) : '',
    coming_soon_images: homepageConfig?.coming_soon_images || [
      { url: '', label: '' },
      { url: '', label: '' },
      { url: '', label: '' }
    ],
    hero_bg_banner: homepageConfig?.hero_bg_banner || ''
  })

  const [uploadingBg, setUploadingBg] = useState(false)
  const [uploadingCardIdx, setUploadingCardIdx] = useState(null)
  const [uploadingTeasers, setUploadingTeasers] = useState([false, false, false])
  const [showAddCardModal, setShowAddCardModal] = useState(false)
  const [newCardForm, setNewCardForm] = useState({ label: '', image: '' })
  const [uploadingModalImg, setUploadingModalImg] = useState(false)

  const uploadFile = async (file) => {
    return await uploadToCloudinary(file)
  }

  const handleCardImageUpload = async (idx, file) => {
    if (!file) return
    setUploadingCardIdx(idx)
    try {
      const url = await uploadFile(file)
      setConfig(prev => {
        const updated = [...(prev.hero_cards || [])]
        updated[idx] = { ...updated[idx], image: url }
        return { ...prev, hero_cards: updated }
      })
      toast.success('Card image uploaded successfully!')
    } catch (err) {
      toast.error(`Upload failed: ${err.message}`)
    } finally {
      setUploadingCardIdx(null)
    }
  }

  const handleCardLabelChange = (idx, newLabel) => {
    setConfig(prev => {
      const updated = [...(prev.hero_cards || [])]
      updated[idx] = { ...updated[idx], label: newLabel }
      return { ...prev, hero_cards: updated }
    })
  }

  const handleRemoveCard = (idx) => {
    setConfig(prev => ({
      ...prev,
      hero_cards: (prev.hero_cards || []).filter((_, i) => i !== idx)
    }))
  }

  const toggleFeaturedProduct = (id) => {
    setConfig(prev => {
      const isFeatured = prev.featured_product_ids.includes(id)
      return {
        ...prev,
        featured_product_ids: isFeatured 
          ? prev.featured_product_ids.filter(x => x !== id)
          : [...prev.featured_product_ids, id]
      }
    })
  }

  const toggleSaleProduct = (id) => {
    setConfig(prev => {
      const isSale = prev.sale_product_ids.includes(id)
      return {
        ...prev,
        sale_product_ids: isSale
          ? prev.sale_product_ids.filter(x => x !== id)
          : [...prev.sale_product_ids, id]
      }
    })
  }

  const handleSneakPeekChange = (idx, field, val) => {
    setConfig(prev => {
      const updated = [...prev.coming_soon_images]
      updated[idx] = { ...updated[idx], [field]: val }
      return { ...prev, coming_soon_images: updated }
    })
  }

  const handleRemoveTeaserImage = (idx) => {
    setConfig(prev => {
      const updated = [...prev.coming_soon_images]
      updated[idx] = { ...updated[idx], url: '' }
      return { ...prev, coming_soon_images: updated }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Transform countdown date back to ISO string
    const finalPayload = {
      ...config,
      coming_soon_countdown: config.coming_soon_countdown ? new Date(config.coming_soon_countdown).toISOString() : null
    }
    handleSaveHomepageConfig(finalPayload)
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12 text-dark font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cream3 pb-5">
        <div>
          <h2 className="font-sans text-2xl font-black uppercase tracking-tight text-dark flex items-center gap-3">
            <div className="p-2 bg-dark text-white rounded-xl shadow-md">
              <Globe className="w-5.5 h-5.5 text-accent" />
            </div>
            Homepage Customizer
          </h2>
          <p className="text-xs text-dark2/50 mt-1 font-medium">Configure images, featured drops, sales items, and the next drop countdown timer.</p>
        </div>
      </div>

      <div className="space-y-8 text-xs font-sans">
        
        {/* Section 1: Hero Background Banner */}
        <form onSubmit={handleSubmit} className="bg-white border border-cream3 p-3 sm:p-6 rounded-2xl space-y-5 hover:border-dark/25 hover:shadow-md transition-all duration-300 shadow-sm">
          <div className="flex items-center gap-3 border-b border-cream3 pb-3">
            <div className="p-2.5 bg-dark/5 text-dark rounded-xl">
              <Image className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-dark tracking-wider">1. Hero Background Banner</h3>
              <p className="text-[9px] text-dark2/45 uppercase mt-0.5 font-bold font-mono">Manage background banner photo on the landing hero section</p>
            </div>
          </div>

          {/* Hero Background Banner Upload */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="aspect-[16/9] w-full bg-cream3 relative overflow-hidden rounded-xl border border-cream3">
                {config.hero_bg_banner ? (
                  <>
                    <img src={config.hero_bg_banner} alt="Background Banner" className="w-full h-full object-cover" onError={(e) => { e.target.src = '/images/banner.webp' }} />
                    <button
                      type="button"
                      onClick={() => setConfig(prev => ({ ...prev, hero_bg_banner: '' }))}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow cursor-pointer transition-colors z-10"
                      title="Remove image"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-dark/30 font-mono text-[9px] uppercase">Default Background Banner</div>
                )}
              </div>
              
              <div className="space-y-2.5">
                <p className="text-[10px] text-dark2/50 leading-relaxed font-sans">
                  Upload a high-resolution banner image (minimum 1920x1080 recommended) to display behind the rotating product slider. Defaults to the standard grid pattern banner.
                </p>
                <label className="w-fit px-4 py-2 bg-dark hover:bg-accent hover:text-dark text-white transition-colors font-bold uppercase rounded-lg cursor-pointer text-[9px] flex items-center gap-1.5 select-none shadow-sm border-none">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingBg ? 'Uploading Banner...' : 'Upload Background Banner'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingBg}
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      setUploadingBg(true)
                      try {
                        const url = await uploadFile(file)
                        setConfig(prev => ({ ...prev, hero_bg_banner: url }))
                        toast.success('Hero background banner uploaded successfully!')
                      } catch (err) {
                        toast.error(`Upload failed: ${err.message}`)
                      } finally {
                        setUploadingBg(false)
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-cream3 mt-4">
            <button
              type="submit"
              className="px-6 py-2.5 bg-dark text-cream hover:bg-accent hover:text-primary2 font-sans font-bold uppercase tracking-wider text-[10px] rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer border-none"
            >
              <Save className="w-3.5 h-3.5" /> Save Hero Banner
            </button>
          </div>
        </form>

        {/* Section 2: Hero Rotating Flow Cards */}
        <form onSubmit={handleSubmit} className="bg-white border border-cream3 p-3 sm:p-6 rounded-2xl space-y-5 hover:border-dark/25 hover:shadow-md transition-all duration-300 shadow-sm">
          <div className="flex items-center justify-between border-b border-cream3 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-dark/5 text-dark rounded-xl">
                <Image className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase text-dark tracking-wider">2. Hero Rotating Flow Cards</h3>
                <p className="text-[9px] text-dark2/45 uppercase mt-0.5 font-bold font-mono">Manage images and labels for the rotating cards on landing page</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setNewCardForm({ label: '', image: '' }); setShowAddCardModal(true) }}
              className="px-3.5 py-1.5 bg-accent text-white hover:bg-dark font-sans font-bold uppercase tracking-wider text-[9px] rounded-lg shadow-sm transition-all flex items-center gap-1 cursor-pointer border-none"
            >
              + Add Card
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(config.hero_cards || []).map((card, idx) => (
              <div key={idx} className="border border-cream3 rounded-2xl p-3 bg-cream/10 flex flex-col gap-3 relative group">
                <div className="aspect-[4/3] w-full bg-cream3 relative overflow-hidden rounded-xl border border-cream3">
                  <img src={card.image} alt={card.label} className="w-full h-full object-cover" onError={(e) => { e.target.src = '/images/Regular-T.png' }} />
                  <button
                    type="button"
                    onClick={() => handleRemoveCard(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow cursor-pointer transition-colors z-10"
                    title="Remove card"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-bold block text-dark2/60 mb-1">Card Label / Text</label>
                    <input
                      type="text"
                      value={card.label || ''}
                      onChange={(e) => handleCardLabelChange(idx, e.target.value)}
                      placeholder="e.g. Layered Necklace"
                      className="w-full px-3 py-1.5 bg-white border border-cream3 rounded-lg text-xs font-bold text-dark focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="w-full py-1.5 bg-dark hover:bg-accent text-white transition-colors font-bold uppercase rounded-lg cursor-pointer text-[9px] flex items-center justify-center gap-1.5 select-none shadow-sm border-none">
                      <Upload className="w-3 h-3" />
                      <span>{uploadingCardIdx === idx ? 'Uploading...' : 'Change Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingCardIdx === idx}
                        onChange={(e) => handleCardImageUpload(idx, e.target.files?.[0])}
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}

          </div>

          <div className="flex justify-end pt-3 border-t border-cream3 mt-4">
            <button
              type="submit"
              className="px-6 py-2.5 bg-dark text-cream hover:bg-accent hover:text-primary2 font-sans font-bold uppercase tracking-wider text-[10px] rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer border-none"
            >
              <Save className="w-3.5 h-3.5" /> Save Flow Cards
            </button>
          </div>
        </form>

        {/* Section 3: Featured Collection Selection */}
        <form onSubmit={handleSubmit} className="bg-white border border-cream3 p-3 sm:p-6 rounded-3xl space-y-5 hover:border-dark/25 hover:shadow-md transition-all duration-300 shadow-sm">
          <div className="flex items-center gap-3 border-b border-cream3 pb-3">
            <div className="p-2.5 bg-dark/5 text-dark rounded-xl">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-dark tracking-wider">3. Featured Collection Products</h3>
              <p className="text-[9px] text-dark2/45 uppercase mt-0.5 font-bold font-mono">Select products to render in the CATALOG SERIES 01 catalog grid</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-none">
            {products.map(prod => {
              const checked = config.featured_product_ids.includes(prod.id)
              return (
                <button
                  type="button"
                  key={prod.id}
                  onClick={() => toggleFeaturedProduct(prod.id)}
                  className={`flex items-center gap-3 p-3 bg-cream/15 border rounded-2xl text-left transition-all cursor-pointer hover:shadow-sm ${
                    checked ? 'border-accent bg-accent/5' : 'border-cream3 hover:border-dark/20'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-cream3 overflow-hidden shrink-0">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-grow">
                    <span className="font-bold text-dark text-xs block truncate uppercase">{prod.name}</span>
                    <span className="text-[9px] text-dark/50 block font-mono">₹{prod.price} • ID: {prod.id}</span>
                  </div>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    checked ? 'bg-accent border-accent text-white' : 'border-cream3'
                  }`}>
                    {checked && <span className="text-[10px] font-black">✓</span>}
                  </div>
                </button>
              )
            })}
            {products.length === 0 && (
              <div className="col-span-full py-8 text-center text-dark/40 font-mono text-[10px]">
                No inventory products found. Add products first.
              </div>
            )}
          </div>
          <div className="flex justify-end pt-2 border-t border-cream3 mt-4">
            <button
              type="submit"
              className="px-6 py-2.5 bg-dark text-cream hover:text-primary2 font-sans font-bold uppercase tracking-wider text-[10px] rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer border-none"
            >
              <Save className="w-3.5 h-3.5" /> Save Featured Collection
            </button>
          </div>
        </form>

        {/* Section 4: Sale Archive Selection */}
        <form onSubmit={handleSubmit} className="bg-white border border-cream3 p-3 sm:p-6 rounded-3xl space-y-5 hover:border-dark/25 hover:shadow-md transition-all duration-300 shadow-sm">
          <div className="flex items-center gap-3 border-b border-cream3 pb-3">
            <div className="p-2.5 bg-dark/5 text-dark rounded-xl">
              <Globe className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-dark tracking-wider">4. Sale Archive Products</h3>
              <p className="text-[9px] text-dark2/45 uppercase mt-0.5 font-bold font-mono">Select products to show inside the exclusive SALE ARCHIVE grid</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[300px]  pr-3 scrollbar-thin sales-archive">
            {products.map(prod => {
              const checked = config.sale_product_ids.includes(prod.id)
              return (
                <button
                  type="button"
                  key={prod.id}
                  onClick={() => toggleSaleProduct(prod.id)}
                  className={`flex items-center gap-3 p-3 bg-cream/15 border rounded-2xl text-left transition-all cursor-pointer hover:shadow-sm ${
                    checked ? 'border-accent bg-accent/5' : 'border-cream3 hover:border-dark/20'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-cream3 overflow-hidden shrink-0">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-grow">
                    <span className="font-bold text-dark text-xs block truncate uppercase">{prod.name}</span>
                    <span className="text-[9px] text-dark/50 block font-mono">₹{prod.price} {prod.originalPrice ? `(Was: ₹${prod.originalPrice})` : ''}</span>
                  </div>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    checked ? 'bg-accent border-accent text-white' : 'border-cream3'
                  }`}>
                    {checked && <span className="text-[10px] font-black">✓</span>}
                  </div>
                </button>
              )
            })}
          </div>
          <div className="flex justify-end pt-2 border-t border-cream3 mt-4">
            <button
              type="submit"
              className="px-6 py-2.5 bg-dark text-cream hover:text-primary2 font-sans font-bold uppercase tracking-wider text-[10px] rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer border-none"
            >
              <Save className="w-3.5 h-3.5" /> Save Sale Archive
            </button>
          </div>
        </form>

        {/* Section 5: Coming Soon & Countdown Section */}
        <form onSubmit={handleSubmit} className="bg-white border border-cream3 p-3 sm:p-6 rounded-3xl space-y-6 hover:border-dark/25 hover:shadow-md transition-all duration-300 shadow-sm">
          <div className="flex items-center gap-3 border-b border-cream3 pb-3">
            <div className="p-2.5 bg-dark/5 text-dark rounded-xl">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-dark tracking-wider">5. Next Drop Teaser & Countdown</h3>
              <p className="text-[9px] text-dark2/45 uppercase mt-0.5 font-bold font-mono">Update the next drop name, description, date countdown, and teaser images</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-bold block text-dark2/60">Collection Title</label>
                <input
                  type="text"
                  required
                  value={config.coming_soon_title}
                  onChange={(e) => setConfig({ ...config, coming_soon_title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-cream/35 border border-cream3 rounded-xl focus:outline-none focus:bg-white focus:border-dark font-sans text-xs font-bold transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-bold block text-dark2/60">Collection Subtitle/Tagline</label>
                <input
                  type="text"
                  required
                  value={config.coming_soon_subtitle}
                  onChange={(e) => setConfig({ ...config, coming_soon_subtitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-cream/35 border border-cream3 rounded-xl focus:outline-none focus:bg-white focus:border-dark font-sans text-xs font-bold transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-bold block text-dark2/60">Countdown Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={config.coming_soon_countdown}
                  onChange={(e) => setConfig({ ...config, coming_soon_countdown: e.target.value })}
                  className="w-full px-4 py-2.5 bg-cream/35 border border-cream3 rounded-xl focus:outline-none focus:bg-white focus:border-dark font-sans text-xs font-bold transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider font-bold block text-dark2/60">Teaser Description Paragraph</label>
              <textarea
                rows={3}
                required
                value={config.coming_soon_description}
                onChange={(e) => setConfig({ ...config, coming_soon_description: e.target.value })}
                className="w-full px-4 py-2.5 bg-cream/35 border border-cream3 rounded-xl focus:outline-none focus:bg-white focus:border-dark font-sans text-xs font-bold transition-all resize-none"
              />
            </div>

            {/* Sneak Peek Teasers */}
            <div className="space-y-4 pt-4 border-t border-cream3">
              <label className="text-[10px] uppercase tracking-wider font-bold block text-dark2/60 pb-1.5">Sneak Peek Teaser Images (3 Required)</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {config.coming_soon_images.map((img, idx) => (
                  <div key={idx} className="border border-cream3 rounded-2xl overflow-hidden bg-cream/20 flex flex-col group relative p-3 space-y-3">
                    <div className="aspect-[3/4] w-full bg-cream3 relative overflow-hidden rounded-xl">
                      {img.url ? (
                        <>
                          <img src={img.url} alt={`Teaser #${idx + 1}`} className="w-full h-full object-cover" onError={(e) => { e.target.src = '/images/Regular-T.png' }} />
                          <button
                            type="button"
                            onClick={() => handleRemoveTeaserImage(idx)}
                            className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow cursor-pointer transition-colors z-10"
                            title="Remove image"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-dark/30 font-mono text-[9px] uppercase">No Image</div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[8px] text-accent uppercase font-black">Teaser #{idx + 1}</span>
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Short Label"
                        value={img.label}
                        onChange={(e) => handleSneakPeekChange(idx, 'label', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-cream3 rounded-lg focus:outline-none focus:border-dark font-sans text-[10px]"
                      />
                      <label className="w-full py-2 bg-dark/10 hover:bg-dark hover:text-white transition-colors font-bold uppercase rounded-lg cursor-pointer text-[9px] flex items-center justify-center gap-1 select-none">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingTeasers[idx] ? 'Uploading...' : 'Upload Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingTeasers[idx]}
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (!file) return
                            setUploadingTeasers(prev => {
                              const updated = [...prev]
                              updated[idx] = true
                              return updated
                            })
                            try {
                              const url = await uploadFile(file)
                              handleSneakPeekChange(idx, 'url', url)
                              toast.success(`Teaser image #${idx + 1} uploaded successfully!`)
                            } catch (err) {
                              toast.error(`Upload failed: ${err.message}`)
                            } finally {
                              setUploadingTeasers(prev => {
                                const updated = [...prev]
                                updated[idx] = false
                                return updated
                              })
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-3 border-t border-cream3 mt-4">
            <button
              type="submit"
              className="px-6 py-2.5 bg-dark text-cream hover:text-primary2 font-sans font-bold uppercase tracking-wider text-[10px] rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer border-none"
            >
              <Save className="w-3.5 h-3.5" /> Save Teaser & Countdown
            </button>
          </div>
        </form>
      </div>

      {/* Add Flow Card Popup Modal */}
      <AnimatePresence>
        {showAddCardModal && (
          <div className="    fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddCardModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md bg-white text-dark rounded-3xl p-6 shadow-2xl border border-cream3 flex flex-col gap-5 z-10"
            >
              <div className="flex justify-between items-center w-full border-b border-cream3 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-accent/10 text-accent rounded-xl">
                    <Image className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase text-dark tracking-wider">Add New Flow Card</h3>
                    <p className="text-[9px] text-dark2/50 font-mono">Create a new rotating card for landing page</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddCardModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-cream2 border border-cream3 hover:bg-cream3 cursor-pointer transition-colors border-none"
                >
                  <X className="w-4 h-4 text-dark/75" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold block text-dark2/60 mb-1.5">Card Label / Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Layered Necklace"
                    value={newCardForm.label}
                    onChange={(e) => setNewCardForm({ ...newCardForm, label: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream/20 border border-cream3 rounded-xl text-xs font-bold text-dark focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold block text-dark2/60 mb-1.5">Card Image <span className="text-red-500">*</span></label>
                  <div className="flex flex-col gap-3">
                    {newCardForm.image ? (
                      <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border border-cream3 relative bg-cream3">
                        <img src={newCardForm.image} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setNewCardForm({ ...newCardForm, image: '' })}
                          className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow cursor-pointer transition-colors"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-cream3 hover:border-accent hover:bg-cream/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all">
                        <div className="w-10 h-10 bg-dark text-white rounded-xl flex items-center justify-center shadow-sm">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-dark">{uploadingModalImg ? 'Uploading...' : 'Click to Upload Image'}</span>
                        <span className="text-[9px] text-dark/40 font-mono">PNG, JPG, WEBP up to 10MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingModalImg}
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (!file) return
                            setUploadingModalImg(true)
                            try {
                              const url = await uploadToCloudinary(file)
                              setNewCardForm(prev => ({ ...prev, image: url }))
                              toast.success('Image uploaded successfully!')
                            } catch (err) {
                              toast.error(`Upload failed: ${err.message}`)
                            } finally {
                              setUploadingModalImg(false)
                            }
                          }}
                        />
                      </label>
                    )}
                    <input
                      type="text"
                      placeholder="Or paste image URL here..."
                      value={newCardForm.image}
                      onChange={(e) => setNewCardForm({ ...newCardForm, image: e.target.value })}
                      className="w-full px-3 py-2 bg-cream/10 border border-cream3 rounded-xl text-[11px] font-mono text-dark focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-cream3">
                <button
                  type="button"
                  onClick={() => setShowAddCardModal(false)}
                  className="px-5 py-2 bg-cream3 text-dark hover:bg-dark hover:text-white font-sans font-bold uppercase tracking-wider text-[10px] rounded-xl transition-all cursor-pointer border-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!newCardForm.image || !newCardForm.label || uploadingModalImg}
                  onClick={() => {
                    if (!newCardForm.image || !newCardForm.label) {
                      toast.error('Please provide both image and label')
                      return
                    }
                    setConfig(prev => ({
                      ...prev,
                      hero_cards: [...(prev.hero_cards || []), { image: newCardForm.image, label: newCardForm.label }]
                    }))
                    setShowAddCardModal(false)
                    toast.success('New card added! Click Save Flow Cards to apply.')
                  }}
                  className="px-6 py-2 bg-accent text-white hover:bg-dark font-sans font-bold uppercase tracking-wider text-[10px] rounded-xl shadow-sm transition-all cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Flow Card
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
