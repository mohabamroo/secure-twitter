# Secure Twitter

## Features

### Users

- Follow :heavy_check_mark:
- Unfollow :heavy_check_mark:
- List

### Messages

- Chat request
- Send messages

### Auth

- Login :heavy_check_mark:
- Register :heavy_check_mark:
- Logout (invalidate token)
- Refresh token

### Tweets

- Create :heavy_check_mark:
- List :heavy_check_mark:
- Favorite
- Retweet

---

## Authentication

- Using JWT
-

## Authorization

- checking for roles

## General Notes

- limiting requets (prevent DOS)
- handling any error (prevent crashes)
- using regex in url params to add restrictions
- Mongoose ORM has sanitizing guards
- omitting user password when converted to JSON

## TODO:

- Invalidate tokens after logout
- check for expired tokens
- sanitize tweets
- add loggers
- mongoose uri env var
