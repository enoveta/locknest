import { open } from '@op-engineering/op-sqlite';

export const database = open({
  name: 'locknest.db',
});