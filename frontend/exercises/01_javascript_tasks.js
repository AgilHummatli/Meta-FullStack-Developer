// ============================================================
// META FRONT-END — JavaScript Tasks
// Course: Programming with JavaScript
// 25 tasks covering: ES6+, DOM, Arrays, OOP, Async
// ============================================================

// ── TASK 01 ─────────────────────────────────────────────────
// Reverse a string without using .reverse()
function reverseString(str) {
  return str.split("").reduce((acc, char) => char + acc, "");
}
console.log(reverseString("hello")); // "olleh"


// ── TASK 02 ─────────────────────────────────────────────────
// Count how many times each word appears in a sentence
function wordCount(sentence) {
  return sentence.split(" ").reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});
}
console.log(wordCount("the cat sat on the mat the cat")); 
// { the: 3, cat: 2, sat: 1, on: 1, mat: 1 }


// ── TASK 03 ─────────────────────────────────────────────────
// Flatten a nested array (any depth) without .flat()
function flattenArray(arr) {
  return arr.reduce((acc, item) =>
    Array.isArray(item) ? acc.concat(flattenArray(item)) : [...acc, item], []);
}
console.log(flattenArray([1, [2, [3, [4]], 5]])); // [1, 2, 3, 4, 5]


// ── TASK 04 ─────────────────────────────────────────────────
// Debounce function — only call fn after ms have passed since last call
function debounce(fn, ms) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}
const log = debounce((msg) => console.log(msg), 300);
log("typing..."); log("still typing..."); log("done"); // only "done" fires


// ── TASK 05 ─────────────────────────────────────────────────
// Implement a simple event emitter (on, emit, off)
class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(event, listener) {
    (this.events[event] ||= []).push(listener);
    return this;
  }
  emit(event, ...args) {
    (this.events[event] || []).forEach(fn => fn(...args));
  }
  off(event, listener) {
    this.events[event] = (this.events[event] || []).filter(fn => fn !== listener);
  }
}
const emitter = new EventEmitter();
emitter.on("greet", name => console.log(`Hello, ${name}!`));
emitter.emit("greet", "Agil"); // "Hello, Agil!"


// ── TASK 06 ─────────────────────────────────────────────────
// Deep clone an object without JSON.parse/stringify
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, deepClone(v)]));
}
const original = { a: 1, b: { c: [2, 3] } };
const clone = deepClone(original);
clone.b.c.push(99);
console.log(original.b.c); // [2, 3] — not affected


// ── TASK 07 ─────────────────────────────────────────────────
// Group an array of objects by a given key
function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const group = item[key];
    (acc[group] ||= []).push(item);
    return acc;
  }, {});
}
const people = [
  { name: "Alice", dept: "Engineering" },
  { name: "Bob", dept: "Marketing" },
  { name: "Carol", dept: "Engineering" },
];
console.log(groupBy(people, "dept"));


// ── TASK 08 ─────────────────────────────────────────────────
// Curry a function of any arity
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
}
const add = curry((a, b, c) => a + b + c);
console.log(add(1)(2)(3)); // 6
console.log(add(1, 2)(3)); // 6


// ── TASK 09 ─────────────────────────────────────────────────
// Memoize a function (cache results by arguments)
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
const slowSquare = memoize(n => { console.log("computing..."); return n * n; });
slowSquare(4); // computing... 16
slowSquare(4); // 16 (from cache, no log)


// ── TASK 10 ─────────────────────────────────────────────────
// Promise chain — fetch user, then their posts, then first post's comments
// (simulated with resolved promises)
const fakeAPI = {
  getUser: id => Promise.resolve({ id, name: "Agil" }),
  getPosts: userId => Promise.resolve([{ id: 1, title: "My Post", userId }]),
  getComments: postId => Promise.resolve([{ id: 1, text: "Great!", postId }]),
};

fakeAPI.getUser(1)
  .then(user => fakeAPI.getPosts(user.id))
  .then(posts => fakeAPI.getComments(posts[0].id))
  .then(comments => console.log(comments));


// ── TASK 11 ─────────────────────────────────────────────────
// Async/await version of the same chain + error handling
async function fetchUserComments(userId) {
  try {
    const user = await fakeAPI.getUser(userId);
    const posts = await fakeAPI.getPosts(user.id);
    const comments = await fakeAPI.getComments(posts[0].id);
    return comments;
  } catch (err) {
    console.error("Failed:", err.message);
  }
}
fetchUserComments(1).then(console.log);


// ── TASK 12 ─────────────────────────────────────────────────
// Implement Promise.all from scratch
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    promises.forEach((p, i) => {
      Promise.resolve(p).then(val => {
        results[i] = val;
        if (++completed === promises.length) resolve(results);
      }).catch(reject);
    });
  });
}
promiseAll([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)])
  .then(console.log); // [1, 2, 3]


// ── TASK 13 ─────────────────────────────────────────────────
// OOP: Bank account with deposit, withdraw, and transaction history
class BankAccount {
  #balance;
  #history;

  constructor(initialBalance = 0) {
    this.#balance = initialBalance;
    this.#history = [];
  }
  deposit(amount) {
    this.#balance += amount;
    this.#history.push({ type: "deposit", amount, balance: this.#balance });
  }
  withdraw(amount) {
    if (amount > this.#balance) throw new Error("Insufficient funds");
    this.#balance -= amount;
    this.#history.push({ type: "withdrawal", amount, balance: this.#balance });
  }
  get balance() { return this.#balance; }
  get history() { return [...this.#history]; }
}
const acc = new BankAccount(100);
acc.deposit(50);
acc.withdraw(30);
console.log(acc.balance); // 120
console.log(acc.history);


// ── TASK 14 ─────────────────────────────────────────────────
// Iterator protocol — make a Range object iterable
class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    return {
      next() {
        return current <= end
          ? { value: current++, done: false }
          : { done: true };
      }
    };
  }
}
console.log([...new Range(1, 5)]); // [1, 2, 3, 4, 5]


// ── TASK 15 ─────────────────────────────────────────────────
// Observer pattern — notify subscribers when state changes
class Store {
  #state;
  #subscribers = [];

  constructor(initialState) {
    this.#state = initialState;
  }
  getState() { return this.#state; }
  setState(newState) {
    this.#state = { ...this.#state, ...newState };
    this.#subscribers.forEach(fn => fn(this.#state));
  }
  subscribe(fn) {
    this.#subscribers.push(fn);
    return () => this.#subscribers = this.#subscribers.filter(s => s !== fn);
  }
}
const store = new Store({ count: 0 });
const unsub = store.subscribe(state => console.log("State:", state));
store.setState({ count: 1 }); // State: { count: 1 }
store.setState({ count: 2 }); // State: { count: 2 }
unsub();
store.setState({ count: 3 }); // no log


// ── TASK 16 ─────────────────────────────────────────────────
// DOM: Build a dynamic todo list (runs in browser)
function initTodoApp(containerId) {
  const container = document.getElementById(containerId);
  let todos = [];

  function render() {
    container.innerHTML = `
      <input id="todo-input" placeholder="New task..." />
      <button id="add-btn">Add</button>
      <ul>
        ${todos.map((t, i) => `
          <li style="text-decoration:${t.done ? "line-through" : "none"}">
            <span onclick="toggleTodo(${i})">${t.text}</span>
            <button onclick="removeTodo(${i})">✕</button>
          </li>`).join("")}
      </ul>`;
  }

  window.toggleTodo = i => { todos[i].done = !todos[i].done; render(); };
  window.removeTodo = i => { todos.splice(i, 1); render(); };

  document.addEventListener("click", e => {
    if (e.target.id === "add-btn") {
      const input = document.getElementById("todo-input");
      if (input.value.trim()) {
        todos.push({ text: input.value.trim(), done: false });
        render();
      }
    }
  });
  render();
}


// ── TASK 17 ─────────────────────────────────────────────────
// Generator — infinite Fibonacci sequence
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}
const fib = fibonacci();
const first10 = Array.from({ length: 10 }, () => fib.next().value);
console.log(first10); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]


// ── TASK 18 ─────────────────────────────────────────────────
// Proxy — validate object property assignments
function createValidatedUser(schema) {
  return new Proxy({}, {
    set(target, prop, value) {
      const validator = schema[prop];
      if (validator && !validator(value)) {
        throw new TypeError(`Invalid value for ${prop}: ${value}`);
      }
      target[prop] = value;
      return true;
    }
  });
}
const user = createValidatedUser({
  age: v => typeof v === "number" && v >= 0,
  email: v => typeof v === "string" && v.includes("@"),
});
user.age = 25;     // OK
user.email = "a@b.com"; // OK
// user.age = -1;  // throws TypeError


// ── TASK 19 ─────────────────────────────────────────────────
// Pipe — compose functions left to right
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

const processPrice = pipe(
  price => price * 1.18,         // add tax
  price => Math.round(price),    // round
  price => `$${price}`           // format
);
console.log(processPrice(100)); // "$118"


// ── TASK 20 ─────────────────────────────────────────────────
// WeakMap-based private data (pre-private fields pattern)
const _private = new WeakMap();

class Person {
  constructor(name, age) {
    _private.set(this, { name, age });
  }
  greet() {
    const { name, age } = _private.get(this);
    return `Hi, I'm ${name} and I'm ${age} years old.`;
  }
}
const p = new Person("Agil", 25);
console.log(p.greet());


// ── TASK 21 ─────────────────────────────────────────────────
// Throttle — only allow fn to run once per ms interval
function throttle(fn, ms) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= ms) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}


// ── TASK 22 ─────────────────────────────────────────────────
// Tagged template literal — highlight numbers in a string
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const val = values[i - 1];
    return result + (typeof val === "number" ? `[${val}]` : val ?? "") + str;
  });
}
const qty = 3, price = 9.99;
console.log(highlight`You ordered ${qty} items at $${price} each.`);
// "You ordered [3] items at $[9.99] each."


// ── TASK 23 ─────────────────────────────────────────────────
// Implement a simple LRU Cache
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }
  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.capacity)
      this.cache.delete(this.cache.keys().next().value);
    this.cache.set(key, value);
  }
}
const lru = new LRUCache(2);
lru.put(1, 1); lru.put(2, 2);
console.log(lru.get(1)); // 1
lru.put(3, 3);           // evicts key 2
console.log(lru.get(2)); // -1


// ── TASK 24 ─────────────────────────────────────────────────
// Implement Array.prototype.map, filter, reduce from scratch
Array.prototype.myMap = function (fn) {
  const result = [];
  for (let i = 0; i < this.length; i++) result.push(fn(this[i], i, this));
  return result;
};
Array.prototype.myFilter = function (fn) {
  const result = [];
  for (let i = 0; i < this.length; i++) if (fn(this[i], i, this)) result.push(this[i]);
  return result;
};
Array.prototype.myReduce = function (fn, initial) {
  let acc = initial !== undefined ? initial : this[0];
  for (let i = initial !== undefined ? 0 : 1; i < this.length; i++)
    acc = fn(acc, this[i], i, this);
  return acc;
};
console.log([1,2,3].myMap(x => x * 2));       // [2, 4, 6]
console.log([1,2,3,4].myFilter(x => x % 2));  // [1, 3]
console.log([1,2,3,4].myReduce((a,b) => a+b)); // 10


// ── TASK 25 ─────────────────────────────────────────────────
// Regex: validate and parse a date string "DD/MM/YYYY"
function parseDate(str) {
  const match = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) throw new Error(`Invalid date format: ${str}`);
  const [, day, month, year] = match.map(Number);
  const date = new Date(year, month - 1, day);
  if (isNaN(date)) throw new Error("Invalid date");
  return { day, month, year, date };
}
console.log(parseDate("09/03/2026")); // { day: 9, month: 3, year: 2026, ... }
