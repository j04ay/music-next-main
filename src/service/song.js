import { get } from './base'

export function processSongs(songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }

  return get('/api/getSongsUrl', {
    mid: songs.map((song) => song.mid)
  }).then((result) => {
    if (!result || !result.map) {
      return songs
    }
    const map = result.map
    const withUrl = songs.map((song) => {
      song.url = map[song.mid]
      return song
    })
    // 有效播放链：完整 http(s) 且含音频路径或鉴权参数（QQ 返回格式会变，不再强依赖 vkey 子串）
    const hasPlayableUrl = (u) =>
      typeof u === 'string' &&
      /^https?:\/\//.test(u) &&
      (u.includes('vkey') || u.includes('qqmusic') || /\.(m4a|mp3|aac|flac)/i.test(u))
    const filtered = withUrl.filter((song) => song.url && hasPlayableUrl(song.url))
    return filtered.length > 0 ? filtered : withUrl
  })
}

const lyricMap = {}

export function getLyric(song) {
  if (song.lyric) {
    return Promise.resolve(song.lyric)
  }
  const mid = song.mid
  const lyric = lyricMap[mid]
  if (lyric) {
    return Promise.resolve(lyric)
  }

  return get('/api/getLyric', {
    mid
  }).then((result) => {
    const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
    lyricMap[mid] = lyric
    return lyric
  })
}
