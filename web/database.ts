type QueryResult = {rows: Array<Record<string, unknown>>};

let version = 0;

export const database = {
  async execute(sql: string): Promise<QueryResult> {
    if (sql.trim().toLowerCase() === 'pragma user_version;') {
      return {rows: [{user_version: version}]};
    }

    const match = sql.match(/pragma user_version\s*=\s*(\d+)/i);
    if (match) {
      version = Number(match[1]);
    }

    return {rows: []};
  },
};
