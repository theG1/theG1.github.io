---
layout: default
title: 1-1. Red Hat OpenShift Components and Editions
nav_order: 2
parent: 1. Introduction to Kubernetes and OpenShift
---

# 1-1 Red Hat OpenShift Components and Editions

# Red Hat OpenShift 구성 요소 및 에디션

## Red Hat OpenShift 소개

- **Kubernetes 기반**
    - Kubernetes는 클러스터에서 컨테이너 워크로드를 실행하기 위한 핵심 기능을 제공
    - Kubernetes는 다양한 기능을 위한 빌딩 블록을 제공하여 특정 요구 사항에 맞게 커스터마이즈 가능
- **기술적 기반**
    - OpenShift Origin은 Docker 컨테이너, Kubernetes 클러스터 매니저 및 개발 및 운영 중심 도구를 기반으로 합니다.
    - Docker는 재사용 가능한 이미지 형태의 컨테이너화된 애플리케이션의 개발을 지원합니다.
    - Kubernetes는 대규모 클러스터에서 Docker 이미지의 배포 및 관리를 지원합니다.
- **OpenShift의 주요 기능**
    - container 이미지 빌드 및 관리를 위한 내장 레지스트리 제공.
    - 소프트웨어 정의 네트워크 지원.
    - 깃허브와 같은 소스 코드 관리 소프트웨어와의 통합.
    - 프로젝트, 팀 및 사용자 지원으로 애플리케이션 접근을 조직화 및 관리.
- **OpenShift의 향상된 기능**
    - 통합 개발자 워크플로우
        - 내장된 컨테이너 레지스트리
        - CI/CD 파이프라인
        - 소스 코드에서 컨테이너 이미지를 빌드하는 S2I 도구
    - 관측 가능성
        - 애플리케이션과 클러스터의 모니터링 및 로깅 서비스
    - 서버 관리
        - 다양한 시나리오에 맞는 설치 및 업데이트 절차 제공
        - RHEL CoreOS를 기본 운영체제로 사용
        - Kubernetes 구성 모델을 사용하여 RHEL CoreOS 관리 도구 제공
        - 통합 도구 및 그래픽 웹 콘솔 포함
        - 향상된 보안 조치 제공

## OpenShift 구성 요소

- **API 서버**
    - OpenShift 및 Kubernetes 리소스와 상호작용
- **웹 콘솔**
    - 개발자 및 관리자용 별도 프로필 제공
- **etcd**
    - OpenShift의 동작과 상태에 대한 정보를 저장하는 데이터 스토어
- **네트워킹 스택**
    - 애플리케이션 연결 및 외부 트래픽을 안전하게 라우팅
- **영구 저장소**
    - 애플리케이션이 생성한 데이터를 보존
- **운영자 (Operators)**
    - OpenShift 내 기능과 도구를 추가하는 컨테이너화된 애플리케이션

## Red Hat OpenShift 에디션

- ***Exploring OpenShift**
    - Red Hat OpenShift Local
        - 로컬 컴퓨터에 클러스터를 배포하여 테스트 및 에 사용
    - Developer Sandbox
        - 30일 동안 무료로 공유 OpenShift 클러스터에 접근 가능
- **프로덕션 배포**
    - **공용 클라우드 파트너**
        - AWS, Azure, IBM Cloud, Google Cloud에서 빠르게 Red Hat OpenShift 배포 가능
    - **셀프 관리 옵션**
        - 물리적 또는 가상 인프라에 설치 프로그램 제공, 온프레미스 또는 공용 클라우드
        - 더 많은 제어와 유연성을 제공하지만 책임 증가

### 관리형 서비스 vs. 셀프 관리 에디션

- **관리형 서비스**
    - Red Hat과 클라우드 제공자가 더 많은 책임을 관리
    - Red Hat Site Reliability Engineering 팀이 업데이트와 문제 해결 담당
    - 운영 관리 부담이 적은 사용자에게 적합
- **셀프 관리 에디션**
    - 인증과 같은 측면에 대한 더 많은 제어 제공
    - 사용자가 업데이트와 문제 해결을 직접 담당
    - 완전한 제어를 선호하는 사용자에게 적합

## 다양한 Red Hat OpenShift 제품군

- **Red Hat OpenShift Kubernetes Engine**
    - Kubernetes를 포함하여 보안 강화와 엔터프라이즈 안정성 제공
    - RHEL CoreOS에서 실행
    - 운영 지원을 위한 관리자 콘솔 제공
- **Red Hat OpenShift Container Platform**
    - 추가 관리성, 보안, 안정성 및 개발 기능 포함
    - 개발자 콘솔, 로그 관리, 비용 관리, 메터링 추가
    - Red Hat OpenShift Serverless, Service Mesh, Pipelines, GitOps 포함
- **Red Hat OpenShift Platform Plus**
    - 가장 종합적인 기능 제공
    - Advanced Cluster Management, Advanced Cluster Security, Quay 개인 레지스트리 포함
    - 완전한 개발 및 관리 접근 방식을 위한 도구 번들 제공
- **OpenShift의 다양한 버전**
    - OpenShift Origin(OKD): 원래의 오픈 소스 프로젝트.
    - OpenShift Online: RedHat에서 호스팅하는 OpenShift origin의 공용 버전.
    - OpenShift Dedicated: AWS 및 Google과 같은 클라우드 플랫폼에서의 관리되는 사설 클러스터.
    - OpenShift Enterprise: OpenShift의 사설 PaaS 제공.

# **Red Hat OpenShift Editions(Clouds)**

![Untitled](1-3%20Red%20Hat%20OpenShift%20Components%20and%20Editions%20b5511cbed5884a148758297c93bbd6ac/Untitled.png)

- **Red Hat OpenShift on AWS (ROSA)**
    - 클라우드 네이티브 컨테이너 애플리케이션 개발 및 배포 솔루션
    - 장점:
        - 여러 지역에 쉽게 애플리케이션 배포 및 확장 가능
        - 높은 가용성과 자동 업데이트
        - AWS 서비스(EBS, ECR)와 통합
        - 멀티 클라우드 배포 지원
        - 내장 네트워크 보안 정책, 역할 기반 접근 제어, 데이터 암호화
        - 자동 컴플라이언스 검사 및 수정
- **Azure Red Hat OpenShift**
    - Azure에서 완전 관리형 컨테이너 플랫폼
    - 장점:
        - Microsoft와 Red Hat이 공동 설계
        - 자동 운영 및 내장 보안 제어
        - 미션 크리티컬 애플리케이션에 적합한 엔터프라이즈 지원
        - 인프라 관리, 보안, 패치 및 업그레이드 등을 처리하는 관리형 서비스
        - Azure 서비스와의 통합(네트워킹, 스토리지, 아이덴티티 관리, 모니터링 등)
- **OpenShift Container Platform (OCP)**
    - 원래의 OpenShift 제품
    - 다양한 인프라 환경(온프레미스, 공용 클라우드, 하이브리드 클라우드, 베어메탈)에 배포 가능
    - 인프라 선택의 유연성 제공

## OpenShift 시작하기

- **OpenShift Local**
    - 개발 및 학습을 위한 올인원 OpenShift 클러스터
    - Windows, Mac, Linux에서 가상 머신으로 사용 가능
- **Red Hat Developer Sandbox**
    - 30일 동안 무료로 공유 OpenShift 및 Kubernetes 클러스터에 접근 가능

# 참고1

- **Red Hat OpenShift Container Platform (RHOCP)의 배포 방법**
    - **Red Hat OpenShift Local**:
        - 처음 도시입시 테스트 및 개발을 위해 단일 노트에 설치
    - **SNO (Single Node OpenShift)**:
        - 테스트 및 개발 목적으로 단일 노드에 설치하여 사용하는 OpenShift 버전입니다.
            - 새로운 플러그인이나 애드온을 OpenShift에 테스트해 보고 싶을 때 SNO 환경에 설치하여 안정성 및 호환성을 확인합니다.
    - **OpenShift Origin (현 OKD)**
        - **정의**: OpenShift Origin은 Red Hat OpenShift의 오픈소스 버전으로, 공동체에서 주도하며 개발
            - 2018년 이후로, 이 프로젝트는 OKD (The Origin Community Distribution of Kubernetes)라는 이름으로 변경
            
            [Red Hat OpenShift와 OKD](https://www.redhat.com/ko/topics/containers/red-hat-openshift-okd)
            
    - **OpenShift CRC (CodeReady Containers):**
        - **정의**: CodeReady Containers (CRC)는 개발자의 로컬 환경에서 Red Hat OpenShift 4 클러스터를 간단하게 실행할 수 있게 해주는 도구
            - CRC는 개발자가 로컬 환경에서 실제 OpenShift 환경과 유사한 환경에서 애플리케이션 개발 및 테스트를 진행할 수 있게 해준다.
            - CRC는 OpenShift 4를 실행하는 것을 목표로하며, 무료로 사용할 수 있다
        - **특징**:
            - CRC는 단일 노드 OpenShift 클러스터를 실행한다.
            - 주로 개발 및 테스트 목적으로 설계되었으며, 실제 운영 환경에는 적합하지 않다.
            - CRC는 간단한 설치 및 시작 프로세스를 통해 사용자의 PC(Windows, macOS 또는 Linux)에서 쉽게 실행될 수 있다.
            - CRC를 이용하면 개발자는 로컬 환경에서 OpenShift를 실행하고 응용 프로그램을 개발하고 배포하는 데 필요한 도구와 기능을 탐색할 수 있다.
                
                [Getting Started Guide](https://crc.dev/crc/#introducing_gsg)
                
    - 두 방법 모두 실제 프로덕션 환경에는 권장되지 않습니다. 실제 서비스 환경에는 다중 노드 구성 및 높은 안정성을 보장하는 OpenShift 구성을 사용해야 합니다.

# 참고2

### OpenShift4 vs Kuernetes

| 특징 | Kubernetes | OpenShift 4 |
| --- | --- | --- |
| 설치 및 배포 | 거의 모든 플랫폼에 설치 가능 | Red Hat Enterprise Linux Atomic Host (RHELAH), Fedora, or CentOS에 종속적 |
| 보안 | 기본 인증/인가 기능이 없으며 개발자가 직접 설정해야 함
- 기본적인 RBAC | 더욱 엄격한 보안 정책과 내장된 보안 옵션 제공
- RBAC와 SELinux 사용 |
| 지원 | 큰 개발자 커뮤니티를 갖추고 있음 | Red Hat 개발자를 중심으로 한 상대적으로 작은 지원 커뮤니티 |
| 네트워킹 | 기본 네트워킹 솔루션 없음, 서드파티 네트워크 플러그인 사용 가능 | 내장된 네트워킹 솔루션 Open vSwitch를 제공 |
| 템플릿 | Helm 템플릿 제공 | Helm 템플릿 제공 |
| 이미지 레지스트리 관리 | 내장 이미지 레지스트리 없음, 개인 레지스트리에서 이미지를 가져올 수 있음 | 내장 이미지 레지스트리 제공, DockerHub나 Red Hat과의 통합 지원 |
| 통합 CI/CD | 완벽한 CI/CD 솔루션을 제공하지 않음, 다양한 도구와 통합하여 CI/CD 파이프라인을 구성 가능 | 완벽한 CI/CD 솔루션 제공하지 않지만, 인증된 Jenkins 컨테이너를 CI 서버로 사용할 수 있음 |
| 사용자 경험과 인터페이스 | 복잡한 웹 인터페이스를 가짐, 대시보드 설치와 kube-proxy를 사용하여 포트를 클러스터 서버로 전송해야 함 | 직관적인 웹 콘솔을 제공, 사용자가 자원을 추가, 삭제, 수정할 수 있는 간단한 폼 기반 인터페이스를 제공 |
| 라우팅과 부하 분산 | Ingress를 사용하여 서비스에 접근한다. 추가 설정이 필요하다 | 자체 라우터가 내장되어 있어서, 서비스에 쉽게 접근할 수 있다 |