---
layout: default
title: 7-5. OpenShift 이미지 스트림
nav_order: 52
parent: Redhat OpenShift
---

# 7-5 OpenShift 이미지 스트림으로 재현 가능한 배포 (1)

# OpenShift 이미지 스트림을 통한 재현 가능한 배포

## 목표

- 이미지 스트림과 짧은 이미지 이름을 사용하여 애플리케이션 배포의 재현 가능성을 보장.

## 이미지 스트림

- 안정적이고 재현 가능한 배포 및 롤백 기능 제공.
- 부동 태그(floating tag)와 비부동 태그(non-floating tag) 구분은 관습에 불과함.
- 레지스트리 서버 및 컨테이너 런타임 구성과 독립적인 컨테이너 이미지를 참조할 수 있는 안정적인 짧은 이름 제공.
- 파드가 동일한 이미지 ID를 참조하여 일관성 보장.

## 이미지 스트림 태그

- 하나 이상의 컨테이너 이미지 집합을 나타냄.
- 기본 구성을 제공하지만 각 태그에서 재정의 가능.
- 이미지 ID 기록을 사용하여 이전 이미지로 롤백 가능.
- 현재 컨테이너 이미지에 대한 메타데이터 저장(SHA 이미지 ID 포함).
- 소스 이미지 레이어를 OpenShift 내부 컨테이너 레지스트리에 저장하여 로컬 캐시로 사용할 수 있음.

## 이미지 이름, 태그 및 ID

- 컨테이너 이미지 이름은 여러 구성 요소로 이루어진 문자열.
- SHA 이미지 ID는 불변의 컨테이너 이미지를 고유하게 식별.
- OpenShift 이미지 스트림 태그는 가져온 최신 이미지 ID 기록을 유지.
- 이미지 스트림 태그는 외부 레지스트리의 새로운 이미지로 자동 업데이트되지 않음; 수동 업데이트 필요.
- 정의된 일정에 따라 업데이트 확인하도록 이미지 스트림 태그를 구성할 수 있음.

![Untitled](7-5%20OpenShift%20%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5%20%E1%84%89%E1%85%B3%E1%84%90%E1%85%B3%E1%84%85%E1%85%B5%E1%86%B7%E1%84%8B%E1%85%B3%E1%84%85%E1%85%A9%20%E1%84%8C%E1%85%A2%E1%84%92%E1%85%A7%E1%86%AB%20%E1%84%80%E1%85%A1%E1%84%82%E1%85%B3%E1%86%BC%E1%84%92%E1%85%A1%E1%86%AB%20%E1%84%87%E1%85%A2%20fae4900f07de45d2a4c37882495e139f/Untitled.png)

## 이미지 스트림 및 태그 생성

- `oc create is` 명령을 사용하여 이미지 스트림 생성.

```bash
oc create is keycloak
```

- `oc create istag` 명령을 사용하여 이미지 스트림 태그 추가.

```bash
oc create istag keycloak:20.0 --from-image quay.io/keycloak/keycloak:20.0.2
```

- `oc tag` 명령을 사용하여 새로운 이미지 참조로 이미지 스트림 태그 업데이트.

```bash
oc tag quay.io/keycloak/keycloak:20.0.3 keycloak:20.0
```

## 주기적으로 이미지 스트림 태그 가져오기

- 기본적으로 이미지 스트림 태그는 자동으로 업데이트되지 않음.
- `oc tag` 명령의 `-scheduled` 옵션을 사용하여 주기적 업데이트 구성.

```bash
oc tag quay.io/keycloak/keycloak:20.0.3 keycloak:20.0 --scheduled

```

## 이미지 풀-스루 구성

- `oc tag` 명령의 `-reference-policy local` 옵션을 사용하여 이미지 스트림 태그를 활성화하여 OpenShift 내부 컨테이너 레지스트리에 이미지를 캐시.

```bash
oc tag quay.io/keycloak/keycloak:20.0.3 keycloak:20.0 --reference-policy local

```

## 배포에서 이미지 스트림 사용

- 배포 객체에서 컨테이너 이미지 대신 이미지 스트림을 지정.
- `oc set image-lookup` 명령으로 로컬 조회 정책 활성화.

```bash
oc set image-lookup keycloak

```

- 배포 객체에서 이미지 스트림 태그 이름으로 참조.

```bash
oc create deployment mykeycloak --image keycloak:20.0

```

- 예시 배포 구성

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mykeycloak
spec:
  replicas: 2
  selector:
    matchLabels:
      app: mykeycloak
  template:
    metadata:
      labels:
        app: mykeycloak
    spec:
      containers:
      - name: mykeycloak
        image: keycloak:20.0
        ports:
        - containerPort: 8080

```

- 이미지 조회 정책 상태 확인

```bash
oc describe is keycloak

```

- 프로젝트 내 이미지 스트림 태그 목록

```bash
oc get istag -n openshift | grep php

```

- 샘플 이미지 스트림 YAML 구성

```yaml
apiVersion: image.openshift.io/v1
kind: ImageStream
metadata:
  name: keycloak
spec:
  lookupPolicy:
    local: true

```

- 주기적 업데이트 구성

```bash
oc tag quay.io/keycloak/keycloak:20.0.3 keycloak:20.0 --scheduled

```

- 이미지 조회 정책 설정

```bash
oc set image-lookup keycloak --enabled=false

```

- 배포에서 이미지 스트림 구성 예시

```bash
oc create deployment mykeycloak --image keycloak:20.0
oc set image-lookup keycloak

```

## 상세 예제

### 이미지 스트림 생성 및 관리

1. **이미지 스트림 생성**: `keycloak`이라는 이름의 이미지 스트림 생성.
    
    ```bash
    oc create is keycloak
    
    ```
    
2. **이미지 스트림 태그 추가**: `keycloak` 이미지 스트림에 `20.0` 태그 추가.
    
    ```bash
    oc create istag keycloak:20.0 --from-image quay.io/keycloak/keycloak:20.0.2
    
    ```
    
3. **이미지 스트림 태그 업데이트**: `keycloak:20.0` 이미지 스트림 태그를 새로운 이미지로 업데이트.
    
    ```bash
    oc tag quay.io/keycloak/keycloak:20.0.3 keycloak:20.0
    
    ```
    
4. **로컬 조회 정책 활성화**: 이미지 스트림 태그를 로컬에서 확인할 수 있도록 설정.
    
    ```bash
    oc set image-lookup keycloak
    
    ```
    
5. **배포 생성**: 이미지 스트림 태그를 사용하여 배포.
    
    ```bash
    oc create deployment mykeycloak --image keycloak:20.0
    
    ```
    
6. **주기적 업데이트 구성**: 이미지 스트림 태그를 주기적으로 업데이트 확인하도록 설정.
    
    ```bash
    oc tag quay.io/keycloak/keycloak:20.0.3 keycloak:20.0 --scheduled
    
    ```
    
7. **이미지 풀-스루 활성화**: 이미지를 OpenShift 내부 레지스트리에 캐시하도록 설정.
    
    ```bash
    oc tag quay.io/keycloak/keycloak:20.0.3 keycloak:20.0 --reference-policy local
    
    ```
    
8. **구성 확인**: 이미지 스트림 및 태그의 상태와 세부 정보 확인.
    
    ```bash
    oc describe is keycloak
    
    ```
    

### 구성 파일 예제

- **배포 YAML 구성**:
    
    ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: mykeycloak
    spec:
      replicas: 2
      selector:
        matchLabels:
          app: mykeycloak
      template:
        metadata:
          labels:
            app: mykeycloak
        spec:
          containers:
          - name: mykeycloak
            image: keycloak:20.0
            ports:
            - containerPort: 8080
    
    ```
    
- **이미지 스트림 YAML 구성**:
    
    ```yaml
    apiVersion: image.openshift.io/v1
    kind: ImageStream
    metadata:
      name: keycloak
    spec:
      lookupPolicy:
        local: true
    
    ```