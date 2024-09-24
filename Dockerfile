FROM node:20-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV NODE_ENV="production"

WORKDIR /usr/src/app

# 필요한 도구 설치
RUN apt-get update && apt-get install -y ca-certificates curl gnupg openssl && \
    update-ca-certificates

# pnpm 설정
RUN corepack enable && corepack prepare pnpm@latest --activate

# # npm 및 pnpm 설정 조정

# 프로젝트 파일 복사
COPY package.json pnpm-lock.yaml ./

# 모든 의존성 설치 (개발 의존성 포함)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# NestJS CLI 전역 설치
# RUN pnpm add -g @nestjs/cli

# 소스 코드 복사
COPY . .

# Prisma 스키마 생성 및 애플리케이션 빌드
RUN pnpm prisma:generate
RUN pnpm build

# 프로덕션 의존성만 남기고 개발 의존성 제거
RUN pnpm prune --prod

# 환경 변수 설정
# ENV NODE_ENV=production

EXPOSE 4000

CMD ["pnpm", "start:dev"]