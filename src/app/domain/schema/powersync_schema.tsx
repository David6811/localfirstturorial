import { column, Schema, Table } from '@powersync/web';
// OR: import { column, Schema, Table } from '@powersync/react-native';

const users = new Table(
  {
    // id column (text) is automatically included
    _id: column.text,
    email: column.text,
    name: column.text,
    password: column.text
  },
  { indexes: {} }
);

const notes = new Table(
  {
    // id column (text) is automatically included
    _id: column.text,
    content: column.text,
    createdAt: column.text,
    user_id: column.text
  },
  { indexes: {} }
);

export const AppSchema = new Schema({
  users,
  notes
});

export type Database = (typeof AppSchema)['types'];
