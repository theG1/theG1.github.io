---
layout: default
title: 6-3 Limit Compute Capacity for Applications (1)
nav_order: 23
parent: Redhat OpenShift
has_children: true
---


# 6-3 Limit Compute Capacity for Applications (1)

# OpenShift에서 애플리케이션을 위한 컴퓨팅 용량 제한

## 리소스 요청과 제한의 차이점

- 리소스 요청(Requests)
    - 애플리케이션 배포에서 요청하는 리소스.
    - 예시: CPU 요청이 100m(밀리코어)인 경우, 이는 전체 코어의 1/10을 의미함.
- 리소스 제한(Limits)
    - 애플리케이션이 확장될 수 있는 최대 리소스.
    - 예시: CPU 제한이 250m(밀리코어)인 경우, 이는 전체 코어의 1/4을 의미함.

## 리소스 요청 및 제한의 설정

- 리소스 요청은 Kubernetes 스케줄러가 해당 파드를 노드에 스케줄링하는 데 사용됨.
- 파드는 요청된 리소스보다 더 많은 리소스를 사용할 수 있으며, 이때 리소스 제한이 중요함.
- 메모리 및 CPU에 대한 요청과 제한을 설정해야 함.

## 커널 네임스페이스와 컨트롤 그룹

- 커널 네임스페이스
    - 컨테이너는 커널 네임스페이스에서 실행됨.
    - 이미지의 파일이 네임스페이스 내부에 배포됨.
- 컨트롤 그룹 (Control Groups, cgroups)
    - 리소스 제한을 구현하기 위해 사용됨.
    - 파드가 설정된 메모리 제한을 초과하면 OOM(Out of Memory) 킬러에 의해 프로세스가 종료됨.

## 리소스 제한 설정 예시

### 명령어를 사용한 설정

```bash
oc set resources deployment/my-deployment --limits=memory=512Mi,cpu=200m --requests=memory=256Mi,cpu=100m

oc get -o json deployment/my-deployment | jq .spec.template.spec.containers[].resources
```

### YAML 파일을 사용한 설정

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-container
        image: my-image
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "200m"

```

## 리소스 사용 모니터링

- 노드 활용도 확인
    
    ```bash
    oc adm top node <node_name>
    ```
    
- 프로젝트 내 파드 리소스 사용량 확인
    
    ```bash
    oc adm top pods -n <project_name>
    ```
    
- 노드 세부 정보 설명
    
    ```bash
    oc describe node <node_name> | less
    ```
    

## 웹 콘솔을 통한 설정

- 관리자 관점에서 설정
    1. Workloads > Deployments로 이동.
    2. 편집할 Deployments 선택 후 Actions > Edit resource limits 선택.
    3. 요청 및 제한 값을 입력하고 저장.
- 개발자 관점에서 설정
    1. Developer 드롭다운 선택 후 프로젝트 선택.
    2. 배포 선택 후 Actions > Edit resource limits 선택.
    3. 요청 및 제한 값을 입력하고 저장.

## 리소스 제한 설정의 중요성

- 메모리 제한
    - 컨테이너가 설정된 메모리 제한을 초과하면 OOM 킬러에 의해 프로세스가 종료됨.
    - 메모리 누수가 있는 애플리케이션의 경우 메모리 제한을 설정하여 시스템의 모든 메모리가 소비되지 않도록 함.
    - 제한 설정 예시:
        
        ```bash
        oc set resources deployment/hello --limits=memory=1Gi
        ```
        
        ```yaml
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: hello
        spec:
          containers:
          - image: registry.access.redhat.com/ubi9/nginx-120:1-86
            name: hello
            resources:
              requests:
                cpu: 100m
                memory: 500Mi
              limits:
                cpu: 200m
                memory: 1Gi
        
        ```
        
- CPU 제한
    - 컨테이너가 설정된 CPU 제한에 도달하면 RHOCP는 컨테이너의 프로세스를 억제함.
    - 일관된 애플리케이션 동작을 위해 CPU 제한을 설정해야 함.
    - 제한 설정 예시:
        
        ```bash
        oc set resources deployment/hello --limits=cpu=200m
        
        ```
        
        ```yaml
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: hello
        spec:
          containers:
          - image: registry.access.redhat.com/ubi9/nginx-120:1-86
            name: hello
            resources:
              requests:
                cpu: 100m
                memory: 500Mi
              limits:
                cpu: 200m
                memory: 1Gi
        
        ```
        

## 리소스 요청, 제한 및 실제 사용량 보기

- `oc describe node` 명령을 사용하여 노드의 자세한 정보를 확인할 수 있음.
- `oc adm top` 명령을 사용하여 리소스 사용량을 확인할 수 있음.
    
    ```bash
    oc adm top nodes
    oc adm top pods -n <project_name>
    
    ```
    

이러한 지침을 따르고 적절한 명령어 및 구성을 사용하면 OpenShift 환경 내에서 애플리케이션을 효율적으로 배포하고 리소스 요청 및 제한에 대한 모범 사례를 준수할 수 있습니다.