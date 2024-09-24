#!/bin/bash

# 스크립트를 root 권한으로 실행 중인지 확인
if [ "$EUID" -ne 0 ]; then
  echo "이 스크립트는 root 권한으로 실행해야 합니다."
  exit 1
fi

# 시스템 업데이트 및 필요한 패키지 설치
apt update
apt upgrade -y
apt install -y apt-transport-https ca-certificates curl software-properties-common

# Docker GPG 키 추가
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Docker 리포지토리 추가
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Docker 설치
apt update
apt install -y docker-ce docker-ce-cli containerd.io

# Docker 서비스 시작 및 부팅 시 자동 시작 설정
systemctl start docker
systemctl enable docker

# Docker Compose 설치
curl -L "https://github.com/docker/compose/releases/download/v2.20.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 현재 사용자를 docker 그룹에 추가 (sudo 없이 docker 명령어 실행 가능)
usermod -aG docker $SUDO_USER

echo "Docker와 Docker Compose가 설치되었습니다."
echo "변경 사항을 적용하려면 시스템을 재부팅하거나 로그아웃 후 다시 로그인하세요."

# 재부팅 여부 확인
read -p "지금 시스템을 재부팅하시겠습니까? (y/n) " choice
case "$choice" in 
  y|Y ) reboot;;
  n|N ) echo "나중에 수동으로 재부팅하세요.";;
  * ) echo "잘못된 입력입니다. 나중에 수동으로 재부팅하세요.";;
esac