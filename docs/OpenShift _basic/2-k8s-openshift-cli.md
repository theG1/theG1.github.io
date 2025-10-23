---
layout: default
title: 2장. Kubernetes 및 OpenShift CLI
nav_order: 10
parent: Redhat OpenShift
---

# 2장. Kubernetes 및 OpenShift의 명령줄 인터페이스 및 API

| 목적 | 명령줄을 사용하여 OpenShift 클러스터에 액세스하고 해당 Kubernetes API 리소스를 쿼리하여 클러스터의 상태를 평가합니다. |
| --- | --- |
| 목표 | • Kubernetes 및 OpenShift의 명령줄 인터페이스를 사용하여 OpenShift 클러스터에 액세스합니다.
• Kubernetes 리소스의 속성을 쿼리, 형식 지정, 필터링합니다.
• 필수 클러스터 서비스 및 구성 요소의 상태를 쿼리합니다. |

# OpenShift 및 Kubernetes CLI

- OpenShift 및 Kubernetes CLI 사용
    - OpenShift는 'oc' 명령어를 사용하고, Kubernetes는 'kubectl' 명령어를 사용한다.
    - oc 명령어는 kubectl 의 상위 집합으로 kubectl 도 함께 사용가능하다.

## OpenShift CLI 사용법

- OpenShift 로그인
    - OpenShift 클러스터에 로그인하기 위해서는  `oc login` 명령어를 사용.
    - API의 URL과 포트를 필요로 합니다. (일반적으로 OpenShift API는 6443 포트 사용)
    
    ```bash
    oc login -u=<username> -p=<password> --server=<your-openshift-server>
    oc login <https://api.your-openshift-server.com> --token=<tokenID>
    ```
    
    - `-u`: OpenShift 사용자의 사용자 이름
    - `-p`: 비밀번호

### Project 관리

- `oc --help:` OpenShift CLI (oc)
    - OpenShift 클러스터와 상호 작용하여 애플리케이션을 관리하고 클러스터 리소스를 조작하는 데 사용
- `oc new-project <프로젝트_이름>`: 새 프로젝트 생성
    - 지정한 이름으로 새로운 프로젝트를 생성합니다.
- `oc project`: 현재 프로젝트 확인
    - 현재 작업 중인 프로젝트의 정보를 표시합니다.
- `oc project <project_name>`: 프로젝트 변경
    - 작업할 프로젝트를 변경합니다.
- `oc get projects`: 프로젝트 목록 표시
    - 클러스터의 모든 프로젝트를 나열합니다.
- `oc delete project <프로젝트_이름>`: 프로젝트 삭제
    - 지정한 프로젝트와 관련된 모든 리소스를 삭제합니다.
- `oc get all`: 프로젝트 리소스 보기
    - 현재 프로젝트에 속한 모든 리소스(파드, 서비스, 디플로이먼트 등)를 표시합니다.
- `oc describe`: 프로젝트 리소스 상세 정보 보기:
    - 지정한 리소스의 상세 정보를 표시합니다. 예를 들어, `oc describe pod mypod`는 `mypod`라는 이름의 파드에 대한 상세 정보를 표시합니다.

```bash
 # oc login 명령을 사용하여 요청을 인증
# [user@host ~]$ oc login cluster-url

[user@host ~]$ **oc login https://api.ocp4.example.com:6443**
Username: developer
Password: developer

# project 는 애플리 케이션 격리를 위해 생성
[user@host ~]$ **oc new-project myapp**
[user@host ~]$ oc cluster-info
[user@host ~]$ oc get pods 
[user@host ~]$ oc api-versions
[user@host ~]$ oc get clusteroperator
```

# 리소스의 이해

- **오브젝트(Object)**
    - 쿠버네티스에서 관리되는 기본 항목입니다.
    - 도서관의 개별 도서와 같다.
        - 'Harry Potter'라는 책
- **리소스(Resource)**
    - 쿠버네티스에서 오브젝트의 유형 또는 종류입니다.
    - 도서관에서 장르 또는 카테고리
        - 소설, 과학, 역사 등의 도서 장르
- **API 리소스(API Resource)**
    - 쿠버네티스 API 서버가 알고 있는 오브젝트의 유형
    - 도서관 컴퓨터 시스템에서 검색 가능한 도서 카테고리 목록
        - 예제: 도서관 컴퓨터에서 "소설" 카테고리를 검색하면, 해당 카테고리의 모든 도서 목록이 나옵니다.
- **커스텀 리소스(Custom Resource)**
    - 기본적으로 제공되지 않는 새로운 리소스 유형을 정의
    - 도서관에서 새로운 도서 카테고리를 만드는 것과 같다.
        - 도서관에 'VR 컨텐츠'라는 새로운 카테고리 생성
- **커스텀 리소스 디파인(Custom Resource Definition, CRD)**
    - 커스텀 리소스를 정의하는 방법
        - 도서관에서 새로운 카테고리의 기준과 구조를 정의하는 것과 같다
            - 'VR 컨텐츠' 카테고리는 VR 기기와 함께 사용되는 콘텐츠를 포함하며, 관련 장비 정보도 포함해야 한다는 규정을 정의
- **오퍼레이터(Operator)**
    - 커스텀 리소스의 생성, 수정 및 관리에 대한 로직을 제공하는 코드입니다.
        - Go, Ansible, Helm 과 같은 도구를 사용해 작성된다.
    - 도서관에서 새 카테고리의 도서를 관리하거나 정리하는 데 특화된 직원
        - 'VR 컨텐츠' 카테고리의 도서를 관리하고, 관련 장비를 체크하여 정리하는 도서관 직원

## **리소스의 구성요소**

- **Kind**: 리소스의 유형을 나타냅니다. (예: Pod, Service, Deployment)
- **Metadata**: 리소스의 이름, 네임스페이스, 레이블 및 주석 등의 메타데이터 정보를 포함합니다.
- **Spec**: 원하는 리소스의 상태와 구성을 설명합니다.
- **Status**: 현재 리소스의 상태를 나타내는 정보입니다.

## 리소스 조회

- API 리소스를 통해 이루어 진다.
- `oc get [리소스 이름]` : 특정 리소스 조회 가능
    - `/api/v1/pods` 엔드포인트에 GET 요청을 보내는것
- `oc get all` : 명령어로 프로젝트 내 모든 리소스 조회 가능
- 리소스 세부정보 조회
    - `oc describe [리소스 종류/리소스 이름]` 또는 `oc describe [리소스 종류] [리소스 이름]`로 세부정보 조회 가능
- `oc get [리소스 종류] -n [프로젝트 이름]` 명령어로 특정 프로젝트의 리소스 조회 가능

```bash
# get 명령은 선택한 프로젝트의 리소스에 대한 정보를 검색하는 데 사용
[user@host ~]$ oc get all
[user@host ~]$ kubectl describe mysql-openshift-1-glgrp
[user@host ~]$ oc explain pods.spec.containers.resources
```

## 리소스 삭제

- `oc delete [리소스 종류/리소스 이름]` 또는 `oc delete [리소스 종류] [리소스 이름]` **:** 현재 프로젝트의 RHOCP 리소스를 삭제하는 명령어
- 리소스 유형과 이름 지정 필요
    
    ```sql
    [user@host ~]$ oc delete pod quotes-ui
    ```
    

# 애플리케이션 배포 방법

- 애플리케이션 생성
    - `oc create [리소스 종류] --image=[이미지 이름]` 명령어로 애플리케이션 생성 가능
- 애플리케이션 배포
    - `oc new-app [애플리케이션 이름] --image=[이미지 이름]` 명령어로 애플리케이션 배포 가능
    - 배포된 애플리케이션은 기본적으로 외부에 노출되지 않음
    - `oc expose svc/[서비스 이름]` 명령어로 애플리케이션을 외부에 노출시킬 수 있음
- 리소스 조회
    - `oc get deploy` 명령어로 프로젝트 내 배포된 애플리케이션 조회 가능
    - 특정 라벨의 리소스를 조회하고 싶을 경우, `oc get [리소스 종류] -l [라벨]` 명령어 사용 가능

# 예제

MySQL에 연결하는 데 필요한 자격 증명(예: 사용자 이름 및 비밀번호)을 Kubernetes의 `Secret` 리소스로 생성하고 수정해 보자 

- **username**: `myuser` → redhatuser
- **password**: `mypassword` → new-password

방법. 

1. `kubectl`을 사용하여 Secret 리소스를 만드는 명령을 직접 실행
2. YAML 파일을 작성하여 해당 파일로 Secret 리소스를 생성

### 1. `kubectl` 명령어 사용

다음 명령어를 사용하면 `mysql-secret`이라는 이름의 Secret을 생성할 수 있습니다:

```bash
oc create secret generic mysql-secret \
  --from-literal=username=myuser \
  --from-literal=password=mypassword

```

### 2. YAML 파일 사용

먼저, `mysql-secret.yaml`이라는 이름의 YAML 파일을 작성합니다:

```bash
echo -n 'myuser' | base64
echo -n 'mypassword' | base64
```

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysql-secret
type: Opaque
data:
  username: bXl1c2Vy  # "myuser"를 base64로 인코딩한 값
  password: bXlwYXNzd29yZA==  # "mypassword"를 base64로 인코딩한 값
```

이후, 다음의 명령어를 실행하여 Secret을 생성합니다:

```bash
oc apply -f mysql-secret.yaml
```

### 3. 리소스 조회 삭제

```bash
# project 생성
oc new-project ch02

# 전체 Secret 정보 조회
oc get secret mysql-secret -o yaml
oc get secret/mysql-secret

# Secret의 특정 키값 조회
# mysql-secret의 username 값을 디코딩하여 출력
oc get secret mysql-secret -o=jsonpath='{.data.username}'
oc get secret mysql-secret -o=jsonpath='{.data.username}' | base64 --decode

# 리소스 수정
echo -n 'new-password' | base64

# 특정 부분만 수정
oc patch secret mysql-secret -p='{"data":{"password":"bmV3LXBhc3N3b3Jk"}}'
oc get secret mysql-secret -o=jsonpath='{.data.password}'

# 전체적인 수정
echo -n "redhatuser" | base64

oc edit secret mysql-secret 
# {"data":{"password":"bmV3LXBhc3N3b3Jk"}} 로 수정 

oc get secret mysql-secret -o=jsonpath='{.data.password}'
# password:bmV3LXBhc3N3b3Jk 로변경
	
# secret 리소스 삭제
oc delete secret mysql-secret
```