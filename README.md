# X 클론 BackEnd

## 최초 계획

[인프런 Next + React Query로 SNS 서비스 만들기](https://www.inflearn.com/course/next-react-query-sns%EC%84%9C%EB%B9%84%EC%8A%A4)강의를 기준으로 내부 스터디를 진행하면서 백엔드 롤을 담당함.

x.com에서 사용하는 모든 API가 아닌 강의에서 [msw로 데이터를 생성한 부분](https://github.com/ZeroCho/z-com/tree/master/src/mocks)을 API로 제공하기로 함.

API는 REST가 아닌 많이 경험하지 않은 GraphQL로 제공하고, 추후 가능하다면 REST API까지.

## 설치 및 실행

```bash
# .env.local 파일 생성
DATABASE_URL=mongodb://x-clone-mongo:27017/x-clone?directConnection=true
JWT_SECRET=JWT_SECRET
JWT_EXPIRES_IN=1h
REDIS_URL=redis://redis:6379
TOKEN_EXPIRATION=3600000

# Docker Compose를 사용하여 이미지 빌드 (캐시 사용하지 않음)
docker-compose build --no-cache

# Docker Compose를 사용하여 컨테이너 실행 (백그라운드 모드)
docker compose up -d
```

`http://localhost:4000/graphql` 실행

## GraphQL API 엔드포인트 예시

[GRAPHQL_EXAMPLE](./docs/GRAPHQL_EXAMPLE.md)

## 개발자 노트

설치 및 개발하는 과정에서 발생한 내용들에 대한 메모

[DEVELOPMENT_NOTES](./docs/DEVELOPMENT_NOTES.md)
