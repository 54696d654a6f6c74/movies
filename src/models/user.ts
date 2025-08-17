import type { Database } from 'sqlite';
import type sqlite3 from 'sqlite3'

export type User = {
  username: string;
  last_entered: number;
}

export class UserModel {
  constructor(private db: Database<sqlite3.Database, sqlite3.Statement>) {
  }

  async get(username: string): Promise<User | undefined> {
    const user: User | undefined = await this.db.get(`SELECT * FROM users WHERE username = "${username}"`);

    return user;
  }
}

