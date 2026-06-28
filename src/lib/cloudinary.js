const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'i7xfzmwt'
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'boujee_bazar_unsigned'

/**
 * Returns a Cloudinary CDN URL for a given public_id or passthrough for local/full URLs.
 * @param {string} src - public_id, full URL, or local /assets/ path
 * @param {object} [opts] - Cloudinary transformations e.g. { width: 400, quality: 'auto' }
 */
export function getImageUrl(src, opts = {}) {
  if (!src) return ''
  // Already a full URL (Cloudinary CDN, external, or data URI)
  if (src.startsWith('http') || src.startsWith('data:')) return src
  // Local public asset — serve as-is
  if (src.startsWith('/assets/') || src.startsWith('/images/')) return src
  // Treat as Cloudinary public_id
  const transforms = Object.entries({ f_auto: '', q_auto: '', ...opts })
    .map(([k, v]) => (v !== '' ? `${k}_${v}` : k))
    .join(',')
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${src}`
}

/**
 * Uploads a File object to Cloudinary using an unsigned upload preset.
 * Returns the secure URL of the uploaded image.
 * @param {File} file
 * @returns {Promise<string>} secure_url
 */
export async function uploadToCloudinary(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', 'boujee-bazar/products')

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Upload failed: ${res.status}`)
  }

  const data = await res.json()
  return data.secure_url
}
