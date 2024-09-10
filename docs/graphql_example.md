# graphql 쿼리

## 계정생성

```graphql
mutation {
  createUser(
    createUserInput: {
      email: "email@email.com"
      password: "password"
      nickname: "nickname"
    }
  ) {
    id
    email
    nickname
    createdAt
    updatedAt
  }
}
```

## 로그인

```graphql
mutation {
  login(loginInput: { email: "email@email.com", password: "password" }) {
    access_token
  }
}
```

## me (내정보)

http headers에 `{ x-jwt: "access_token" }` 추가

```graphql
{
  me {
    id
    email
    nickname
  }
}
```

## 전체 User 목록 가져오기

```graphql
{
  users {
    id
    email
    nickname
  }
}
```

## User 정보 가져오기

```graphql
{
  user(id: "") {
    email
    nickname
  }
}
```

## User 정보 수정

```graphql
mutation {
  updateUser(updateUserInput: { email: "email2@email.com" }) {
    id
    email
    nickname
  }
}
```
