# redux-data-fetching

Automatic data managment with caching and auto merging of cached data and fetched one, based on GraphQL.

Install module
```shell
npm install --save redux-data-fetching
```
# Redux

## Reducer

Default reducer which handles data received from GraphQL, caches and merges it.

### Use
Add reducer to store config
```javascript
let reducer = combineReducers({data: require('redux-data-fetching/lib/graphql-data-reducer')});
```

Access data
```javascript
store.getState().reducer.yourresource
```
