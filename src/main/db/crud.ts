/**
 * 約定日,銘柄コード,銘柄名,市場,取引区分,預り区分,約定数量,約定単価,手数料/諸経費等,税額,受渡金額/決済損益,業種
 * table
 *
 * 買いと売りの紐づけはユーザーに任せる
 * 入力時または履歴に紐づけのボタンをつけて、過去の取引から選択させる
 *
 * trade
 * - id: number
 * - date: dateTime
 * - code: number
 * - tradeType: string
 * - holdType: string
 * - quantity: number
 * - restQuantity: number
 * - price: number
 * - fee: number
 * - tax: number
 *
 * tradeLinks
 * - id: number
 * - newTradeId: number
 * - repayTradeId: number
 *
 * brandProfile
 * - id: number
 * - code: number
 * - company: string
 * - marketCode: number
 * - businessType: string
 *
 * marketPlace
 * - id: number
 * - place: string
 * - market: string
 *
 */
import sqlite3 from 'sqlite3'
import { isNewTradeType, turnedTradeType } from './dbHooks'

const db = new sqlite3.Database('./stock.db')
db.run('drop table if exists trades')
db.run(
  'CREATE TABLE if not exists trades (' +
    'id TEXT PRIMARY KEY,' +
    'date TEXT NOT NULL,' +
    'code INTEGER NOT NULL,' +
    'tradeType TEXT NOT NULL,' +
    'holdType TEXT NOT NULL,' +
    'quantity INTEGER NOT NULL,' +
    'restQuantity INTEGER NOT NULL,' +
    'price REAL NOT NULL,' +
    'fee REAL NOT NULL,' +
    'tax REAL NOT NULL)'
)

const _insert = (
  tradeData: tradeDataObject,
  updatedIds: string[] = []
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const insertSellSql = `
      INSERT INTO trades (id, date, code, tradeType, holdType, quantity, restQuantity, price, fee, tax)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    console.log('insert')

    db.run(
      insertSellSql,
      [
        tradeData.id,
        tradeData.date,
        tradeData.code,
        tradeData.tradeType,
        tradeData.holdType,
        tradeData.quantity,
        isNewTradeType(tradeData.tradeType) ? tradeData.quantity : 0,
        tradeData.price,
        tradeData.fee,
        tradeData.tax,
      ],
      (err) => {
        if (err) {
          db.run('ROLLBACK')
          return reject(err.message)
        }

        db.run('COMMIT', (commitErr) => {
          if (commitErr) {
            db.run('ROLLBACK')
            return reject(commitErr.message)
          }

          console.log('to select')
          resolve(CRUD.select([...updatedIds, tradeData.id]))
        })
      }
    )
  })
}

export class CRUD {
  static async insert(tradeData: tradeDataObject): Promise<any> {
    return new Promise((resolve, reject) => {
      db.run('BEGIN TRANSACTION;', (err) => {
        if (err) {
          console.log('No.1: ', err.message)
          return reject(err.message)
        }

        // 返済取引の場合は
        if (!isNewTradeType(tradeData.tradeType)) {
          const buyTradeSql =
            'SELECT * ' +
            'FROM trades ' +
            'WHERE code = ? ' +
            'AND tradeType = ? ' +
            'AND restQuantity > 0 ' + // 既に返済済みは排除
            'ORDER BY date ASC ' // 古いデータを優先

          const updatedIds: string[] = []

          db.all(
            buyTradeSql,
            [tradeData.code, turnedTradeType(tradeData.tradeType)],
            (err, rows: any[]) => {
              console.log('rows', rows)

              if (err) {
                console.error('No.3: ', err.message)
                db.run('ROLLBACK') // エラーがあればロールバック
                return reject(err.message)
              }

              if (rows.length == 0) {
                console.log('in row if')
                const message = '条件に合う新規取引がありません'
                console.error('No.3_1: ', message)
                db.run('ROLLBACK') // エラーがあればロールバック
                return reject(message)
              }

              console.log('rows after ')

              let repayQuant = tradeData.quantity

              // 新規取引のデータを回し終わるか、返済数量が0になったら終了
              for (let i = 0; i < rows.length && repayQuant > 0; i++) {
                const row = rows[i]
                console.log(row.date)
                let rowRestQuantity = row['restQuantity']

                // 新規取引数量 >= 残り返済取引数量 の場合
                if (rowRestQuantity >= repayQuant) {
                  rowRestQuantity = rowRestQuantity - repayQuant
                  repayQuant = 0
                  // 残り返済取引数量のほうが多い場合
                } else {
                  repayQuant = repayQuant - rowRestQuantity
                  rowRestQuantity = 0
                }

                // 新規取引のrestQuantityを更新
                const updateBuySql =
                  'UPDATE trades SET restQuantity = ? WHERE id = ? '

                db.run(updateBuySql, [rowRestQuantity, row.id], (err) => {
                  if (err) {
                    console.log('No.4: ', err.message)
                    db.run('ROLLBACK') // エラーがあればロールバック
                    return reject(err.message)
                  }

                  updatedIds.push(row.id)

                  // 返済数量がなくなった場合
                  // アップデートされた行をPromiseで返す
                  if (repayQuant === 0) {
                    return resolve(_insert(tradeData, updatedIds))

                    // 返済数量が残っている
                    // かつ、新規取引のデータが尽きた場合
                  } else if (rows.length === 0) {
                    console.log(
                      'No.6 : ',
                      'No matching buy trade or insufficient restQuantity.'
                    )
                    db.run('ROLLBACK')
                    return reject(
                      '返済取引と合致する新規取引が見つかりませんでした。'
                    )
                  }
                })
              }
            }
          )
        } else {
          return resolve(_insert(tradeData))
        }
      })
    })
  }

  static async select(ids?: string[]): Promise<any> {
    return new Promise((resolev, reject) => {
      let selectSql = 'SELECT * FROM trades '
      if (ids) {
        // プレースホルダーを配列の長さに合わせて生成
        const placeholders = ids.map(() => '?').join(',')
        selectSql += `WHERE id IN (${placeholders})`
      }
      selectSql += ' ORDER BY date DESC '
      console.log('start all')
      db.all(selectSql, ids, (err, row) => {
        console.log('end all select')
        if (err) return reject(err)
        resolev(row)
      })
    })
  }

  static async update(data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!data.id) {
        return reject('データタイプが違います')
      }

      const updateData: any[] = []
      let updateSql = 'UPDATE trades SET '
      const fields: string[] = []

      // フィールドごとに更新データを準備
      if (data.date) {
        updateData.push(data.date)
        fields.push('date = ?')
      }
      if (data.code) {
        updateData.push(data.code)
        fields.push('code = ?')
      }
      if (data.tradeType) {
        updateData.push(data.tradeType)
        fields.push('tradeType = ?')
      }
      if (data.holdType) {
        updateData.push(data.holdType)
        fields.push('holdType = ?')
      }
      if (data.quantity) {
        updateData.push(data.quantity)
        fields.push('quantity = ?')
      }
      if (data.price) {
        updateData.push(data.price)
        fields.push('price = ?')
      }
      if (data.fee) {
        updateData.push(data.fee)
        fields.push('fee = ?')
      }
      if (data.tax) {
        updateData.push(data.tax)
        fields.push('tax = ?')
      }

      // 更新するフィールドがなければエラー
      if (fields.length === 0) {
        return reject('更新データが見つかりませんでした')
      }

      // SQLクエリにWHERE句を追加してidで更新
      updateSql += fields.join(', ') + ' WHERE id = ?'
      updateData.push(data.id)

      db.run(updateSql, updateData, (err) => {
        if (err) {
          console.log(err.message)
          return reject(err.message)
        }
        resolve()
      })
    })
  }

  static async delete(ids: [string, ...string[]]): Promise<void> {
    // プレースホルダーを配列の長さに合わせて生成
    const placeholders = ids.map(() => '?').join(',')
    const deleteSql = `DELETE FROM trades WHERE id IN (${placeholders})`
    return new Promise((resolev, reject) => {
      db.all(deleteSql, ids, (err, row) => {
        if (err) return reject(err)
        resolev()
      })
    })
  }
}
