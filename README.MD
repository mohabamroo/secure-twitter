# Secure Twitter

## Features

### Users

- Follow/request :heavy_check_mark:
- Unfollow :heavy_check_mark:
- List (pagination) :heavy_check_mark:
- Accept/Remove Follow Requests :heavy_check_mark:

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
- List User tweets :heavy_check_mark:
- Favorite
- Retweet

### Messages

- Send Messages (request) :heavy_check_mark:
- List messages with user :heavy_check_mark:
- List user chats (unique messages) :heavy_check_mark:

---

## Authentication

- Using JWT
- Invalidate tokens after logout
- Check for expired tokens

## Authorization

- Checking for roles

## General Notes

- limiting requets (prevent DOS)
- handling any error (prevent crashes)
- using regex in url params to add restrictions
- Mongoose ORM has sanitizing guards
- omitting user password when converted to JSON

## TODO:

- sanitize tweets
- add loggers
- mongoose uri env var
