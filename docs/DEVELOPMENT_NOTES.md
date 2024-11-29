# 진행 과정 메모

## 프로젝트 설정

- NestJS 설치(`nest new project`를 이용하여 `yarn`으로 설치)
- `eslint`, `prettier` 대신 `lefthook`, `biomejs/biome` 설치

## .env 생성

```
NODE_TLS_REJECT_UNAUTHORIZED=0
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
SESSION_SECRET=
REDIS_HOST=
REDIS_PORT=
```

## Prisma generate

`npx prisma generate --schema=./src/prisma/schema.prisma` 실행

## Prisma + MongoDB 겪은 이슈

이전 개발환경은 Window에서 MongoDB를 설치하고 MongoDB Compass로 확인하면서 테스트를 했었다.

NestJS에서 Prisma에서 설치후 create 시 `which requires your MongoDB server to be run as a replica set.` replica set 환경을 요구했다.

그래서 도커로 실행시켰다. (`docker-compose.yml`)

동작까지는 잘 확인했는데, MongoDB Compass로 `mongodb://localhost:27017/x-clone?directConnection=true`을 접근하면 DB가 연동이 되지 않았다.

원인은 윈도우 시스템에 MongoDB가 실행되고 있어서 그쪽을 바라보고 있었다. 그래서 시스템에 MongoDB를 중단하고 진행했다.

만약 둘다 사용한다면 도커 포트를 `27018:27017`과 같이 변경할 수도 있다.

## Redis 설치 및 확인

docker로 설치했으며, 확인은 다음과 같이 실행. (window)

```bash
# Redis 컨테이너 확인
docker ps

# Redis CLI 실행 (conatainer_name : x-clone-redis)
docker exec -it x-clone-redis redis-cli

127.0.0.1:6379> keys *
```

## 로컬 개발시 .env.local

```
DATABASE_URL=mongodb://localhost:27017/x-clone?directConnection=true
JWT_SECRET=JWT_SECRET
JWT_EXPIRES_IN=1h
REDIS_URL=redis://localhost:6379
TOKEN_EXPIRATION=3600000
```
