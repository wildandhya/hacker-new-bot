export const kv = await Deno.openKv();

export async function create<T extends { id: string }>(
  keyPrefix: string,
  key: string,
  item: T,
  expireIn: number
): Promise<void> {
  await kv.set([keyPrefix, key], item, { expireIn: expireIn });
}

export async function read<T>(
  keyPrefix: string,
  id: string,
): Promise<T | null> {
  const res = await kv.get<T>([keyPrefix, id]);
  return res.value ?? null;
}

export async function update<T extends { id: string }>(
  keyPrefix: string,
  item: T,
): Promise<void> {
  await kv.set([keyPrefix, item.id], item);
}

export async function remove(keyPrefix: string, id: string): Promise<void> {
  await kv.delete([keyPrefix, id]);
}

export async function list<T>(keyPrefix: string): Promise<T[]> {
  const items: T[] = [];
  for await (const entry of kv.list<T>({ prefix: [keyPrefix] })) {
    items.push(entry.value);
  }
  return items;
}
