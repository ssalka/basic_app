# Domain Objects

---

## User
> A registered user of the site

- Can register on site
- Must click confirmation link in email before being allowed to log in
- Can log in to site via one of
  - email
  - FB
  - Google
  - Twitter
  - LinkedIn
- Can update password if logged in by email
- Can create at most 10 collections (500 docs each) unless admin or paying
- Can upgrade/downgrade plan
- Can deactivate/delete account

### Actions

#### `REGISTER_USER`
Submits the registration form

#### `COMPLETE_USER_REGISTRATION`
Completes the user sign-up process

#### `CREATE_USER`
Stores the details of a new user in the db

#### `AUTHENTICATE_USER`
Authenticates a user with given login credentials

#### `UPDATE_USER_PASSWORD`
Updates a user's password for authentication

#### `LOGOUT_USER`
Logs a user out of the site

#### `DEACTIVATE_USER_ACCOUNT`
Disables a user's account

#### `DELETE_ACCOUNT`
Permanently disables a user's account

---

## Document
> A single piece of data, representing some domain object

### Examples
- song
- book
- website
- customer
- product

### Actions

#### `CREATE_DOCUMENT`
Adds a new document to a collection

- Can save partial documents (eg omitting required fields)
  - flag as incomplete

### Actions

#### `UPDATE_DOCUMENT_NAME`
Updates a document's name

#### `UPDATE_DOCUMENT_FIELD_NAME`
Updates the name of a given field in a document

#### `UPDATE_DOCUMENT_FIELD_VALUE`
Updates the value of a given field in a document

#### `DELETE_DOCUMENT`
Removes a document from a collection

---

## Collection
> Any collection of documents (more about semantic meaning of the data, eg Songs vs mp3s, or a list of bank transactions vs a sql table)

- Structured collections
  - must have a schema
  - every document in a structured collection must conform to the schema
- Mixed collections
  - can choose to some set of schemas (and thus collections that match those schemas), or allow documents from any collection
    - will need filtering module for matching schemas by pattern, or excluding certain schemas
  - documents in mixed collections can conform to any of the provided schemas (must be at least 1)
  - User should have 1 of these upon registering, as a quick way to introduce them to adding documents
  - collections being mixed in can be of any category (structured, mixed, schemaless)
- Schemaless collections
  - have no schema, but other options like validation and filtering should still be available
  - documents in schemaless collections can conform to any schema or no schema at all (but must be well-formed documents)

### Examples
  - People (structured)
  - Songs & Albums (mixed)
  - pseudorandom JSON time series (schemaless)

### Questions
- How to resolve/merge duplicate collections? eg user1 creates public Obscure1, user2 creates public Obscure2, Obscure1.schema !== Obscure2.schema)
  - by default, have them both extend a common schema (if possible), but also provide an option to force a collection to be unique
  - could possibly provide built-in disambiguation, similar to Wikipedia
    - or, do branches and/or versions
  - if no common schema exists yet, flag both as candidates for possible extensions (or subsets) of a to-be collection
  - if many (how many?) collections arise w/ similar enough schemas, make a base collection for all to extend

### Actions

#### `CREATE_COLLECTION`
Creates a new collection

#### `UPDATE_COLLECTION_TITLE`
Updates the title of a collection

#### `UPDATE_COLLECTION_DESCRIPTION`
Updates the description of a collection

#### `UPDATE_COLLECTION_ICON`
Updates the collection's icon

#### `UPDATE_COLLECTION_PRIVACY`
Updates the public/private status of a collection

#### `UPDATE_COLLECTION_MODEL`
Changes a collection to structured, mixed, or schemaless

#### `DELETE_COLLECTION`
Deletes a collection

---

## Schema
> A list of field descriptors that is conformed to by one or more collections

- should resemble an interface

### Actions

#### `CREATE_SCHEMA_FIELD`
Adds a new field to the schema

#### `UPDATE_SCHEMA_FIELD_NAME`
Updates the name of a field in the schema

#### `UPDATE_SCHEMA_FIELD_TYPE`
Updates the type of a field in the schema

#### `UPDATE_SCHEMA_FIELD_IS_REQUIRED`
Updates whether a field in the schema is required

#### `UPDATE_SCHEMA_FIELD_IS_ARRAY`
Updates whether a field in the schema describes an array type

#### `UPDATE_SCHEMA_FIELD_VIEW`
Updates the view of a field in the schema

#### `DELETE_SCHEMA_FIELD`
Deletes a field of the schema

---

## View
> A visual representation of one or more documents

### Examples
- raw
- outline / markdown
- table
- custom rows
- graph
- freeform
- chart
- dashboard (panes, adjustable/collapsable/expandable)
  - special view, because it allows you to compose distinct views, eg have a table + chart view

### Questions
- Distinguish rendering one vs multiple? i.e. have separate domain objects for rendering documents and collections

### Actions

#### `CREATE_VIEW`
Creates a new view

#### `UPDATE_VIEW_NAME`
Updates the name of a view

#### `UPDATE_VIEW_TYPE`
Updates the type of a view

#### `UPDATE_VIEW_DESCRIPTION`
Updates the description of a view

#### `UPDATE_VIEW_PRIVACY`
Updates the public/private status of a view

#### `ADD_COLLECTION_TO_VIEW`
Adds a collection to a view

#### `REMOVE_COLLECTION_FROM_VIEW`
Removes a collection from a view

---

## Field
> A property of a document

### Examples
- title
- year
- creator
- friends

---

## Type
> A category of data structures, whether primitive or complex

### Examples
- String
- Number
- Date
- Image
- Website

### Questions
- Should complex built-in types (eg image, website) be modeled as collections?
- Should _all_ types be modeled as collections?
  - This would enable the storage of primitive instances, eg common strings ('hello world') or numbers (pi, golden ratio, 1000000, 42)
  - possibly an interesting feature, but not essential yet AFAICT

---

## Library
> The whole of a user's content - that which is created, imported, or subscribed to by the user

### Questions
- Does this include views, or just collections?

---

## Source
> A data source, either the app itself or somewhere from which data can be imported

### Examples
- file (upload from computer/phone)
- uri (eg raw data stored on the web, or a parsable webpage)
- integration (eg connect to google drive, or hook into airtable bases)

---

## Import
> A piece of data imported from another source

### Examples
- aws resource (sqs, rds, s3, ...)
- git repository
- sql
- csv
- json
- tabular
- text
- localStorage
