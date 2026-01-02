/**
 * Time conversion utilities for swim times
 * Based on PHP timeconvert.php functions
 */

/**
 * Convert seconds (decimal) to display time format
 * Examples:
 *   22.03 -> "22.03"
 *   62.45 -> "1:02.45"
 *   3661.23 -> "1:01:01.23"
 *
 * @param timeSec - Time in seconds (decimal)
 * @returns Formatted time string
 */
export function timeSecToDisplayTime(timeSec: number): string {
  if (!timeSec || timeSec === 0) {
    return '--'
  }

  const hours = Math.floor(timeSec / 3600)
  const minutes = Math.floor((timeSec % 3600) / 60)
  const seconds = timeSec % 60

  // Format seconds to always show 2 decimal places
  const secStr = seconds.toFixed(2).padStart(5, '0')

  if (hours > 0) {
    // Format: H:MM:SS.HH
    const minStr = minutes.toString().padStart(2, '0')
    return `${hours}:${minStr}:${secStr}`
  } else if (minutes > 0) {
    // Format: M:SS.HH
    return `${minutes}:${secStr}`
  } else {
    // Format: SS.HH
    return secStr
  }
}

/**
 * Convert display time string to seconds
 * Examples:
 *   "22.03" -> 22.03
 *   "1:02.45" -> 62.45
 *   "1:01:01.23" -> 3661.23
 *
 * @param timeStr - Formatted time string
 * @returns Time in seconds (decimal)
 */
export function displayTimeToTimeSec(timeStr: string): number {
  if (!timeStr || timeStr === '--' || timeStr === 'NT' || timeStr === 'NS') {
    return 0
  }

  const parts = timeStr.split(':')

  if (parts.length === 1) {
    // SS.HH format
    return parseFloat(parts[0])
  } else if (parts.length === 2) {
    // M:SS.HH format
    const minutes = parseInt(parts[0], 10)
    const seconds = parseFloat(parts[1])
    return minutes * 60 + seconds
  } else if (parts.length === 3) {
    // H:MM:SS.HH format
    const hours = parseInt(parts[0], 10)
    const minutes = parseInt(parts[1], 10)
    const seconds = parseFloat(parts[2])
    return hours * 3600 + minutes * 60 + seconds
  }

  return 0
}

/**
 * Format a fixed-time event display name
 * Examples:
 *   60 -> "1-Hour Swim"
 *   30 -> "30-Min. Swim"
 *   120 -> "2-Hour Swim"
 *
 * @param minutes - Event duration in minutes
 * @returns Formatted event name
 */
export function formatFixedTimeEvent(minutes: number): string {
  if (minutes === 0) {
    return ''
  }

  if (minutes % 60 === 0) {
    const hours = minutes / 60
    return `${hours}-Hour Swim`
  } else {
    return `${minutes}-Min. Swim`
  }
}

/**
 * Calculate pace (time per 100 yards/meters)
 *
 * @param timeSec - Time in seconds
 * @param distance - Distance in yards/meters
 * @returns Pace per 100 as formatted string
 */
export function calculatePace(timeSec: number, distance: number): string {
  if (!timeSec || !distance || distance === 0) {
    return '--'
  }

  const pacePerHundred = (timeSec / distance) * 100
  return timeSecToDisplayTime(pacePerHundred)
}

/**
 * Format date for display
 *
 * @param dateStr - Date string (YYYY-MM-DD)
 * @returns Formatted date (MMM DD, YYYY)
 */
export function formatMeetDate(dateStr: string): string {
  if (!dateStr || dateStr === '0000-00-00') {
    return ''
  }

  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Parse event status to display text
 *
 * @param status - Event status code
 * @returns Display text
 */
export function formatEventStatus(
  status: 'OK' | 'DQ' | 'NS' | 'SCR' | 'DNF' | 'EXH' | 'NT'
): string {
  const statusMap: Record<string, string> = {
    OK: '',
    DQ: 'Disqualified',
    NS: 'No Show',
    SCR: 'Scratch',
    DNF: 'Did Not Finish',
    EXH: 'Exhibition',
    NT: 'No Time',
  }

  return statusMap[status] || status
}

/**
 * Get ordinal suffix for placement
 *
 * @param place - Place number
 * @returns Ordinal string (e.g., "1st", "2nd", "3rd")
 */
export function formatPlace(place: number): string {
  if (!place || place === 0) {
    return '--'
  }

  const j = place % 10
  const k = place % 100

  if (j === 1 && k !== 11) {
    return `${place}st`
  }
  if (j === 2 && k !== 12) {
    return `${place}nd`
  }
  if (j === 3 && k !== 13) {
    return `${place}rd`
  }
  return `${place}th`
}

/**
 * Format swimmer name with privacy handling
 *
 * @param firstName - First name
 * @param mi - Middle initial
 * @param lastName - Last name
 * @param hideMemberInfo - Privacy flag
 * @returns Formatted name
 */
export function formatSwimmerName(
  firstName: string,
  mi: string,
  lastName: string,
  hideMemberInfo: boolean
): string {
  if (hideMemberInfo) {
    return 'Name Unknown'
  }

  const parts = [firstName, mi, lastName].filter(Boolean)
  return parts.join(' ')
}
