# Project Setup & Environment Configuration Guide

This document provides step-by-step instructions for installing, configuring, and running the server  locally or on a deployment instance.

## Table of Contents

1. [Prerequisites](#prerequisites)

2. [Project Installation](#project-installation)

3. [Environment Configuration (.env)](#environment-configuration-env)

   * [MONGO_URI](#1-mongo_uri)

   * [JWT_SECRET_KEY](#2-jwt_secret_key)

   * [JWT_EXPIRES_IN](#3-jwt_expires_in)

   * [UMBRELLA_DOMAIN](#4-umbrella_domain)

4. [Running the Server](#running-the-server)

## Prerequisites

Before setting up the project, ensure you have the following installed on your machine:

* **Node.js**: `v24.x` or higher recommended. Check version:

  ```
  node -v
  
  ```

* **npm** (comes with Node.js) or **yarn** / **pnpm**:

  ```
  npm -v
  
  ```

* **Git**: For cloning and version control.

* **MongoDB Instance**: Either local MongoDB server or a remote database (e.g., MongoDB Atlas).

## Project Installation

1. **Clone the repository** (if you haven't already):

   ```
   git clone https://github.com/FilopoulosD/CMS-Backend
   cd CMS-Backend
   
   ```

2. **Install dependencies**:

   ```
   npm install
   
   ```

   *(Or `yarn install` / `pnpm install` depending on your package manager).*

3. **Create the Environment File**:
   In the root directory of your project, create a file named `.env`:

   ```
   touch .env
   
   ```

## Environment Configuration (.env)

Open the `.env` file in your code editor and populate the key-value pairs as described below.

```
MONGO_URI = 
JWT_SECRET_KEY = 
JWT_EXPIRES_IN = 
UMBRELLA_DOMAIN = 

```

### 1. `MONGO_URI`

* **Description:** The connection string used by Mongoose/MongoDB driver to connect to your database.

* **Format:** `mongodb://` or `mongodb+srv://`

#### Options:

* **MongoDB Atlas (Cloud):**

  ```
  MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/<dbname>?retryWrites=true&w=majority
  
  ```

* **Local MongoDB Server:**

  ```
  MONGO_URI=mongodb://localhost:27017/my_database_name
  
  ```

### 2. `JWT_SECRET_KEY`

* **Description:** A secure, high-entropy secret string used to sign and verify JSON Web Tokens (JWT) for authentication.

* **Best Practice:** Keep this secret completely private. Do not commit it to version control.

#### How to Generate a Secure Secret Key:

Run one of the following commands in your terminal to generate a strong key:

* **Using OpenSSL:**

  ```
  openssl rand -base64 32
  
  ```

* **Using Node.js REPL:**

  ```
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  
  ```

#### Example Value:

```
JWT_SECRET_KEY=9f8c3a1e2b4d6c8e0a2f4b6d8c0e2a4f6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6

```

### 3. `JWT_EXPIRES_IN`

* **Description:** Defines the lifespan or expiration duration of generated JWT tokens.

* **Format:** Accepts time strings (e.g., `1d`, `12h`, `30m`, `3600s`) or a number representing milliseconds.

#### Common Examples:

```
# Expires in 1 day (recommended for general API access)
JWT_EXPIRES_IN=1d

# Expires in 12 hours
JWT_EXPIRES_IN=12h

# Expires in 15 minutes (suitable for strict security/short sessions)
JWT_EXPIRES_IN=15m

```

### 4. `UMBRELLA_DOMAIN`

* **Description:** The root/apex domain that serves as the central network hub and main dashboard for the application. It acts as the anchor domain for central administration, and multi-tenant domain routing.

* **Format:** Plain domain or hostname without protocol (e.g., `example.com` or `network.example.com`). Do not include `http://` or `https://`.

#### Examples:

```
# Production setup (main umbrella domain)
UMBRELLA_DOMAIN=example.com

# Staging/Subdomain setup
UMBRELLA_DOMAIN=network.example.com

# Local development setup
UMBRELLA_DOMAIN=localhost:3000

```

## Final `.env` Example Template

Your populated `.env` file should look similar to this:

```
MONGO_URI=mongodb+srv://admin:securepassword@cluster0.example.mongodb.net/production_db?retryWrites=true&w=majority
JWT_SECRET_KEY=e8f90241b9c2889e1a8a29b4e5d6c7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4
JWT_EXPIRES_IN=1d
UMBRELLA_DOMAIN=example.com

```

## Running the Server

Once your `.env` file is configured:

1. **Development Mode** (with hot reloading if configured):

   ```
   npm run debug
   
   ```

2. **Production Mode**:

   ```
   npm start
   
   ```