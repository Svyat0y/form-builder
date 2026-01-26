export const formatDeviceName = (
  deviceInfo: string | null,
  maxLength: number = 40,
): string => {
  if (!deviceInfo) {
    return 'Unknown Device'
  }

  // If already short, return as is
  if (deviceInfo.length <= maxLength) {
    return deviceInfo
  }

  // Try to parse User-Agent and extract browser + OS
  const ua = deviceInfo.toLowerCase()

  // Extract browser
  let browser = 'Unknown Browser'
  if (ua.includes('chrome') && !ua.includes('edg')) {
    browser = 'Chrome'
  } else if (ua.includes('firefox')) {
    browser = 'Firefox'
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    browser = 'Safari'
  } else if (ua.includes('edg')) {
    browser = 'Edge'
  } else if (ua.includes('opera') || ua.includes('opr')) {
    browser = 'Opera'
  }

  // Extract OS
  let os = ''
  if (ua.includes('windows')) {
    if (ua.includes('windows nt 10')) {
      os = 'Windows 10/11'
    } else if (ua.includes('windows nt 6.3')) {
      os = 'Windows 8.1'
    } else if (ua.includes('windows nt 6.2')) {
      os = 'Windows 8'
    } else if (ua.includes('windows nt 6.1')) {
      os = 'Windows 7'
    } else {
      os = 'Windows'
    }
  } else if (ua.includes('mac os') || ua.includes('macintosh')) {
    os = 'macOS'
  } else if (ua.includes('linux')) {
    os = 'Linux'
  } else if (ua.includes('android')) {
    os = 'Android'
  } else if (
    ua.includes('iphone') ||
    ua.includes('ipad') ||
    ua.includes('ipod')
  ) {
    os = 'iOS'
  }

  // Format result
  if (os) {
    const result = `${browser} on ${os}`
    return result.length <= maxLength
      ? result
      : result.substring(0, maxLength - 3) + '...'
  }

  // If OS not detected, just return browser or truncate
  if (browser !== 'Unknown Browser') {
    return browser.length <= maxLength
      ? browser
      : browser.substring(0, maxLength - 3) + '...'
  }

  // Fallback: truncate original string
  return deviceInfo.substring(0, maxLength - 3) + '...'
}
