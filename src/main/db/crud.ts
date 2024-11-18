/**
 *
 */
import { TradeDBError } from 'types/TradeError'

import { isNewTradeType, turnedTradeType } from './dbHooks'
import { db } from './initializeDatabase'

const executeSelectQuery = (
  sql: string,
  params: any[] = []
): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err.message)
      resolve(rows)
    })
  })
}

const executeNonQuery = (sql: string, params: any[] = []): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) return reject(err.message)
      resolve()
    })
  })
}

const _insert = async (trades: TradeRecordDB[]): Promise<void> => {
  const insertSql = `INSERT INTO trades VALUES ${trades.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(',')}`
  const insertData = trades.flatMap((trade) => [
    trade.id,
    trade.date,
    trade.symbol,
    trade.trade_type,
    trade.hold_type,
    trade.quantity,
    trade.quantity,
    trade.price,
    trade.fee,
    trade.tax,
  ])

  await executeNonQuery(insertSql, insertData)
}

export class CRUD {
  static async insert(trades: TradeRecordDB[]): Promise<any> {
    try {
      await executeNonQuery('BEGIN TRANSACTION')

      //
      const newTrades = trades.filter((data) => isNewTradeType(data.trade_type))
      if (newTrades.length) await _insert(newTrades)

      //
      const repayTrades = trades
        .filter((data) => !isNewTradeType(data.trade_type))
        .sort((trade1, trade2) => trade1.date - trade2.date)

      if (!repayTrades.length) return executeNonQuery('COMMIT')

      const newTradeSql = `
        SELECT * FROM trades 
        WHERE date <= ? AND symbol = ? AND trade_type = ? AND rest_quantity > 0 
        ORDER BY date ASC
      `

      for (const repayTrade of repayTrades) {
        const rows: TradeRecordDB[] = await executeSelectQuery(newTradeSql, [
          repayTrade.date,
          repayTrade.symbol,
          turnedTradeType(repayTrade.trade_type),
        ])

        if (repayTrade.symbol == '7013') {
          console.log(repayTrade)
          console.log(rows)
        }

        let repayQuant = repayTrade.quantity
        const tradesToUpdate: TradeRecordDB[] = []
        const linksParams: (string | number)[] = []

        for (const row of rows) {
          if (repayQuant === 0) break

          let rowRestQuantity = row.rest_quantity

          if (rowRestQuantity >= repayQuant) {
            rowRestQuantity -= repayQuant
            repayQuant = 0
          } else {
            repayQuant -= rowRestQuantity
            rowRestQuantity = 0
          }

          tradesToUpdate.push({
            ...row,
            rest_quantity: rowRestQuantity,
          })

          linksParams.push(
            row.id,
            repayTrade.id,
            row.rest_quantity - rowRestQuantity
          )
        }

        if (repayQuant) {
          console.log(rows)
          throw new TradeDBError(repayTrade.id, '取引数量が合っていません')
        }

        await CRUD.update(tradesToUpdate, ['rest_quantity'])

        // trade_links
        const insertLinksSql = `INSERT INTO trade_links (new_trade_id, repay_trade_id, trade_quantity) VALUES ${tradesToUpdate.map(() => '(?,?,?)').join(',')}`

        executeNonQuery(insertLinksSql, linksParams)

        await _insert([repayTrade])
      }
      await executeNonQuery('COMMIT')
    } catch (err) {
      await executeNonQuery('ROLLBACK')
      if (err instanceof TradeDBError) return { failId: err.failId }
      throw err
    }
  }

  /**
   *
   * @param options
   * @returns
   */
  static async select(options: SelectFilterOptions): Promise<any[]> {
    let sql = ''
    const params: any[] = []

    if (options.mode == 'raw') {
      sql = `SELECT 
      t.id, t.date, t.symbol, bp.company, t.trade_type, t.hold_type, t.quantity, t.rest_quantity, t.price, t.fee, t.tax, mp.place, mp.place_y_f, mp.market, bt.id as business_type_code, bt.type as business_type_name
      FROM trades AS t `
    } else {
      sql = `SELECT 
      t.id, t.date, nt.date as date0, t.symbol, bp.company, t.trade_type, tl.trade_quantity as quantity, 
      t.fee, t.tax, mp.place, mp.place_y_f, mp.market, bt.id as business_type_code, bt.type as business_type_name, t.price as repayTradePrice, nt.price as newTradePrice
      FROM (select * from trades WHERE trade_type IN (?, ?, ?)) as t
      LEFT JOIN trade_links AS tl ON t.id = tl.repay_trade_id
      LEFT JOIN trades AS nt ON tl.new_trade_id = nt.id `
      params.push('現物売', '信用返済買', '信用返済売')
    }

    sql += ` LEFT JOIN brand_profiles AS bp ON t.symbol = bp.id
    LEFT JOIN market_places AS mp ON bp.market_id = mp.id
    LEFT JOIN business_type_33 AS bt ON bp.business_id = bt.id
    WHERE 1=1 ` // 1=1について https://qiita.com/seiya2130/items/a34f5492592b103e2545

    if (options.id) {
      if (options.mode == 'raw') {
        sql += ` AND (t.id = ? OR
          t.id IN (SELECT tl.new_trade_id FROM trade_links AS tl WHERE tl.repay_trade_id = ?) OR 
          t.id IN (SELECT tl.repay_trade_id FROM trade_links AS tl WHERE tl.new_trade_id = ?))`
        params.push(options.id, options.id, options.id)
      } else {
        sql += ` AND t.id = ?`
        params.push(options.id)
      }
    } else {
      if (options.filter?.period1) {
        sql += ` AND t.date >= ?`
        params.push(options.filter?.period1)
      }
      if (options.filter?.period2) {
        sql += ` AND t.date <= ?`
        params.push(options.filter?.period2)
      }

      if (options.filter?.symbol) {
        sql += ` AND t.symbol = ?`
        params.push(options.filter?.symbol)
      }

      if (options.filter?.tradeType) {
        sql += ` AND t.trade_type = ?`
        params.push(options.filter?.tradeType)
      }

      if (options.filter?.holdType) {
        sql += ` AND t.hold_type = ?`
        params.push(options.filter?.holdType)
      }

      if (options.filter?.price) {
        if (options.filter?.price.Lowest) {
          sql += ` AND t.price >= ?`
          params.push(options.filter?.price.Lowest)
        }
        if (options.filter?.price.Highest) {
          sql += ` AND t.price <= ?`
          params.push(options.filter?.price.Highest)
        }
      }

      if (options.filter?.place) {
        sql += ` AND mp.place = ?`
        params.push(options.filter?.place)
      }

      if (options.filter?.businessCode) {
        sql += ` AND bp.business_id = ?`
        params.push(options.filter?.businessCode)
      }
    }

    sql += ` ORDER BY t.date ${options.order ? options.order : 'ASC'} ${options.limit ? `LIMIT ${options.limit}` : ''}`

    return await executeSelectQuery(sql, params)
  }

  static async update(
    trades: TradeRecordDB[],
    updateFields: [trade_data_key, ...trade_data_key[]] = [
      'date',
      'symbol',
      'trade_type',
      'hold_type',
      'quantity',
      'rest_quantity',
      'price',
      'fee',
      'tax',
    ]
  ): Promise<void> {
    if (!trades.length) return

    const params: any[] = []

    const updateCaseClause = (field: trade_data_key) => {
      return `${field} = CASE id ${trades
        .map((trade) => {
          params.push(trade.id, trade[field])
          return ` WHEN ? THEN ? `
        })
        .join(' ')} END`
    }

    const placeholders = updateFields.map(updateCaseClause).join(',')
    const updateSql = `UPDATE trades SET ${placeholders} WHERE id IN (${trades.map(() => '?').join(',')})`

    params.push(...trades.map((trade) => trade.id))

    await executeNonQuery(updateSql, params)
  }

  static async delete(ids: string[]): Promise<void> {
    const placeholders = ids.map(() => '?').join(',')
    const deleteSql = `DELETE FROM trades WHERE id IN (${placeholders})`
    await executeNonQuery(deleteSql, ids)
  }
}
