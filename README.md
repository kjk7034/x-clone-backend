# X 클론 BackEnd

[인프런 Next + React Query로 SNS 서비스 만들기](https://www.inflearn.com/course/next-react-query-sns%EC%84%9C%EB%B9%84%EC%8A%A4)강의를 기준으로 내부 스터디를 진행하면서 백엔드 롤을 담당함.

x.com에서 사용하는 모든 API가 아닌 강의에서 [msw로 데이터를 생성한 부분](https://github.com/ZeroCho/z-com/tree/master/src/mocks)을 API로 제공하기로 함.

API는 REST가 아닌 많이 경험하지 않은 GraphQL로 제공하고, 추후 가능하다면 REST API까지.

## 진행 과정 메모

### 프로젝트 설정

- NestJS 설치(`nest new project`를 이용하여 `yarn`으로 설치)
- `eslint`, `prettier` 대신 `lefthook`, `biomejs/biome` 설치

#### .env.local 생성

```
NODE_TLS_REJECT_UNAUTHORIZED=0
DATABASE_URL=mongodb://localhost:27017/x-clone
JWT_SECRET=
```

#### Prisma generate

`npx prisma generate` 실행

### Prisma + MongoDB 겪은 이슈

이전 개발환경은 Window에서 MongoDB를 설치하고 MongoDB Compass로 확인하면서 테스트를 했었다.

NestJS에서 Prisma에서 설치후 create 시 `which requires your MongoDB server to be run as a replica set.` replica set 환경을 요구했다.

그래서 도커로 실행시켰다. (`docker-compose.yml`)

동작까지는 잘 확인했는데, MongoDB Compass로 `mongodb://localhost:27017/x-clone?directConnection=true`을 접근하면 DB가 연동이 되지 않았다.

원인은 윈도우 시스템에 MongoDB가 실행되고 있어서 그쪽을 바라보고 있었다. 그래서 시스템에 MongoDB를 중단하고 진행했다.

만약 둘다 사용한다면 도커 포트를 `27018:27017`과 같이 변경할 수도 있다.

### Redis 설치 및 확인

docker로 설치했으며, 확인은 다음과 같이 실행. (window)

```bash
# Redis 컨테이너 확인
docker ps

# Redis CLI 실행 (conatainer_name : x-clone-redis)
docker exec -it x-clone-redis redis-cli
```

### API 구현

```
/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── config/
│   │   └── configuration.ts
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── auth.resolver.ts
│   │   ├── jwt.strategy.ts
│   │   └── dto/
│   │       └── login.dto.ts
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   ├── users.resolver.ts
│   │   └── dto/
│   │       ├── create-user.dto.ts
│   │       └── update-user.dto.ts
│   ├── posts/
│   │   ├── posts.module.ts
│   │   ├── posts.service.ts
│   │   ├── posts.resolver.ts
│   │   └── dto/
│   │       ├── create-post.dto.ts
│   │       ├── update-post.dto.ts
│   │       └── post-response.dto.ts
│   ├── images/
│   │   ├── images.module.ts
│   │   ├── images.service.ts
│   │   └── images.resolver.ts
│   ├── tags/
│   │   ├── tags.module.ts
│   │   ├── tags.service.ts
│   │   └── tags.resolver.ts
│   ├── common/
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   └── middlewares/
│   │       └── jwt.middleware.ts
│   └── prisma/
│       └── prisma.service.ts
├── test/
│   ├── app.e2e-spec.ts
│   ├── jest-e2e.json
│   └── ...
├── .env
├── .gitignore
├── nest-cli.json
├── package.json
├── README.md
└── tsconfig.json
```

### 배포
