import { db } from './schema';

function updateTimestamp(rowId, newTimestamp) {
  return new Promise((resolve, reject) => {
    const query = `UPDATE report SET lastRun = ${newTimestamp} WHERE id = ${rowId}`;
    db.run(query, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

export { updateTimestamp }