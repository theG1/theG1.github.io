---
layout: default
title: 2-1. Kubernetes 리소스 검사
nav_order: 8
parent: Redhat OpenShift
has_children: true
---

# 2-1 Kubernetes 리소스 검사

# **OpenShift 리소스 유형**

- **`포드(pod)` :** IP 주소 및 영구저장장치 볼륨 등의 리소스를 공유하는 Container Collection.
    - Pod는 OpenShift의 기본 작업 단위입니다.
- **`서비스(svc)` :** Pod pull ****에 대한 액세스를 제공하는 특정 IP/포트 조합입니다.
    - 기본적으로 서비스는 Round-robin 방식으로 클라이언트를 포드에 연결합니다.
- **`ReplicationController(rc)` :** Pod가 다양한 노드에 복제(수평으로 확장)되는 방법을 정의하는 OpenShift 리소스입니다.
    - ReplicationController는 Pod 및 Container에 고가용성을 제공하는 기본 OpenShift 서비스입니다.
- **`영구적 볼륨(pv)` :** pod 에서 사용할 스토리지 영역입니다.
- **`영구 볼륨 클레임(pvc)` :** Pod별 스토리지 요청.
    - `pvc`는 해당 컨테이너가 일반적으로 컨테이너의 파일 시스템에 스토리지를 마운트하여 사용할 수 있도록 `pv`를 포드에 연결한다.
- **`ConfigMap(cm)` :** 다른 리소스에서 사용할 수 있는 일련의 키와 값입니다.
    - ConfigMaps 및 Secrets는 일반적으로 여러 리소스에서 사용되는 구성 값을 중앙에서 관리할수 있도록 한다.
    - Secrets는 Secrets가 민감한 데이터를 저장하는 데 사용되고(일반적으로 암호화됨) 액세스 권한이 소수의 허가된 사용자로 제한된다는 점에서 ConfigMaps 맵과 다르다.
- **`BuildConfig(bc)` :** OpenShift 프로젝트에서 실행할 프로세스이다.
    - OpenShift *S2I(Source-to-Image)* 기능에서는 BuildConfigs를 사용하여 Git 리포지토리에 저장된 애플리케이션 소스 코드에서 컨테이너 이미지를 빌드합니다.
    - `bc`는 `dc`와 공동으로 작업하여 기본적이지만 확장 가능한 지속적 통합 및 지속적 제공 워크플로우를 제공합니다.
- **`Route`:** OpenShift 라우터에서 클러스터에 배포된 다양한 애플리케이션 및 마이크로서비스의 진입 지점으로 인식하는 DNS 호스트 이름입니다.
- **`DeploymentConfig(DC)와 Deployment` : Pod** 에 포함된 Container 집합 및 사용할 배포 전략.
    - **`Deployment`** 오브젝트는 OpenShift에서 권장하는 기본 교체 항목이지만, **`DeploymentConfig`**의 특정 기능이 필요한 경우에는 여전히 사용 가능하다
    - **`Deployment` 오브젝트의 특징**:
        - 자동 롤백 기능이나 라이프사이클 후크를 지원하지 않습니다.
        - 포드 템플릿을 변경할 때마다 새로운 롤아웃이 자동으로 시작됩니다.
        - 배포 중에도 프로세스를 일시 중지할 수 있습니다.
        - 원하는 만큼의 활성 복제본 집합을 유지할 수 있고, 이전 복제본을 줄일 수 있습니다.
    - **`DeploymentConfig` 오브젝트의 특징**:
        - 동시에 두 개의 복제본 집합만 활성화될 수 있습니다.
        - OpenShift 4.12에서도 특정 기능이 필요할 때 계속 사용할 수 있습니다.
    - **새 애플리케이션 생성 시의 차이점**:
        - **`Deployment`** 오브젝트를 사용하려면 특별한 플래그 없이 배포를 시작할 수 있습니다.
        - **`DeploymentConfig`** 오브젝트를 사용하려면 **`-as-deployment-config`** 플래그를 사용하여 명시적으로 DC를 지정해야 합니다.

# 쿠버네티스 리소스 조사

- OpenShift 클러스터에서 이해하는 리소스에 대한 정보 제공
    - `oc api-resources` : 명령어는 사용 가능한 모든 API 리소스를 나열
        - OpenShift 또는 Kubernetes 클러스터에서 사용 가능한 모든 리소스 유형(예: pods, services, deployments 등)의 훑어보기를 제공
- OC api-resources의 결과 분석
    
    ```bash
    [user@host ~]$ oc api-resources
    NAME                    SHORTNAMES   APIVERSION   NAMESPACED   KIND
    bindings                             v1           true         Binding
    componentstatuses       cs           v1           false        ComponentStatus
    configmaps              cm           v1           true         ConfigMap
    ...
    ```
    
    - **NAME**: 리소스의 복수형 이름.
    - **SHORTNAMES**: 리소스에 대한 짧은 이름 (만약 있으면).
    - **APIVERSION :** API 공급자를 나타냅니다
    - **NAMESPACED**: 리소스가 namespace에 종속적인지 여부를 나타냅니다.
    - **KIND**: 해당 리소스의 종류를 나타낸다.

| 옵션 예 | 설명 |
| --- | --- |
| --namespaced=true | false인 경우 네임스페이스 비지정 리소스를 반환하고, 그렇지 않으면 네임스페이스 지정 리소스를 반환합니다. |
| --api-group apps | 지정된 API 그룹의 리소스로 제한합니다. 핵심 리소스를 표시하려면 --api-group='' 를 사용합니다. |
| --sort-by name | 비어 있지 않은 경우 지정된 필드를 사용하여 리소스 목록을 정렬합니다. 필드는 'name' 또는 'kind'일 수 있습니다. |

```bash
[user@host ~]$ oc api-resources --namespaced=true --api-group apps --sort-by name
NAME                  SHORTNAMES   APIVERSION   NAMESPACED   KIND
controllerrevisions                apps/v1      true         ControllerRevision
daemonsets            ds           apps/v1      true         DaemonSet
deployments           deploy       apps/v1      true         Deployment
replicasets           rs           apps/v1      true         ReplicaSet
statefulsets          sts          apps/v1      true         StatefulSet
```

# 리소스 구조

## **리소스 필드**

- 쿠버네티스는 다양한 리소스 타입을 제공하며, 각 리소스 타입마다 고유한 필드와 속성이 존재 한다 일반적인 사용 필드를 확인해보면 다음과 같다.
- **apiVersion**:
    - **설명**: 사용 중인 쿠버네티스 API 버전을 나타냅니다.
    - **예시**: **`v1`**, **`apps/v1`**, **`extensions/v1beta1`** 등
- **kind**:
    - **설명**: 생성하려는 리소스의 종류를 나타냅니다.
    - **예시**: **`Pod`**, **`Service`**, **`Deployment`**, **`Ingress`** 등
- **metadata**:
    - **name**: 리소스의 고유한 이름.
    - **namespace**: 리소스가 속하는 네임스페이스.
    - **labels**: 리소스를 분류하기 위한 키-값 쌍.
    - **annotations**: 임의의 비-식별 메타데이터. 추가적인 정보나 주석 등을 기록하는데 사용됩니다.
- **spec**:
    - **설명**: 리소스의 원하는 상태와 관련된 세부 사항 및 설정을 포함합니다. **`spec`** 필드의 내용은 리소스의 **`kind`**에 따라 다릅니다.
    - **예시**: Pod의 경우 **`containers`**, **`volumes`** 등의 필드를 포함할 수 있습니다.
- **status**:
    - **설명**: 리소스의 현재 상태와 관련된 정보를 포함합니다. 일반적으로 시스템에 의해 업데이트됩니다.
    - **예시**: Pod의 경우 **`phase`**, **`conditions`**, **`hostIP`** 등의 필드를 포함할 수 있습니다.

```yaml
apiVersion: v1 # 오브젝트 스키마 버전의 식별자
kind: Pod  # 스키마 식별자입니다. 이 예에서 오브젝트는 포드 스키마를 따릅니다.
metadata: # 주석, 레이블, 이름, 네임스페이스 등 지정된 리소스에 대한 메타데이터입니다.
  name: wildfly  # 관리자가 명령을 실행할 수 있는 Kubernetes 내 포드의 고유한 이름입니다.
  namespace: my_app # 리소스가 있는 네임스페이스 또는 RHOCP 프로젝트
  labels:
    name: wildfly  # name 키로 레이블을 생성합니다.
spec: # 포드 오브젝트 구성 또는 의도된 리소스 상태를 정의합니다.
  containers:
    - resources:
        limits:
          cpu: 0.5
      image: quay.io/example/todojee:v1 # 컨테이너 이미지 이름을 정의
      name: wildfly # 포드 내부의 컨테이너 이름입니다. 
										# 컨테이너 이름은 포드에 컨테이너가 여러 개 있는 경우 oc 명령에 중요합니다.
      ports:
        - containerPort: 8080  # 컨테이너에서 사용하는 포트를 식별하는 컨테이너 종속 속성입니다.
          name: wildfly
      env:  # 환경 변수의 컬렉션을 정의합니다.
        - name: MYSQL_DATABASE
          value: items
        - name: MYSQL_USER
          value: user1
        - name: MYSQL_PASSWORD
          value: mypa55
...object omitted...
status: # 현재 오브젝트 상태입니다. 
				# 이 필드는 Kubernetes에서 제공하며 런타임 상태, 준비 상태, 컨테이너 이미지 등의 정보를 
				# 나열합니다.
  conditions:
  - lastProbeTime: null
    lastTransitionTime: "2022-08-19T12:59:22Z"
    status: "True"
    type: PodScheduled
```

## 리소스 정보 확인

- **`oc explain`** : 리소스의 **정의와 구조**에 대한 정보를 제공
- **`oc describe`:** 특정 리소스 인스턴스의 **상세 상태와 이벤트**에 대한 정보를 제공
- **`oc get -o yaml`**: 리소스의 **현재 구성**을 YAML 형식으로 출력

### `oc explain`

- 특정 Kubernetes **리소스의 정의**, 구조, 필드에 대한 설명을 제공한다.
    - 리소스에 대한 설명서나 문서화된 내용을 확인하고자 할 때 유용하다.
- **리소스 인스턴스에 독립적**: 클러스터 내의 특정 인스턴스에 종속되지 않은 리소스 유형의 일반적인 설명을 제공한다.
    - **`oc explain pods`**는 Pod 리소스에 대한 일반적인 정보와 필드 설명을 제공
    
    ```bash
    oc explain pods
    oc explain pods.spec
    oc explain pods.spec.containers
    ```
    

### `oc describe`

- 클러스터 내의 특정 Kubernetes 리소스 인스턴스에 대한 상세 정보를 제공
    - 특정 리소스의 문제 해결, 이벤트, 현재 상태, 설정 확인등에 사용된다.
- **리소스 인스턴스에 종속적:** 특정 Pod, 서비스, 노드 의 상태, 구성 및 기타 중요한 세부 정보를 확인하는 데 유용하다
    
    ```bash
    # **특정 리소스의 세부 정보 확인**
    oc describe pod <pod-name>
    
    # **특정 네임스페이스의 리소스 세부 정보 확인**
    *oc describe pod <pod-name> -n <namespace>
    
    #* **다른 리소스 유형에 대한 세부 정보 확인**
    **oc describe svc <service-name>
    oc describe deployment <deployment-name>
    ```
    

## `oc get`

- 하나 또는 그 이상의 리소스 인스턴스의 기본 정보(예: 상태, IP 주소, 생성 시간 등)를 표 형태로 제공
- 시스템에서 실행 중인 리소스의 목록을 빠르게 확인하거나, 리소스의 기본 상태를 검색할 때 사용
    
    ```bash
    # 현재 네임스페이스의 모든 Pod를 나열
    oc get pods
    
    # **특정 네임스페이스의 리소스 나열**
    oc get pods -n <namespace>
    
    # **다른 리소스 유형 나열**
    oc get svc
    oc get deployment
    
    ```
    
- 출력 형식 지정
    - `o` 또는 `-output` 옵션은 출력 형식을 지정하는 데 사용됩니다. 이를 사용하면 결과를 다양한 형식으로 가져올 수 있다
    - **YAML 형식으로 출력**:
        
        ```bash
        oc get pod <pod-name> -o yaml
        
        # yq 를 이용한 특정 데이터 출려
        oc get pods -o yaml | yq r - 'items[0].status.podIP'
        
        ```
        
    - **JSON 형식으로 출력**:
        
        ```bash
        oc get pod <pod-name> -o json
        
        # jq를 이용한 특정 데이터 출력
        oc get pods -o json | jq '.items[0].status.podIP'
        ```
        
- oc get 출력 해석

| oc get pods | oc get pods -o wide | Example value |
| --- | --- | --- |
| NAME | NAME | example-pod |
| READY | READY | 1/2 |
| STATUS | STATUS | Running |
| RESTARTS | RESTARTS | 5 |
| AGE | AGE | 11d |
|  | IP | 10.8.0.60 |
|  | NODE | master01 |
|  | NOMINATED NODE | <none> |
|  | READINESS GATES | <none> |

- NAME
    - Pod의 이름은 클러스터 내에서 고유하며, 사용자가 Pod를 식별하는 데 사용된다
- READY
    - Pod에서 실행 중인 컨테이너의 수와 총 컨테이너 수를 나타냅니다. 예를 들어, `2/2`는 2개의 컨테이너가 모두 실행 중임을 의미한다
    - **예**: 2/2 (2개의 컨테이너중 2개가 실행 중)
- STATUS
    - Pod의 현재 상태를 나타낸다.
        - **Pending**: Pod가 스케줄링 되었으나 아직 모든 컨테이너가 시작되지 않은 상태.
        - **Running**: 모든 컨테이너가 성공적으로 시작되어 실행 중인 상태.
        - **Succeeded**: Pod 내의 모든 컨테이너가 성공적으로 종료된 상태.
        - **Failed**: 하나 이상의 컨테이너가 실패하여 종료된 상태.
        - **Unknown**: Pod의 상태를 알 수 없는 경우.
    - **예**: Running (Pod가 정상적으로 실행 중)
- RESTARTS
    - Pod 내의 컨테이너가 재시작된 횟수를 나타낸다. 이 값은 문제가 발생했거나 컨테이너가 재시작된 경우 증가
    - **예**: 5 (컨테이너가 5번 재시작됨)
- AGE
    - Pod이 생성된 후 경과한 시간
    - **예시**: 11d (Pod가 11일 전에 생성됨)
- IP
    - Pod의 클러스터 내부 IP 주소
    - **예시**: 10.8.0.60 (Pod의 IP 주소)
- NODE
    - Pod가 실행 중인 노드의 이름
    - **예시**: master01 (Pod가 master01 노드에서 실행 중)
- NOMINATED NODE
    - Pod가 향후 실행될 예약된 노드의 이름. 사용되지 않거나 예약된 노드가 없으면 `<none>`으로 표시됩니다.
    - **예시**: <none> (예약된 노드 없음)
- READINESS GATES
    - Pod가 준비 상태를 결정하기 위해 사용하는 게이트입니다. 보통은 `<none>`으로 표시된다
    - **예시**: <none> (Readiness 게이트 없음)

# 예: 트러블 슈팅

- 1개의 pod 에 2개의 container 가 실행되고 그중 하나는 실패

```bash
oc new-project my-nginx-project
```

### Step 1: Pod YAML 파일 작성

- `troubleshooting-pod.yaml` 파일을 작성

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: troubleshooting-pod
spec:
  containers:
  - name: nginx
    image: quay.io/redhattraining/hello-world-nginx
    ports:
    - containerPort: 80
  - name: failing-container
    image: quay.io/quay/busybox:latest
    command: ["sh", "-c", "echo 'Simulating failure'; sleep 5; exit 1"]
```

### Step 2: Pod 생성

- 작성한 YAML 파일을 사용하여 Pod를 생성

```bash
oc create -f troubleshooting-pod.yaml -n my-nginx-project
```

### Step 3: Pod 상태 확인

- Pod의 상태를 확인합니다.

```bash
oc get pods -n my-nginx-project

NAME                   READY   STATUS             RESTARTS   AGE
troubleshooting-podnew 1/2     Error                4          2m
```

### Step 4: Pod 설명 및 이벤트 확인

Pod의 상세 정보와 이벤트 로그를 확인합니다.

```bash
oc describe pod troubleshooting-pod -n my-nginx-project
```

```bash
Name:           troubleshooting-pod
Namespace:      my-nginx-project
    ...
  failing-container:
    Container ID:  cri-o://36846e07931f1e6a3966b341fc9bf65259fc0ad77af336863f99ec207ef5e693
    Image:         quay.io/quay/busybox:latest
    Image ID:      quay.io/quay/busybox@sha256:92f3298bf80a1ba949140d77987f5de081f010337880cd771f7e7fc928f8c74d
    Port:          <none>
    Host Port:     <none>
    Command:
      sh
      -c
      echo 'Simulating failure'; sleep 5; exit 1
    **State:          Waiting
      Reason:       CrashLoopBackOff
    Last State:     Terminated
      Reason:       Error
      Exit Code:    1
      Started:      Mon, 05 Aug 2024 07:31:41 -0400
      Finished:     Mon, 05 Aug 2024 07:31:46 -0400
    Ready:          False
    Restart Count:  4**
    ...
Conditions:
  Type              Status
  Initialized       True
  Ready             False
  ContainersReady   False
  PodScheduled      True
...
Events:
  Type     Reason          Age                  From               Message
  ----     ------          ----                 ----               -------
  Normal   Scheduled       2m29s                default-scheduler  Successfully assigned my-nginx-project/troubleshooting-pod to master01
  ...
  Warning  BackOff         59s (x5 over 2m8s)   kubelet            Back-off restarting failed container failing-container in pod troubleshooting-pod_my-nginx-project
```

### Step 5: 비정상 컨테이너 로그 확인

비정상적으로 동작하는 컨테이너의 로그를 확인합니다.

```bash
oc logs troubleshooting-pod -c failing-container -n my-nginx-project

Simulating failure
```

### Step 6: 정상 컨테이너 로그 확인

정상적으로 동작하는 Nginx 컨테이너의 로그도 확인할 수 있습니다.

```bash
oc logs troubleshooting-pod -c nginx -n my-nginx-project

<응답없음>
```

### 문제 해결 방법

- `failing-container`가 의도적으로 실패하도록 설정된 것을 확인.
- YAML 파일에서 `failing-container`의 명령을 수정하여 정상적으로 동작하도록 수정하자

### 수정된 Pod YAML 파일

`troubleshooting-pod.yaml` 파일을 수정

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: troubleshooting-pod
spec:
  containers:
  - name: nginx
    image: quay.io/redhattraining/hello-world-nginx
    ports:
    - containerPort: 80
  - name: failing-container
    image: quay.io/quay/busybox:latest
    command: ["sh", "-c", "echo 'Running'; while true; do sleep 3600; done"]
```

### 수정된 Pod 적용

수정된 YAML 파일을 적용하여 Pod를 업데이트

```bash
oc delete pod troubleshooting-pod -n my-nginx-project # pod 삭제후 재배포
oc apply -f troubleshooting-pod.yaml
```

### 상태 확인

Pod가 정상적으로 동작하는지 확인합니다.

```bash
oc get pods -n my-nginx-project
oc describe pod troubleshooting-pod -n my-nginx-project
oc logs troubleshooting-pod -c failing-container -n my-nginx-project
```