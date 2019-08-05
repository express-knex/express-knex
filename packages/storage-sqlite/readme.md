# Express Knex Server project, SQLite storage

Expected:
    
    app.env.KNEX_STORAGE_URL: full path to SQLite database file
    
Usage:

```javascript
    import knexStorage from 'express-knex-storage-sqlite'
    
        
    app.env.KNEX_STORAGE_URL = './data/db.sqlite'
    app.storage = knexStorage(app)
```     
