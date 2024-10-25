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

const executeSQL = (sql: string, params: any[] = []): Promise<void> => {
  console.log(sql)
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) return reject(err.message)
      resolve()
    })
  })
}

const _insert = async (trades: tradeDataObject[]): Promise<void> => {
  const insertSql = `INSERT INTO trades VALUES ${trades.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(',')}`
  const insertData = trades.flatMap((trade) => [
    trade.id,
    trade.date,
    trade.code,
    trade.tradeType,
    trade.holdType,
    trade.quantity,
    trade.quantity,
    trade.price,
    trade.fee,
    trade.tax,
  ])

  console.log('to insert')
  await executeSQL(insertSql, insertData)
}

const insertNewTrade = async (tradeDatas: tradeDataObject[]): Promise<void> => {
  const newTrades = tradeDatas.filter((data) => isNewTradeType(data.tradeType))
  if (newTrades.length) {
    await _insert(newTrades)
  }
}

const insertRepayTrade = async (
  tradeDatas: tradeDataObject[]
): Promise<void> => {
  const repayTrades = tradeDatas.filter(
    (data) => !isNewTradeType(data.tradeType)
  )

  if (!repayTrades.length) return

  const newTradeSql = `
    SELECT * FROM trades 
    WHERE code = ? AND tradeType = ? AND restQuantity > 0 
    ORDER BY date ASC
  `
  try {
    await executeSQL('BEGIN TRANSACTION')

    for (const repayTrade of repayTrades) {
      const rows: any[] = await new Promise((resolve, reject) => {
        db.all(
          newTradeSql,
          [repayTrade.code, turnedTradeType(repayTrade.tradeType)],
          (err, rows) => {
            if (err) return reject(err.message)
            resolve(rows)
          }
        )
      })

      let repayQuant = repayTrade.quantity
      const tradesToUpdate: tradeDataObject[] = []

      for (const row of rows) {
        if (repayQuant === 0) break

        let rowRestQuantity = row.restQuantity

        if (rowRestQuantity >= repayQuant) {
          rowRestQuantity -= repayQuant
          repayQuant = 0
        } else {
          repayQuant -= rowRestQuantity
          rowRestQuantity = 0
        }

        tradesToUpdate.push({
          ...row,
          restQuantity: rowRestQuantity,
        })
      }

      console.log('to update', tradesToUpdate)
      await CRUD.update(tradesToUpdate, ['restQuantity'])

      if (repayQuant)
        throw new Error('No matching buy trade or insufficient restQuantity.')

      await _insert([repayTrade])
    }

    await executeSQL('COMMIT')
  } catch (err) {
    console.log(err)
    await executeSQL('ROLLBACK')
    throw err
  }
}

export class CRUD {
  static async insert(trades: tradeDataObject[]): Promise<any> {
    await insertNewTrade(trades)
    await insertRepayTrade(trades)
  }

  static async select(ids?: string[]): Promise<any[]> {
    const placeholders = ids?.length
      ? `WHERE id IN (${ids.map(() => ' ? ').join(',')})`
      : ''
    const selectSql = `SELECT * FROM trades ${placeholders}  ORDER BY date ASC `

    return new Promise((resolve, reject) => {
      console.log('start all')
      db.all(selectSql, ids, (err, row) => {
        console.log('end all select')
        if (err) return reject(err)
        resolve(row)
      })
    })
  }

  static async update(
    trades: tradeDataObject[],
    updateFields: [tradeDataKey, ...tradeDataKey[]] = [
      'date',
      'code',
      'tradeType',
      'holdType',
      'quantity',
      'price',
      'fee',
      'tax',
    ]
  ): Promise<void> {
    if (!trades.length) return

    const updateCaseClause = (field: tradeDataKey) => {
      return `${field} = CASE id ${trades
        .map((trade) => {
          return ` WHEN '${trade.id}' THEN ${typeof trade[field] === 'string' ? `'${trade[field]}'` : trade[field]}`
        })
        .join(' ')} END`
    }

    const placeholders = updateFields.map(updateCaseClause).join(',')
    const updateSql = `UPDATE trades SET ${placeholders} WHERE id IN (${trades.map(() => '?').join(',')})`

    const ids = trades.map((trade) => trade.id)

    await executeSQL(updateSql, ids)
  }

  static async delete(ids: [string, ...string[]]): Promise<void> {
    // プレースホルダーを配列の長さに合わせて生成
    const placeholders = ids.map(() => '?').join(',')
    const deleteSql = `DELETE FROM trades WHERE id IN (${placeholders})`
    await executeSQL(deleteSql, ids)
  }
}
