import dayjs from 'dayjs'

import pluginRelativeTime  from 'dayjs/plugin/relativeTime'

dayjs.extend(pluginRelativeTime)

export function formatRelativeTime(date: Date) {
  return dayjs(date).fromNow()
}

