import * as Crypto from 'expo-crypto';

export function buildClassItem({ title, tag, categoryId, locations }) {
  return {
    id: Crypto.randomUUID(),
    categoryId,
    name: title,
    tag,      
    locations,
  };
}
