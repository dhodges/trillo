
A simple hack to graph stats on Trello cards.

```
$ npm run updatedb       # to gather stats
$ npm run dumpjson       # to generate json data for the graph
```

Cards and simple stats about them can then be seen within `index.html`


![](trillo.png?raw=true "Trillo")

### Config

A handful of environment variables are expected to exist within `.env` in the root directory. See [here](https://developers.trello.com) to setup an API key and token

* TRELLO_API_KEY 
* TRELLO_API_TOKEN 
* TRELLO_BOARD_ID
* DB_USER
* DB_PASSWORD
* DB_HOST
* DB_PORT
* DB_NAME


### Trello API docs
* https://developers.trello.com
* https://developers.trello.com/advanced-reference
* https://trello.com/b/cI66RoQS/trello-public-api

### Trello nodejs libs
* https://trello.com/1/client.coffee
* https://www.npmjs.com/package/trello
* https://www.npmjs.com/package/trello-client
* https://www.npmjs.com/package/node-trello
* https://www.npmjs.com/package/trello-yello
