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
    const filtered = withUrl.filter((song) => song.url && song.url.indexOf('vkey') > -1)
    // 无有效播放链接时仍返回歌曲列表，便于展示（播放会失败）
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
