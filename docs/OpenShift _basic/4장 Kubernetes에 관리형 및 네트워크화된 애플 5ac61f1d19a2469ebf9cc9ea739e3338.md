# 4장. Kubernetes에 관리형 및 네트워크화된 애플리케이션 배포

| 목적 | 애플리케이션을 배포하고 Kubernetes 클러스터 내부 및 외부의 네트워크 액세스에 노출합니다. |
| --- | --- |
| 목표 | • Kubernetes가 수명이 긴 애플리케이션을 관리하는 데 사용하는 주요 리소스와 설정을 확인하고 OpenShift가 일반 애플리케이션 배포 워크플로를 간소화하는 방법을 보여줍니다.
• 컨테이너화된 애플리케이션을 Kubernetes 워크로드 리소스에서 관리하는 포드로 배포합니다.
• Kubernetes 서비스를 사용하여 동일한 클러스터 내의 애플리케이션 포드를 상호 연결합니다.
• Kubernetes 인그레스 및 OpenShift 경로를 사용하여 클러스터 외부의 클라이언트에 애플리케이션을 노출합니다. |

# 템플릿

### 템플릿 이란

- OpenShift 템플릿은 여러 리소스를 한번에 생성하도록 해주는 도구입니다. 템플릿 안에는 YAML 형식으로 리소스를 정의하고, 사용자는 템플릿의 파라미터 값을 제공합니다.
- 템플릿을 사용하면, 애플리케이션 배포를 보다 유연하게 관리할 수 있습니다.
    - 예를 들어, 서비스 계정을 설정하거나 영구적인 스토리지를 사용하거나

```bash
oc create -f <filename> -n <project>
```

### 템플릿 매개변수 표시

```yaml
# oc process -f [TEMPLATE_PATH] -p [PARAMETERS]
oc process -f mysql-template.yaml --parameters
```

### oc new-app

- 새로운 애플리케이션을 생성하고 배포
- 소스 코드, 이미지 또는 템플릿에서 애플리케이션을 생성할 수 있게 해주며, 필요한 빌드 구성, 디플로이먼트 구성, 서비스 등의 리소스도 자동으로 생성 해준다.
- 소스 코드, Docker 이미지 또는 템플릿을 기반으로 애플리케이션을 생성합니다.

**참고**

- **`oc new-app`**은 애플리케이션 생성과 배포를 위한 특수한 작업을 수행하는 도구
- **`oc create`**는 정의된 리소스 정의를 사용하여 새로운 리소스를 생성
- **`oc apply`**는 리소스의 현재 상태를 원하는 상태로 선언적으로 관리하고 업데이트하는 데 사용

**소스 코드로부터 애플리케이션 생성**:

```bash
oc new-app <https://github.com/user/repo.git>
```

이 명령은 주어진 Git 리포지토리에서 소스 코드를 가져와 애플리케이션을 빌드하고 배포한다

**도커 이미지를 사용한 애플리케이션 생성**:

```bash
oc new-app debianmaster/nodejs-nginx:latest~https://github.com/user/repo.git

```

이는 `nodejs-nginx` 이미지를 기반으로 애플리케이션을 빌드하고 배포합니다.

**템플릿을 사용한 애플리케이션 생성**

```bash
oc new-app -f /path/to/template.yaml

```

**주요 옵션**:

- **`-name`: 생성될 애플리케이션의 이름을 지정합니다.**
- **`-strategy`: 빌드 전략을 지정합니다 (예: `source`, `docker`).**
- `-env` (또는 `e`): 환경 변수를 설정합니다.
- `-build-env`: 빌드에 사용될 환경 변수를 설정합니다.
- `-param` (또는 `p`): 템플릿 파라미터를 지정합니다.
- `-dry-run`: 실제로 리소스를 생성하지 않고 어떤 리소스가 생성될지만 확인합니다.

# Temaplate 작성

```yaml
apiVersion: template.openshift.io/v1
kind: Template
metadata:
  name: redis-template
  annotations:
    description: "Description"
    iconClass: "icon-redis"
    tags: "database,nosql"
objects:
- apiVersion: v1
  kind: Pod
  metadata:
    name: redis-master
  spec:
    containers:
    - env:
      - name: REDIS_PASSWORD
        value: ${REDIS_PASSWORD}
      image: dockerfile/redis
      name: master
      ports:
      - containerPort: 6379
        protocol: TCP
parameters:
- description: Password used for Redis authentication
  from: '[A-Z0-9]{8}'
  generate: expression
  name: REDIS_PASSWORD
labels:
  redis: master
```

## `Pod` *Object Definition*

- pod의 필수 필드
    - **metadata.name** : Pod의 이름
    - [**spec.containers.nam](http://spec.containers.name)e: 컨테이너의 고유한 이름**
    - [**spec.containers](http://spec.containers.name).image:**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: registry  # 필수: Pod의 고유한 이름
  namespace: pod-registries  # 선택적: Pod가 생성될 namespace. 지정되지 않으면 'default' namespace에 생성됩니다.
  labels:  # 선택적: 해당 Pod에 할당된 레이블
    deployment: docker-registry-1
    deploymentconfig: docker-registry
  annotations: { ... }  # 선택적: Pod에 대한 추가 정보
spec:
  containers:
  - name: registry  # 필수: 컨테이너의 고유한 이름
    image: openshift/origin-docker-registry:v0.6.2  # 필수: 컨테이너가 사용할 이미지
    ports:  # 선택적: 해당 컨테이너에서 열린 포트
    - containerPort: 5000
    env:  # 선택적: 컨테이너의 환경 변수
    - name: OPENSHIFT_CA_DATA
      value: ...
    volumeMounts:  # 선택적: 볼륨 마운트 포인트
    - mountPath: /registry
      name: registry-storage
  volumes:  # 선택적: 이 Pod에서 사용할 볼륨의 목록
  - emptyDir: {}
    name: registry-storage
  restartPolicy: Always  # 선택적: Pod의 재시작 정책 (기본값은 Always)
```

[About pods - Working with pods | Nodes | OpenShift Container Platform 4.14](https://docs.openshift.com/container-platform/4.14/nodes/pods/nodes-pods-using.html)

## `DeploymentConfig` *Object Definition*

- **OCP 4.14 부터  DeploymentConfig 객체는 사용 중단**
- DeploymentConfig의 필수 필드
    - **`metadata.name`**: DeploymentConfig의 이름.
    - **`spec.template`**: 사용할 포드 템플릿.
    - **`spec.triggers`**: (권장)언제 새로운 배포를 시작할지 결정하는 트리거.

```yaml
apiVersion: apps.openshift.io/v1
kind: DeploymentConfig
metadata:
  name: frontend  # 필수: DeploymentConfig의 고유한 이름
spec:
  template: { ... }  # 필수: 포드 템플릿. 여기에는 spec.containers와 같은 실제 포드 명세가 들어가야 합니다.

  # 아래 섹션들은 선택적이지만, 일반적인 배포에서 유용하게 사용된다. 
  replicas: 5  # 선택적: 원하는 복제본의 수. 기본값은 1입니다.  
  selector:
    name: frontend  # 선택적: 이 배포에 의해 생성된 포드를 선택하기 위한 레이블 선택기
  triggers:
  - type: ConfigChange  # 선택적: 구성 변경을 감지하면 자동으로 새로운 배포를 시작
  - imageChangeParams:  # 선택적: 이미지 스트림의 변경을 감지하면 자동으로 새로운 배포를 시작
      automatic: true
      containerNames:
      - helloworld
      from:
        kind: ImageStreamTag
        name: hello-openshift:latest
    type: ImageChange  
  strategy:
    type: Rolling  # 선택적: 배포 전략. 여기서는 롤링 업데이트 전략을 사용
```

[Understanding deployments - Deployments | Building applications | OpenShift Container Platform 4.14](https://docs.openshift.com/container-platform/4.14/applications/deployments/what-deployments-are.html)

## `Deployment` *Object Definition*

- **`metadata.name`**: Deployment의 이름입니다.
- **`spec.selector`**: 이 선택자는 Deployment가 관리하는 포드를 선택하는 데 사용됩니다.
- **`spec.template`**: 포드 템플릿을 정의하는 부분으로, 여기에는 실제 포드 명세가 포함됩니다.
    - 특히, **`spec.containers`**는 반드시 포함되어야 합니다.

```yaml
apiVersion: apps/v1
kind: Deployment

metadata:
  name: hello-openshift  # 필수: Deployment의 고유한 이름

spec:
  selector:  # 필수: Deployment가 관리할 포드를 선택하는 데 사용되는 선택자
    matchLabels:
      app: hello-openshift

  template:  # 필수: 포드 템플릿
    metadata:
      labels:  # 이 레이블은 위의 'selector'와 일치해야 합니다.
        app: hello-openshift

    spec:
      containers:  # 필수: 포드를 구성하는 하나 이상의 컨테이너 명세
      - name: hello-openshift  # 컨테이너의 이름
        image: openshift/hello-openshift:latest  # 사용할 이미지
        ports:  # 선택적: 해당 컨테이너에서 열린 포트
        - containerPort: 80
```

[Understanding deployments - Deployments | Building applications | OpenShift Container Platform 4.14](https://docs.openshift.com/container-platform/4.14/applications/deployments/what-deployments-are.html)

## `Project` *Object Definition*

- **`metadata.name`**: 프로젝트의 고유한 이름
    
    ```yaml
    apiVersion: project.openshift.io/v1
    kind: Project
    
    metadata:
      name: test  # 필수: 프로젝트의 고유한 이름
    spec:
      finalizers:
      - kubernetes
    ```
    

[Configuring project creation - Projects | Building applications | OpenShift Container Platform 4.14](https://docs.openshift.com/container-platform/4.14/applications/projects/configuring-project-creation.html)

## `Service` *Object Definition*

- **metadata.name**: 서비스의 고유한 이름입니다.
- **spec.selector**: 해당 서비스에 의해 관리되는 Pod들을 식별하는 레이블 selector이다.
- **spec.ports**: 서비스가 리스닝하는 포트 및 해당 포트로 들어오는 트래픽을 전달할 대상 Pod의 포트를 지정하는 목록입니다.
    
    ```yaml
    apiVersion: v1
    kind: Service
    metadata:
      name: docker-registry  # 필수: 서비스의 고유한 이름   
    spec:
      selector:  # 필수: 서비스에 의해 관리되는 Pod들을 식별하는 레이블 선택기                
        docker-registry: default
      clusterIP: 172.30.136.123  # 선택: 서비스의 가상 IP. 지정하지 않으면 자동으로 할당
      ports:
      - nodePort: 0  # 선택: 노드의 특정 포트. 지정하지 않으면 자동으로 할당됩니다.
        port: 5000  # 필수: 서비스가 리스닝하는 포트             
        protocol: TCP  # 선택: 사용할 프로토콜 (기본값은 TCP)
        targetPort: 5000  # 필수: 트래픽을 전달할 대상 Pod의 포트
    ```
    

[Configuring ExternalIPs for services - Configuring ingress cluster traffic | Networking | OpenShift Container Platform 4.14](https://docs.openshift.com/container-platform/4.14/networking/configuring_ingress_cluster_traffic/configuring-externalip.html)

## `PersistentVolumeClaim` *Object Definition*

- **metadata.name**: PVC의 고유한 이름입니다.
- **spec.accessModes**: PVC가 요청하는 데이터 액세스 모드
    - **`ReadWriteOnce`**, **`ReadOnlyMany`**, **`ReadWriteMany`** 등이 있습니다.
- **spec.resources.requests.storage**: PVC가 요청하는 저장소의 양

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: myclaim  # 필수: PVC의 고유한 이름
spec:
  accessModes:  # 필수: PVC가 요청하는 데이터 액세스 모드
    - ReadWriteOnce 
  resources:
    requests:  # 필수: PVC가 요청하는 저장소의 양
      storage: 8Gi 
  storageClassName: gold  # 선택: PVC가 바인딩하려는 PersistentVolume의 StorageClass. 지정하지 않으면 클러스터의 기본 StorageClass를 사용합니다.
status:
  ...
```

[Understanding persistent storage | Storage | OpenShift Container Platform 4.14](https://docs.openshift.com/container-platform/4.14/storage/understanding-persistent-storage.html#persistent-volumes_understanding-persistent-storage)

## `PersistentVolume` *Object Definition*

- **metadata.name**: PV의 고유한 이름
- **spec.capacity.storage**: PV가 제공하는 저장소의 양
- **spec.accessModes**: PV가 지원하는 데이터 액세스 모드입니다.
    - **`ReadWriteOnce`**, **`ReadOnlyMany`**, **`ReadWriteMany`**

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv0001  # 필수: PV의 고유한 이름
spec:
  capacity:
    storage: 5Gi  # 필수: PV가 제공하는 저장소의 양
  accessModes:  # 필수: PV가 지원하는 데이터 액세스 모드
    - ReadWriteOnce 
  persistentVolumeReclaimPolicy: Retain # 선택: PV가 해제될 때 어떻게 처리될지를 지정. 기본값은 Delete
status:
  ...
```

[Understanding persistent storage | Storage | OpenShift Container Platform 4.14](https://docs.openshift.com/container-platform/4.14/storage/understanding-persistent-storage.html#persistent-volume-claims_understanding-persistent-storage)

## Secret *Object Definition*

- **metadata.name**: Secret의 이름
- **type**: Secret의 타입을 지정합니다. **`Opaque`**는 사용자 정의 데이터를 위한 일반적인 타입
- **data** 또는 **stringData**: Secret 데이터를 포함하는 섹션입니다. **`data`**는 base64로 인코딩된 값이며, **`stringData`**는 일반 문자열로 데이터를 제공하며 자동으로 base64로 인코딩된다.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: test-secret  # 필수: Secret의 이름
  namespace: my-namespace  # 선택: Secret의 네임스페이스. 지정하지 않으면 'default'에 생성됩니다.

type: Opaque  # 필수: Secret의 타입. Opaque는 사용자 정의 데이터를 위한 타입입니다.
data: 
# 필수: base64로 인코딩된 데이터 값. key 이름은 DNS_SUBDOMAIN 형식을 따라야 합니다.
  username: dmFsdWUtMQ0K
  password: dmFsdWUtMg0KDQo=
stringData:
# 필수: 일반 텍스트로 데이터를 제공하면, 이 값은 자동으로 base64로 인코딩됩니다.
  hostname: myapp.mydomain.com  
```

[Providing sensitive data to pods by using secrets - Working with pods | Nodes | OpenShift Container Platform 4.14](https://docs.openshift.com/container-platform/4.14/nodes/pods/nodes-pods-secrets.html)

- **Kubernetes와 RHOCP**:
    - 
    - 일부 명령어는 기본 Kubernetes의 일부이며, 일부는 RHOCP에만 추가됨.

# **리소스 관리 명령**

- 클러스터 리소스를 생성하고 수정하기 위한 많은 명령어 제공.
- **선언형 (Declarative)**: 클러스터가 일치하려고 하는 상태를 정의.
- **명령형 (Imperative)**: 클러스터가 어떻게 동작해야 하는지 지시.

### **명령형 리소스 관리**

- **create 명령어**:
    - oc와 kubectl 모두에 포함.
    - 리소스 생성에 사용.
    
    ```yaml
    oc create deployment my-app --image example.com/my-image:dev
    ```
    
- **set 명령어**:
    - 리소스의 속성, 예: 환경 변수, 정의에 사용.
    
    ```yaml
    oc set env deployment/my-app TEAM=red
    ```
    
- **run 명령어**:
    - 리소스를 생성하는 또 다른 방법.
    
    ```yaml
    oc run example-pod ...
    ```
    
- 명령형 명령의 특징
    - 파드 객체 정의가 필요 없으므로 파드를 빠르게 생성.
    - **버전 관리나 점진적인 파드 정의 변경**이 불가능.
- 개발시 장점
    - 명령형 명령어로 배포를 테스트하고,
    - 파드 객체 정의를 생성하기 위해 명령형 명령어를 사용.
- `-dry-run=client` 옵션
    - 리소스를 클러스터에 생성하지 않고 명령이 어떻게 실행될지 미리 보려고 할 때 사용
    - 정의 포맷을 구성하기 위해 `o yaml` 또는 `o json` 옵션 사용.
    
    ```yaml
    [user@host ~]$ oc run example-pod \
    										--image=registry.access.redhat.com/ubi8/httpd-24 \
    										--env GREETING='Hello from the awesome container' \
    										--port 8080 \
    										--dry-run=client -o yaml
    ```
    

### **선언형 리소스 관리**

- **create 명령어**:
    - 매니페스트를 제공하면, YAML 파일에 정의된 리소스를 선언적으로 생성.
    
    ```yaml
    oc create -f my-app-deployment.yaml
    ```
    
- **RHOCP의 new-app 명령어**:
    - 리소스를 생성하기 위한 또 다른 선언형 방법.
    - 지정된 매개 변수를 기반으로 어떤 종류의 리소스를 생성할지 자동으로 결정.
    
    ```yaml
    oc new-app ---file=./example/my-app.yaml
    ```
    
- **선언형 관점에서의 new-app 명령어**:
    - 리소스 관리를 위한 템플릿과 함께 사용 가능.
    - 템플릿은 애플리케이션이 실행되기 위해 생성되어야 하는 리소스의 의도된 상태를 설명.
    
    ```yaml
    oc new-app --template mysql-persistent ...
    ```
    
    - new-app 명령어에는 애플리케이션 배포를 선언적으로 사용자 정의하는 옵션이 포함됨.
        - 예: `-param` 옵션으로 템플릿의 매개 변수 값을 재정의.
- **명령형 관점에서의 new-app 명령어**:
    - 컨테이너 이미지와 함께 new-app을 사용하면 클러스터에 무엇을 해야 하는지 지시.
    
    ```yaml
    oc new-app --image example.com/my-app:dev
    ```
    
- **Git 저장소 제공**:
    - new-app 명령어에 Git 저장소를 제공 가능.
    
    ```yaml
    oc new-app https://github.com/apache/httpd.git#2.4.56
    ```