import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useStateStore = defineStore('state', ()=> {
  const size = ref(16)  // 段数
  const mineCount = ref(30)  // 地雷の数

  const mines = ref<number[]>([])  // 地雷がある場所
  const open = ref<number[]>([])  // 開いている場所
  const flagged = ref<number[]>([])  // 旗を立てた場所

  const flagMode = ref(false)  // 旗を立てるモード
  const started = ref(false)  // 開始されているか
  const cleared = ref(false)  // クリアされているか
  const failed = ref(false)  // 地雷を踏んだか

  const reset = () => {
    size.value = 16
    mineCount.value = 30

    mines.value = []
    open.value = []
    flagged.value = []

    flagMode.value = false
    started.value = false
    cleared.value = false
    failed.value = false
  }

  // 隣接する三角形の番号のリストを返す
  const getAdjacent = (n: number) => {
    const k = Math.ceil(n ** .5)  // k段目
    const l = k * 2 - 1  // k段目の三角形の数

    if ((k ** 2 - n) % 2 == 0) {  // 上向きの三角形
      if (Number.isInteger((n - 1) ** .5)) {  // 左の辺に接する
        if (Number.isInteger(n ** .5)) {  // 右の辺に接する
          return [
            n + l,
            n + l + 1,
            n + l + 2,
          ]
        } else if (k == size.value) {  // 下の辺に接する
          return [
            n - l + 2,
            n + 1,
            n + 2,
          ]
        } else {
          return [
            n - l + 2,
            n + 1,
            n + 2,
            n + l,
            n + l + 1,
            n + l + 2,
            n + l + 3,
          ]
        }
      } else if (Number.isInteger(n ** .5)) {  // 右の辺に接する
        if (k == size.value) {  // 下の辺に接する
          return [
            n - l,
            n - 2,
            n - 1,
          ]
        } else {
          return [
            n - l,
            n - 2,
            n - 1,
            n + l - 1,
            n + l,
            n + l + 1,
            n + l + 2,
          ]
        }
      } else {
        if (k == size.value) {  // 下の辺に接する
          return [
            n - l,
            n - l + 1,
            n - l + 2,
            n - 2,
            n - 1,
            n + 1,
            n + 2,
          ]
        } else {
          return [
            n - l,
            n - l + 1,
            n - l + 2,
            n - 2,
            n - 1,
            n + 1,
            n + 2,
            n + l - 1,
            n + l,
            n + l + 1,
            n + l + 2,
            n + l + 3,
          ]
        }
      }
    } else {  // 下向きの三角形
      if (Number.isInteger((n - 2) ** .5)) {  // 左の辺に接する
        if (Number.isInteger((n + 1) ** .5)) {  // 右の辺に接する
          return [
            n - l + 1,
            n - 1,
            n + 1,
            n + l,
            n + l + 1,
            n + l + 2,
          ]
        } else if (k == size.value) {  // 下の辺に接する
          return [
            n - l + 1,
            n - l + 2,
            n - l + 3,
            n - 1,
            n + 1,
            n + 2,
          ]
        } else {
          return [
            n - l + 1,
            n - l + 2,
            n - l + 3,
            n - 1,
            n + 1,
            n + 2,
            n + l,
            n + l + 1,
            n + l + 2,
          ]
        }
      } else if (Number.isInteger((n + 1) ** .5)) {  // 右の辺に接する
        if (k == size.value) {  // 下の辺に接する
          return [
            n - l - 1,
            n - l,
            n - l + 1,
            n - 2,
            n - 1,
            n + 1,
          ]
        } else {
          return [
            n - l - 1,
            n - l,
            n - l + 1,
            n - 2,
            n - 1,
            n + 1,
            n + l,
            n + l + 1,
            n + l + 2,
          ]
        }
      } else {
        if (k == size.value) {  // 下の辺に接する
          return [
            n - l - 1,
            n - l,
            n - l + 1,
            n - l + 2,
            n - l + 3,
            n - 2,
            n - 1,
            n + 1,
            n + 2,
          ]
        } else {
          return [
            n - l - 1,
            n - l,
            n - l + 1,
            n - l + 2,
            n - l + 3,
            n - 2,
            n - 1,
            n + 1,
            n + 2,
            n + l,
            n + l + 1,
            n + l + 2,
          ]
        }
      }
    }
  }

  // クリック時の動作
  const click = (n: number) => {
    // 初回実行
    if (!started.value) {
      // ランダムに地雷を設置
      const adjacent = getAdjacent(n)
      for (;;) {
        const rand = Math.floor(Math.random() * (size.value ** 2 + 1) + 1)
        if (rand != n && !adjacent.includes(rand)) {
          mines.value.push(rand)
        }
        if (mines.value.length == mineCount.value) {
          break
        }
      }

      started.value = true
    }

    // 開いている場合は無視
    if (open.value.includes(n)) {
      return
    }

    // 旗を立てる
    if (flagMode.value) {
      if (flagged.value.includes(n)) {
        flagged.value.splice(flagged.value.indexOf(n), 1)
      } else {
        flagged.value.push(n)
      }
      return
    }

    // 旗が立っている場合は無視
    if (flagged.value.includes(n)) {
      return
    }

    // ゲームオーバー判定
    if (mines.value.includes(n)) {
      failed.value = true
      return
    }

    // open配列に追加
    open.value.push(n)

    // クリア判定
    if (mineCount.value + open.value.length == size.value ** 2) {
      cleared.value = true
      return
    }

    // 周辺に地雷が無ければ再帰処理
    const adjacent = getAdjacent(n)
    if ([...mines.value, ...adjacent].filter(item => mines.value.includes(item) && adjacent.includes(item)).length == 0) {
      for (const a of adjacent) {
        click(a)
      }
    }
  }

  return { size, mineCount, mines, open, flagged, flagMode, started, cleared, failed, reset, getAdjacent, click }
}, { persist: true })
