# 1장. Introduction to Kubernetes and OpenShift

# 전통적인 애플리케이션 배포

![Untitled](1%E1%84%8C%E1%85%A1%E1%86%BC%20Introduction%20to%20Kubernetes%20and%20OpenShift%206835246e84e346939765a4c1115692ab/Untitled.png)

## 배포 단계

- **서버 준비**
    - 운영 체제(OS) 배포
    - 애플리케이션 런타임 설치
    - 애플리케이션 의존성 관리
        - 예: 애플리케이션 A는 라이브러리 X 버전 1이 필요
        - 문제: 애플리케이션 B는 라이브러리 X 버전 2가 필요하여 동일 서버에 함께 배치 불가

## 전통적인 배포의 문제점

- 의존성 충돌로 인해 여러 애플리케이션을 동일 서버에 실행할 수 없음
- 여러 서버를 필요로 하여 리소스 비효율 발생

# 컨테이너 개요

## 핵심 개념

- **컨테이너**
    - 애플리케이션과 그 실행 환경을 포함한 독립적인 실행 패키지
- **컨테이너 이미지**
    - 애플리케이션, 의존성, 메타데이터를 포함하는 단일 파일 (tar 아카이브)
    - 메타데이터는 ENTRYPOINT 등 컨테이너 시작 명령어 포함
        
        ```docker
        # Dockerfile 예시
        # 애플리케이션 A와 라이브러리 X 버전 1을 포함하는 Dockerfile
        FROM ubuntu:20.04
        
        LABEL maintainer="you@example.com"
        
        RUN apt-get update && apt-get install -y \
            libx1=1.0.0 \
            && rm -rf /var/lib/apt/lists/*
        COPY app-a /usr/src/app
        WORKDIR /usr/src/app
        CMD ["./app-a"]
        ```
        

## 컨테이너 레지스트리

- **목적**: 컨테이너 이미지를 저장하고 다운로드하는 저장소
- **예시**:
    - `registry.access.redhat.com`
    - `registry.redhat.io` (인증 필요)
    - `quay.io`

## 컨테이너 런타임

- **기능**: 컨테이너 이미지를 실행하는 소프트웨어
- **예시**:
    - `runC`: 가벼운 컨테이너 런타임
    - `Podman`: 사용이 간편한 runC 버전
    - `CRI-O`: Kubernetes 배포판 (예: OpenShift)을 위한 컨테이너 런타임 인터페이스
    - `Docker`: 인기 있는 컨테이너 런타임

# 컨테이너화 과정

1. **컨테이너 이미지 생성**
    - 애플리케이션과 의존성 및 런타임 패키징
    - 예: 애플리케이션 A는 라이브러리 X 버전 1, 애플리케이션 B는 라이브러리 X 버전 2
2. **컨테이너 이미지 저장**
    - 신뢰할 수 있는 레지스트리에 이미지 업로드
3. **서버에 배포**
    - 컨테이너 런타임이 설치된 서버 사용
    - 레지스트리에서 컨테이너 이미지 다운로드
    - 컨테이너 런타임을 사용하여 컨테이너 시작

# Kubernetes 개요

## 배포 단순화

- **플랫폼**: Kubernetes는 컨테이너화된 애플리케이션의 배포, 관리, 확장을 단순화
- **배포판**: OpenShift와 같은 배포판을 통해 추가 도구와 기능 제공

## Kubernetes 아키텍처

![[https://www.kubecost.com/kubernetes-multi-cloud/kubernetes-multi-cluster/](https://www.kubecost.com/kubernetes-multi-cloud/kubernetes-multi-cluster/)](1%E1%84%8C%E1%85%A1%E1%86%BC%20Introduction%20to%20Kubernetes%20and%20OpenShift%206835246e84e346939765a4c1115692ab/Untitled%201.png)

[https://www.kubecost.com/kubernetes-multi-cloud/kubernetes-multi-cluster/](https://www.kubecost.com/kubernetes-multi-cloud/kubernetes-multi-cluster/)

- **노드**: Kubernetes 클러스터의 컴퓨터
    - **제어 플레인 노드**: 클러스터 상태 및 스케줄링 관리
    - **컴퓨트 플레인 노드 (워커 노드)**: 실제 사용자 워크로드 실행
- **etcd**: 모든 클러스터 데이터를 저장하는 키-값 저장소 데이터베이스
- **외부 로드 밸런서**: 네트워크 트래픽을 적절한 노드로 분산

## 주요 기능

- **Self-healing**
    - 실패한 컨테이너나 노드를 자동으로 교체
- **수평 scaling**
    - 현재 부하에 따라 실행 중인 컨테이너 수 조정
- **자동 rollout**
    - 애플리케이션 업데이트를 점진적으로 배포하고 롤백 기능 제공
- **서비스 검색 및 load balancing**
    - DNS 및 로드 밸런싱을 사용하여 컨테이너 간 통신 관리
- **Secrets 및 configuration 관리**
    - 컨테이너 이미지를 변경하지 않고 민감한 정보 및 구성 설정 관리

# OpenShift 개요

![Untitled](1%E1%84%8C%E1%85%A1%E1%86%BC%20Introduction%20to%20Kubernetes%20and%20OpenShift%206835246e84e346939765a4c1115692ab/Untitled%202.png)

## OpenShift API

- **인터페이스**: 웹 콘솔 또는 명령줄 도구를 통해 OpenShift API 사용
- **통합**: 클러스터 관리를 위해 Kubernetes API와 연동

## 노드 역할

- **제어 플레인 노드**
    - 인프라 구성 요소(예: etcd 및 OpenShift API) 실행
- **워커 노드 (컴퓨트 플레인 노드)**
    - 사용자 배포 애플리케이션 및 워크로드 실행

# 예제 시나리오

## 전통적인 배포 vs. 컨테이너 배포

### 전통적인 배포

1. **서버 A**
    - OS 배포
    - 애플리케이션 런타임 설치
    - 애플리케이션 A 설치 (라이브러리 X 버전 1 필요)
2. **서버 B**
    - OS 배포
    - 애플리케이션 런타임 설치
    - 애플리케이션 B 설치 (라이브러리 X 버전 2 필요)

### 컨테이너 배포

1. **컨테이너 이미지 생성**
    - 애플리케이션 A와 라이브러리 X 버전 1
    - 애플리케이션 B와 라이브러리 X 버전 2
2. **이미지를 레지스트리에 저장**
    - 신뢰할 수 있는 레지스트리 (예: `registry.redhat.io`)에 이미지 업로드
3. **서버에 배포**
    - 서버에 컨테이너 런타임 설치
    - 애플리케이션 A 컨테이너를 다운로드 및 실행
    - 애플리케이션 B 컨테이너를 다운로드 및 실행