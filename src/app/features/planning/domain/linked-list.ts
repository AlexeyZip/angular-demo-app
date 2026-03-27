interface LinkedListNode<T> {
  value: T;
  next: LinkedListNode<T> | null;
}

export class LinkedList<T> {
  private head: LinkedListNode<T> | null = null;
  private tail: LinkedListNode<T> | null = null;
  private length = 0;

  append(value: T): void {
    const node: LinkedListNode<T> = { value, next: null };
    if (!this.head) {
      this.head = node;
      this.tail = node;
      this.length = 1;
      return;
    }
    this.tail!.next = node;
    this.tail = node;
    this.length += 1;
  }

  size(): number {
    return this.length;
  }

  toArray(): T[] {
    const values: T[] = [];
    let cursor = this.head;
    while (cursor) {
      values.push(cursor.value);
      cursor = cursor.next;
    }
    return values;
  }
}
