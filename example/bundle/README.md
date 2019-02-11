Bundle
===

```json
...
"scripts": {
  "start": "kkt start",
  "build": "kkt build",
  "bundle": "kkt build --bundle --no-emptyDir",
  "bundle:min": "kkt build --bundle=min --no-emptyDir",
  "test": "kkt test --env=jsdom",
  "test:coverage": "kkt test --env=jsdom --coverage"
},
...
```