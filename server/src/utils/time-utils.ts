/**
 * Time conversion utilities for swim times
 * Mirrors ../src/lib/time-utils.ts from frontend
 */

export function timeSecToDisplayTime(timeSec: number): string {
  if (!timeSec || timeSec === 0) {
    return '--'
  }

  const hours = Math.floor(timeSec / 3600)
  const minutes = Math.floor((timeSec % 3600) / 60)
  const seconds = timeSec % 60

  const secStr = seconds.toFixed(2).padStart(5, '0')

  if (hours > 0) {
    const minStr = minutes.toString().padStart(2, '0')
    return `${hours}:${minStr}:${secStr}`
  } else if (minutes > 0) {
    return `${minutes}:${secStr}`
  } else {
    return secStr
  }
}

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

export function formatSwimmerName(
  firstName: string,
  mi: string,
  lastName: string,
  hideMemberInfo: boolean
): { firstName: string; mi: string; lastName: string; fullName: string } {
  if (hideMemberInfo) {
    return {
      firstName: 'Name',
      mi: '',
      lastName: 'Unknown',
      fullName: 'Name Unknown',
    }
  }

  const parts = [firstName, mi, lastName].filter(Boolean)
  return {
    firstName,
    mi,
    lastName,
    fullName: parts.join(' '),
  }
}
