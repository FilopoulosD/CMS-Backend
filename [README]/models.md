# CMS Models Documentation

> Personal reference for models, field definitions, and API request bodies.

---

## Table of Contents

1. [Domain](#domain)
2. [User](#user)
3. [Template](#template)
4. [Page](#page)
5. [Field Types Reference](#field-types-reference)

---

## Domain

Represents a site hosted on the CMS. Supports multisite via `parentDomain` for subdomains or child sites.

### Schema Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `host` | String | Yes | Unique, lowercase. e.g. `mysite.com` |
| `parentDomain` | ObjectId (Domain) | No | Ref to parent domain for multisite |
| `createdAt` | Date | Auto | Mongoose timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp |

### POST /domains — Create Domain

**Standalone site:**
```json
{
  "host": "mysite.com"
}
```

**Child site (multisite):**
```json
{
  "host": "blog.mysite.com",
  "parentDomain": "64f1a2b3c4d5e6f7a8b9c0d1"
}
```

---

## User

Represents an authenticated user of the CMS. Role controls access to admin/editor features.

### Schema Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | String | Yes | Display name |
| `email` | String | Yes | Unique, lowercase |
| `password` | String | Yes | Stored hashed |
| `role` | String | No | `"user"` (default) or `"admin"` |
| `createdAt` | Date | Auto | Mongoose timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp |

### POST /users/register — Create User

```json
{
  "name": "John Doe",
  "email": "john@mysite.com",
  "password": "securepassword123",
  "role": "admin"
}
```

### POST /users/login — Login

```json
{
  "email": "john@mysite.com",
  "password": "securepassword123"
}
```

---

## Template

Defines the structure of a page type. Developers create templates with a set of typed fields. Editors fill in those fields when creating pages.

### Schema Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | String | Yes | Unique template name |
| `fields` | FieldSchema[] | No | Array of field definitions |
| `createdAt` | Date | Auto | Mongoose timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp |

### FieldSchema

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | String | Yes | Field identifier, use snake_case |
| `type` | String | Yes | See [Field Types Reference](#field-types-reference) |
| `required` | Boolean | No | Defaults to `false` |
| `subfields` | SubfieldSchema[] | No | Only used when `type` is `"repeater"` |

### SubfieldSchema

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | String | Yes | Subfield identifier |
| `type` | String | Yes | Same as FieldSchema, excludes `"repeater"` |
| `required` | Boolean | No | Defaults to `false` |

### POST /templates — Create Template

```json
{
  "name": "Article Page",
  "fields": [
    {
      "name": "title",
      "type": "text",
      "required": true
    },
    {
      "name": "hero_image",
      "type": "image",
      "required": false
    },
    {
      "name": "article",
      "type": "richtext",
      "required": true
    },
    {
      "name": "gallery",
      "type": "repeater",
      "required": false,
      "subfields": [
        {
          "name": "title",
          "type": "text",
          "required": false
        },
        {
          "name": "image",
          "type": "image",
          "required": false
        }
      ]
    }
  ]
}
```

---

## Page

Represents a single page belonging to a domain. Content is stored as an array of field values that map to the assigned template's field definitions.

### Schema Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | String | Yes | Internal page name |
| `domain` | ObjectId (Domain) | Yes | The site this page belongs to |
| `slug` | String | Yes | URL path, unique per domain. e.g. `about-us` |
| `template` | ObjectId (Template) | No | The template used for this page |
| `author` | ObjectId (User) | Yes | User who created the page |
| `content` | ContentFieldSchema[] | No | The page's filled-in field values |
| `seo.metaTitle` | String | No | SEO title |
| `seo.metaDescription` | String | No | SEO description |
| `publishedAt` | Date | No | If set, the page is considered published |
| `createdAt` | Date | Auto | Mongoose timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp |

> **Slug rules:** lowercase letters, numbers, and hyphens only. Must be unique within the same domain.

### ContentFieldSchema

Stores the value of a single template field for this page. The `name` must match a field name defined in the assigned template.

| Field | Type | Notes |
|---|---|---|
| `name` | String | Must match a field `name` in the template |
| `type` | String | Must match the field `type` in the template |
| `value` | Mixed | Used for all non-repeater types |
| `repeaterValue` | ContentRepeaterRowSchema[] | Used only when `type` is `"repeater"` |

### ContentRepeaterRowSchema

Represents one row in a repeater field.

| Field | Type | Notes |
|---|---|---|
| `subfields` | ContentSubfieldValueSchema[] | Array of subfield name/value pairs |

### ContentSubfieldValueSchema

| Field | Type | Notes |
|---|---|---|
| `name` | String | Must match a subfield `name` in the template |
| `value` | Mixed | The stored value |

### POST /pages — Create Page

```json
{
  "name": "Test Article Page",
  "domain": "DOMAIN_ID_HERE",
  "slug": "test-article-page",
  "template": "TEMPLATE_ID_HERE",
  "author": "USER_ID_HERE",
  "seo": {
    "metaTitle": "Test Article Page | My Site",
    "metaDescription": "A short description for search engines."
  },
  "content": [
    {
      "name": "title",
      "type": "text",
      "value": "Lorem Ipsum Dolor Sit Amet"
    },
    {
      "name": "hero_image",
      "type": "image",
      "value": "https://placehold.co/1200x600"
    },
    {
      "name": "article",
      "type": "richtext",
      "value": "<p>Lorem ipsum dolor sit amet, <strong>consectetur adipiscing elit</strong>. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"
    },
    {
      "name": "gallery",
      "type": "repeater",
      "repeaterValue": [
        {
          "subfields": [
            { "name": "title", "value": "Gallery Item One" },
            { "name": "image", "value": "https://placehold.co/800x600" }
          ]
        },
        {
          "subfields": [
            { "name": "title", "value": "Gallery Item Two" },
            { "name": "image", "value": "https://placehold.co/800x600" }
          ]
        }
      ]
    }
  ]
}
```

### PUT /page/:id — Update Page (partial)

You can send only the fields you want to update:

```json
{
  "name": "Updated Article Page",
  "seo": {
    "metaTitle": "Updated Title | My Site",
    "metaDescription": "Updated meta description."
  },
  "publishedAt": "2026-06-26T10:00:00.000Z"
}
```

To update content, send the full `content` array (it replaces the existing one):

```json
{
  "content": [
    {
      "name": "title",
      "type": "text",
      "value": "Updated Title"
    },
    {
      "name": "hero_image",
      "type": "image",
      "value": "https://placehold.co/1200x600"
    },
    {
      "name": "article",
      "type": "richtext",
      "value": "<p>Updated article content goes here.</p>"
    },
    {
      "name": "gallery",
      "type": "repeater",
      "repeaterValue": [
        {
          "subfields": [
            { "name": "title", "value": "Updated Gallery Item" },
            { "name": "image", "value": "https://placehold.co/800x600" }
          ]
        }
      ]
    }
  ]
}
```

---

## Field Types Reference

| Type | Used in | Stores | Notes |
|---|---|---|---|
| `text` | Template & Page | String | Single line text |
| `textarea` | Template & Page | String | Multi-line plain text |
| `richtext` | Template & Page | String | HTML string from a rich text editor |
| `image` | Template & Page | String | URL or path to the image |
| `number` | Template & Page | Number | Integer or float |
| `boolean` | Template & Page | Boolean | `true` or `false` |
| `url` | Template & Page | String | A full URL |
| `repeater` | Template & Page | — | Uses `subfields` (template) / `repeaterValue` (page). Cannot be nested. |

> **Note:** `repeater` cannot be used as a subfield type — only as a top-level field in a template. Subfields support all other types.

---

