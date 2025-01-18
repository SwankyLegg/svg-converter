export const socialPlatforms = {
  twitter: {
    name: 'Twitter/X',
    sizes: [
      { name: 'Twitter Profile Photo', width: 400, height: 400, type: 'logo' },
      { name: 'Twitter Header', width: 1500, height: 500, type: 'banner' },
      { name: 'Twitter Post Image', width: 1600, height: 900, type: 'post' },
    ]
  },
  facebook: {
    name: 'Facebook',
    sizes: [
      { name: 'Facebook Profile Picture', width: 170, height: 170, type: 'logo' },
      { name: 'Facebook Cover Photo', width: 1640, height: 624, type: 'banner' },
      { name: 'Facebook Post Image', width: 1200, height: 630, type: 'post' },
      { name: 'Facebook Event Cover', width: 1920, height: 1080, type: 'event' },
    ]
  },
  linkedin: {
    name: 'LinkedIn',
    sizes: [
      { name: 'LinkedIn Profile Picture', width: 400, height: 400, type: 'logo' },
      { name: 'LinkedIn Company Banner', width: 1128, height: 191, type: 'banner' },
      { name: 'LinkedIn Post Image', width: 1200, height: 627, type: 'post' },
    ]
  },
  youtube: {
    name: 'YouTube',
    sizes: [
      { name: 'YouTube Profile Picture', width: 800, height: 800, type: 'logo' },
      { name: 'YouTube Channel Banner', width: 2560, height: 1440, type: 'banner' },
      { name: 'YouTube Thumbnail', width: 1280, height: 720, type: 'thumbnail' },
    ]
  },
  instagram: {
    name: 'Instagram',
    sizes: [
      { name: 'Instagram Profile Picture', width: 320, height: 320, type: 'logo' },
      { name: 'Instagram Post Square', width: 1080, height: 1080, type: 'post' },
      { name: 'Instagram Post Portrait', width: 1080, height: 1350, type: 'post' },
      { name: 'Instagram Story', width: 1080, height: 1920, type: 'story' },
    ]
  },
  tiktok: {
    name: 'TikTok',
    sizes: [
      { name: 'TikTok Profile Photo', width: 200, height: 200, type: 'logo' },
      { name: 'TikTok Video Cover', width: 1080, height: 1920, type: 'cover' },
    ]
  }
};

export const webSizes = {
  name: 'Web Assets',
  sizes: [
    { name: 'Favicon', width: 16, height: 16, type: 'logo', generateIco: true },
    { name: 'Retina Favicon', width: 32, height: 32, type: 'logo' },
    { name: 'iOS App Icon', width: 180, height: 180, type: 'logo' },
    { name: 'Android App Icon', width: 192, height: 192, type: 'logo' },
    { name: 'Google Play Icon', width: 512, height: 512, type: 'logo' },
    { name: 'Small Web', width: 250, height: 250, type: 'logo' },
    { name: 'Medium Web', width: 500, height: 500, type: 'logo' },
    { name: 'Large Web', width: 1000, height: 1000, type: 'logo' },
    { name: 'High-Res', width: 2000, height: 2000, type: 'logo' },
    { name: 'XS Web', width: 120, height: 60, type: 'wordmark' },
    { name: 'Small Web (Wordmark)', width: 240, height: 120, type: 'wordmark' },
    { name: 'Medium Web (Wordmark)', width: 400, height: 200, type: 'wordmark' },
    { name: 'Large Web (Wordmark)', width: 600, height: 300, type: 'wordmark' },
    { name: 'XL Web', width: 800, height: 400, type: 'wordmark' },
    { name: 'Header', width: 1000, height: 500, type: 'wordmark' },
    { name: 'Large Header', width: 1400, height: 700, type: 'wordmark' },
    { name: 'Print', width: 2400, height: 1200, type: 'wordmark' }
  ]
};

// For backward compatibility and easy access to all sizes
export const allSizes = [
  ...webSizes.sizes,
  ...Object.values(socialPlatforms).flatMap(platform => platform.sizes)
]; 