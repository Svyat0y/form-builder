export interface ParsedDevice {
  device: string
  os: string
  type: 'desktop' | 'mobile'
}

export const parseUserAgent = (ua: string | null): ParsedDevice => {
  if (!ua)
    return { device: 'Unknown device', os: 'Unknown OS', type: 'desktop' }

  const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua)

  let device = 'Unknown browser'
  if (/Edg\//.test(ua)) device = 'Edge'
  else if (/OPR\//.test(ua)) device = 'Opera'
  else if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) device = 'Chrome'
  else if (/Firefox\//.test(ua)) device = 'Firefox'
  else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) device = 'Safari'

  let os = 'Unknown OS'
  if (/Windows/.test(ua)) os = 'Windows'
  else if (/iPhone|iPad|iOS/.test(ua)) os = 'iOS'
  else if (/Mac OS X/.test(ua)) os = 'macOS'
  else if (/Android/.test(ua)) os = 'Android'
  else if (/Linux/.test(ua)) os = 'Linux'

  return { device, os, type: isMobile ? 'mobile' : 'desktop' }
}
