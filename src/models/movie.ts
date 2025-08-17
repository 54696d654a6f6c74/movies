import type { Database } from 'sqlite';
import type sqlite3 from 'sqlite3'
import z from 'zod';

export type Movie = {
  id: string;
  title: string;
  image_url: string;
  suggested_by_username: string;
  suggestion_timestamp: number;
  votes: number;
}

export const MovieSchema = z.object({
  id: z.string(),
  title: z.string(),
  image_url: z.string(),
  suggested_by_username: z.string(),
  suggestion_timestamp: z.number(),
  votes: z.number()
})

export class MovieModel {
  constructor(private db: Database<sqlite3.Database, sqlite3.Statement>) {
  }

  async getAll(): Promise<Movie[] | undefined> {
    const movies: Movie[] | undefined = await this.db.all(`SELECT * FROM movies ORDER BY votes DESC`);

    return movies;
  }

  async get(id: string): Promise<Movie | undefined> {
    const movie: Movie | undefined = await this.db.get(`SELECT * FROM movies WHERE id = "${id}"`);

    return movie;
  }

  async add(movie: Movie): Promise<Movie> {
    const fieldNames = Object.keys(movie);
    const fieldValues = Object.values(movie);

    const action = `INSERT INTO movies ("${fieldNames.join("\", \"")}\") VALUES ("${fieldValues.join("\", \"")}\")`;

    await this.db.exec(action)

    return movie;
  }
}


