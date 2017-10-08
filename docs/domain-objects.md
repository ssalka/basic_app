# Domain Objects

* [User](#user)
* [Document](#document)
* [Collection](#collection)
* [Schema](#schema)
* [View](#view)
* [Field](#field)
* [Type](#type)
* [Library](#library)
* [Source](#source)
* [Import](#import)

---

# User
> A registered user of the site

- [x] Can register on site
- [ ] Must click confirmation link in email before being allowed to log in
- [x] Can log in to site via one of
  - [x] email
  - [ ] FB
  - [ ] Google
  - [ ] LinkedIn
- [ ] Can update password if logged in by email
- [ ] Can create at most 10 collections (500 docs each) unless admin or paying
- [ ] Can upgrade/downgrade plan
- [ ] Can deactivate/delete account

## Actions

#### `REGISTER_USER`: Submit the registration form
- [ ] upon success, sends the user a confirmation email and notifies them to check for it
- [ ] failure cases:
  - [ ] username/email taken
  - [ ] passwords don't match
  - [ ] invalid username/password

#### `COMPLETE_USER_REGISTRATION`: Complete the user sign-up process
- [ ] Gets triggered when a registration confirmation link (from email) is clicked
- [ ] upon success, trigger a CREATE_USER action

#### `CREATE_USER`: Store the details of a new user in the db
- [ ] upon success, creates a dummy collection (schemaless) for user to play around with

#### `AUTHENTICATE_USER`: Authenticate a user with given login credentials
- [ ] should keep track of which device is being used (eg by user-agent, or possibly some deviceId)
- [x] upon success, redirects to home page
  - [ ] go to original URL if initially redirected to login page
- [ ] upon failure, shows error message alongside/below login form
- [ ] if first time logging in, show some welcome/onboarding message(s)
- [ ] if user's account is disabled, re-enable it and send a "welcome back" email

#### `UPDATE_USER_PASSWORD`: Update a user's password
- [ ] Doesn't allow invalid passwords
- [ ] Checks that passwords match
- [ ] Checks that password is different from current password (check previous passwords?)

#### `LOGOUT_USER`: Log a user out of the site
- [ ] at time of logout, should be able to determine how long user was logged in
- [x] upon success, redirect to landing page

#### `DEACTIVATE_USER_ACCOUNT`: Disable a user's account
- [ ] should not cause any data to actually be deleted (user, collections, documents)
- [ ] should allow user to reactivate account by logging in again

#### `DELETE_ACCOUNT`: Permanently remove a user's account
- [ ] should delete all private data owned by user
- [ ] should preserve any public data created by the user
- [ ] user document should be preserved but marked as a deleted user

---

# Document
> A single piece of data, representing some domain object

- [x] Must exist within a collection
- [x] Must be a data structure (eg object or array), not a primitive
  - To describe a primitive, use a single field of the desired type, eg number = { value: 5 }

## Examples
- song
- book
- website
- customer
- product

## Actions

#### `CREATE_DOCUMENT`: Add a new document to a collection
- [ ] Can save partial documents (eg omitting required fields)
  - [ ] flag as incomplete
- [ ] If created without a collection, put into user's main store by default (schemaless)

## Actions

#### `UPDATE_DOCUMENT_NAME`: Update a document's name
- [ ] allowed to conflict with other documents of same name
  - [ ] provide some means of disambiguation (like Wikipedia)

#### `UPDATE_DOCUMENT_FIELD_NAME`: Update the name of a given field in a document
- [ ] Can only be done if document belongs to a schemaless collection
  - [ ] If collection is not schemaless, show a tooltip about migrating the collection field name
    - Pro feature?

#### `UPDATE_DOCUMENT_FIELD_VALUE`: Update the value of a given field in a document
- [ ] Should validate the field name
- [ ] for pro users, provide unique actions up to field name (eg `UPDATE_SONG_ARTIST`, `UPDATE_BOOKMARK_URL`)

#### `DELETE_DOCUMENT`: Remove a document from a collection
- [ ] Document is no longer visible from any other collections that compose parent collection
- how to handle case where document is used as an instance for a required field elsewhere?

---

# Collection
> Any collection of documents (more about semantic meaning of the data, eg Songs vs mp3s, or a list of bank transactions vs a sql table)

- [ ] Structured collections
  - [x] must have a schema
  - [x] every document in a structured collection must conform to the schema
  - [ ] distinguish implementation from mixed collections
- [ ] Mixed collections
  - [ ] can choose to some set of schemas (and thus collections that match those schemas), or allow documents from any collection
    - will need filtering module for matching schemas by pattern, or excluding certain schemas
  - [ ] documents in mixed collections can conform to any of the provided schemas (must be at least 1)
  - [ ] User should have 1 of these upon registering, as a quick way to introduce them to adding documents
  - [ ] collections being mixed in can be of any category (structured, mixed, schemaless)
- [ ] Schemaless collections
  - [ ] have no schema, but other options like validation and filtering should still be available
  - [ ] documents in schemaless collections can conform to any schema or no schema at all (but must be well-formed documents)

## Examples
- People (structured)
- Songs & Albums (mixed)
- pseudorandom JSON time series (schemaless)

## Questions
- How to resolve/merge duplicate collections? eg user1 creates public Obscure1, user2 creates public Obscure2, Obscure1.schema !== Obscure2.schema)
  - by default, have them both extend a common schema (if possible), but also provide an option to force a collection to be unique
  - could possibly provide built-in disambiguation, similar to Wikipedia
    - or, do branches and/or versions
  - if no common schema exists yet, flag both as candidates for possible extensions (or subsets) of a to-be collection
  - if many (how many?) collections arise w/ similar enough schemas, make a base collection for all to extend

## Actions

#### `CREATE_COLLECTION`: Create a new collection
- [x] Create with view
- [ ] don't create if user is at collection limit (25)

#### `UPDATE_COLLECTION_TITLE`: Update the title of a collection
- If creating new collection
  - [ ] try to choose a suitable icon automatically
  - [ ] display other collections of the same name
    - [ ] provide option to subscribe to collection or clone schema
    - [ ] don't display collections over the user's collection size limit (500)

#### `UPDATE_COLLECTION_DESCRIPTION`: Update the description of a collection
- Character limit: 1000 (?)

#### `UPDATE_COLLECTION_ICON`: Update the collection's icon

#### `UPDATE_COLLECTION_PRIVACY`: Update the public/private status of a collection
- what happens if making a public collection private, and documents in the collection are referred to by other collections?
  - see section below on required fields

#### `UPDATE_COLLECTION_MODEL`: Change a collection to structured, mixed, or schemaless
- Generally, can only move to looser model, eg a schemaless collection with many different document types cannot be converted to a structured collection
  - can only move to structured collection if all documents conform to same schema
    - you could try, if there are any common fields in the collection
    - another way would be to let the user write a mapper

#### `DELETE_COLLECTION`: Delete a collection
- [ ] Ask if other users who are using documents in the collection can make clones, so as to not break their views
  - If user declines
    - [ ] notify other users that the collection has been deleted
  - If user accepts
    - [ ] make new collection with duplicate schema
      - [ ] make open-source, i.e. collection has no owners (formalize this)
      - [ ] take only those documents already referenced
    - [ ] update other collections referring to it
- [ ] prevent access to collection, mark as archived

---

# Schema
> A list of field descriptors that is conformed to by one or more collections

- [ ] should resemble an interface

## Actions

#### `CREATE_SCHEMA_FIELD`: Add a new field to the schema
- [ ] defaults to `STRING`

#### `UPDATE_SCHEMA_FIELD_NAME`: Update the name of a field in the schema
- [ ] Ensure name unique within schema

#### `UPDATE_SCHEMA_FIELD_TYPE`: Update the type of a field in the schema
- [ ] Triggers collection migration
- Could be problematic if ever operations are done on fields, eg math on a string field that was just migrated from a number field

#### `UPDATE_SCHEMA_FIELD_IS_REQUIRED`: Update whether a field in the schema is required
- [ ] ~~Field cannot be required if it references a collection owned by another user~~
  - This is because views of the collection could become broken if the other user ever deleted the linked collection, or made it private
  - [ ] SOLUTION: Make collections resilient in the face of schema invalidation - make actual database schema fields completely optional, and always check for existence. if required and missing, mark as incomplete and show an empty placeholder in views
    - for process, see `DELETE_COLLECTION` above

#### `UPDATE_SCHEMA_FIELD_IS_ARRAY`: Update whether a field in the schema describes an array type
- [ ] If array -> not array, provide choice
  - [ ] take index (first, middle, last, n)
  - [ ] map reduce
- [ ] If not array -> array, simply `_.castArray`
  - [ ] if field is collection/object, provide option for mapping to one of its array fields (if any)

#### `UPDATE_SCHEMA_FIELD_VIEW`: Update the view of a field in the schema
- Value indicates default render method of a field

#### `DELETE_SCHEMA_FIELD`: Delete a field of the schema
- [ ] Follow same pattern for deletion as with collections

---

# View
> A visual representation of one or more documents

- [ ] provides overrides for field values (eg replacing an undesired render method with a more preferable component)

## Examples
- simple
  - Used for rendering a single document in a generic list
  - Fields
    - Primary
      - The name or title of the document
      - TODO: implement document names
    - Secondary
      - A secondary property of the document
      - Examples
        - The artist of a song
        - The last updated field of a note
- raw
- outline / markdown
- table
- custom rows
- graph
- freeform
- chart
- dashboard (panes, adjustable/collapsable/expandable)
  - special view, because it allows you to compose distinct views, eg have a table + chart view

## Questions
- Distinguish rendering one vs multiple? i.e. have separate domain objects for rendering documents and collections

## Actions

#### `CREATE_VIEW`: Create a new view

#### `UPDATE_VIEW_NAME`: Update the name of a view

#### `UPDATE_VIEW_TYPE`: Update the type of a view

#### `UPDATE_VIEW_DESCRIPTION`: Update the description of a view

#### `UPDATE_VIEW_PRIVACY`: Update the public/private status of a view

#### `ADD_COLLECTION_TO_VIEW`: Add a collection to a view

#### `REMOVE_COLLECTION_FROM_VIEW`: Remove a collection from a view

#### `DELETE_VIEW`: Delete a view
- [ ] Disallow if used as a default view for a collection (see `DELETE_COLLECTION`)

---

# Field
> A property of a document

## Examples
- title
- year
- creator
- friends

---

# Type
> A category of data structures, whether primitive or complex

## Examples
- String
- Number
- Date
- Image
- Website

## Questions
- Should complex built-in types (eg image, website) be modeled as collections?
- Should _all_ types be modeled as collections?
  - This would enable the storage of primitive instances, eg common strings ('hello world') or numbers (pi, golden ratio, 1000000, 42)
  - possibly an interesting feature, but not essential yet AFAICT

---

# Library
> The whole of a user's content - that which is created, imported, or subscribed to by the user

## Questions
- Does this include views, or just collections?

---

# Source
> A data source, either the app itself or somewhere from which data can be imported

## Examples
- file (upload from computer/phone)
- uri (eg raw data stored on the web, or a parsable webpage)
- integration (eg connect to google drive, or hook into airtable bases)

---

# Import
> A piece of data imported from another source

## Examples
- aws resource (sqs, rds, s3, ...)
- git repository
- sql
- csv
- json
- tabular
- text
- localStorage
