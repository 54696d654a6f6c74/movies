import type { Database } from 'sqlite';
import type sqlite3 from 'sqlite3'
import z from 'zod';

export type Vote = {
  id: string;
  username: string;
  movie_id: string;
}

export const VoteSchema = z.object({
  id: z.string(),
  username: z.string(),
  movie_id: z.string()
})

export class VoteModel {
  constructor(private db: Database<sqlite3.Database, sqlite3.Statement>) {
  }

  async getForMovie(movieId: string): Promise<Vote[] | undefined> {
    try {
      const votes: Vote[] = await this.db.all(`SELECT * FROM votes WHERE movie_id = "${movieId}"`);

      return votes;
    } catch (e) {
      console.error(e);
      return []
    }
  }

  async addVote(vote: Vote) {
    try {
      const fieldNames = Object.keys(vote);
      const fieldValues = Object.values(vote);

      await this.db.exec(`INSERT INTO votes ("${fieldNames.join("\", \"")}\") VALUES ("${fieldValues.join("\", \"")}\")`)

      return vote;
    } catch (e) {
      console.error(e)
    }

    return;
  }

  async removeVoteForUser(userId: string, movieId: string) {
    try {
      await this.db.exec(`DELETE FROM votes WHERE username = "${userId}" AND movie_id = "${movieId}"`)
    } catch (e) {
      console.error(e)
    }

    return;
  }
}

