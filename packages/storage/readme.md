## Express Knex Storage

This is a generic knex-based storage for storing models in any KNEX-compatible database.

This package can not be used directly. Please use packages like express-knex-storage-sqlite    

  * **storageInit**: open database
  * **storageClose**: close database
  * **storageSchemaInit**: create a persistent scheme in storage to accept model entities
  * **storageSchemaClear**: remove schema from storage completely including data
  * **storageDataInit**: seed some dataset into storage, if no name - seed system data (if any)
  * **storageDataClear**: make storage empty and remove all model's entites from storage
  * **storageRefsInit**: add storage reference integrity checks and indexes
  * **storageRefsClear**: remove any reference integrity checks and indexes from storage
