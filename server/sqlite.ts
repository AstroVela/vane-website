import {DatabaseSync, type SQLInputValue} from 'node:sqlite'
import {readFileSync,mkdirSync,chmodSync} from 'node:fs'
import {dirname} from 'node:path'
import type {DemoDatabase,DatabaseStatement} from './types.ts'

/** The same SQLite implementation is used by the site and acceptance tests. */
export class SQLiteDemoDatabase implements DemoDatabase {
  readonly connection:DatabaseSync
  constructor(filename:string) {
    if(filename!==':memory:')mkdirSync(dirname(filename),{recursive:true,mode:0o700})
    this.connection=new DatabaseSync(filename)
    if(filename!==':memory:')chmodSync(filename,0o600)
    this.connection.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; PRAGMA foreign_keys=ON;')
    this.connection.exec(readFileSync(new URL('./schema.sql',import.meta.url),'utf8'))
  }
  prepare(sql:string):DatabaseStatement {
    const statement=this.connection.prepare(sql)
    let parameters:SQLInputValue[]=[]
    const query:DatabaseStatement={
      bind(...values:unknown[]) {parameters=values as SQLInputValue[];return query},
      async first<T>() {return (statement.get(...parameters) as T|undefined)??null},
      async all<T>() {return {success:true,results:statement.all(...parameters) as T[],meta:{}}},
      async run() {const result=statement.run(...parameters);return {success:true,results:[],meta:{changes:Number(result.changes)}}},
    }
    return query
  }
  close() {this.connection.close()}
}
