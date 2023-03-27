# store

[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=flexbase-eng_store&metric=coverage)](https://sonarcloud.io/summary/new_code?id=flexbase-eng_store)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=flexbase-eng_store&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=flexbase-eng_store)

## Installation

```
npm install @flexbase/store
```

or

```
yarn add @flexbase/store
```

## Concepts

The concept behind the store is to separate state management from other application concerns. It is `Promise` based utilizing an [Observer](https://en.wikipedia.org/wiki/Observer_pattern) pattern.

## Usage

Example data

```ts
interface SomeData {
  name: string;
  id: number;
}
```

### Create a store

```ts
const someDataStore = createStore<SomeData>();

const someOtherStore = createStore<number>();
```

#### Create Store Options

```ts
// object style
const someDataStore = createStore<SomeData>({
        key?: symbol, // use the specified key to represent this store; otherwise Symbol() is used
        defaultValue?: <SomeData>, // use the specified value as the default value
        comparer?: StoreComparer<SomeData>, // use the specified comparer; otherwise defaultStoreComparer is used
        middleware?: StoreMiddleware<SomeData>[], // use the specified middleware(s)
        persistanceProvider?: PersistanceProvider<SomeData>, // use the specified persistance provider
        storageManager: StorageManager // use the specified storage manager; otherwise use the global manager
});

// fluent style
const someDataStore = createStore<SomeData>(options => {
    options
        .key(key: symbol | string) // use the specified key to represent this store; otherwise Symbol() is used
        .defaultValue(value: <SomeData>) // use the specified value as the default value
        .comparer(comparer: StoreComparer<SomeData>) // use the specified comparer; otherwise defaultStoreComparer is used
        .middleware(...middleware: StoreMiddleware<SomeData>[]) // use the specified middleware(s)
        .persistanceProvider(persistanceProvider: PersistanceProvider<SomeData>) // use the specified persistance provider
        .storageManager(storageManager: StorageManager) // use the specified storage manager; otherwise use the global manager
});
```

### Get store value

```ts
const value = getStoreValue(someDataStore);
```

### Set store value

```ts
await setStoreValue(someDataStore, { name: 'Test', id: 1 });

await setStoreValue(someOtherStore, 42);
```

#### Using a callback

```ts
await setStoreValue(someDataStore, _ => {name: 'Test', id: 1});

await setStoreValue(someOtherStore, _ => 42);

// do more in the callback
await setStoreValue(test, currentValue => (currentValue ? Math.min(42, currentValue) : 0));
```

### Reset store value

```ts
let value: number;

const numberStore = createStore<number>({ defaultValue: 42 });

value = storageManager.getValue(numberStore); // value is 42

await storageManager.setValue(numberStore, 1);

value = storageManager.getValue(numberStore); // value is 1

await resetStoreValue(numberStore);

value = storageManager.getValue(numberStore); // value is 42
```

### Get store setter

```ts
const setter = getStoreSetter(someDataStore);

await setter({ name: 'Test', id: 1 });

await setter(_ => {name: 'Test', id: 1});

```

### Subscribe

```ts
const subscription = subscribeToStore(someDataStore, context => {...});

subscription.unsubscribe();
```

## Persistance

TODO

## Middleware

TODO
