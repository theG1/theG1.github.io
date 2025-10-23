---
layout: default
title: 4-3. Kubernetes Workload API
nav_order: 27
parent: Redhat OpenShift
---

# 4-3 Kubernetes Workload API를 사용하여 장기 및 단기 애플리케이션 관리

# **Kubernetes Workload Resources**

## **Workload**

[About Workloads APIs - Workloads APIs | API reference | OpenShift Container Platform 4.14](https://docs.openshift.com/container-platform/4.14/rest_api/workloads_apis/workloads-apis-index.html)

[Workloads](https://kubernetes.io/docs/concepts/workloads/)

- 워크로드란
    - 워크로드는 Kubernetes클러스터 내의 파드에서 실행되는 애플리케이션 또는 프로세스를 나타냅니다.
    - 목적: 서비스 제공, 배치 처리, 데이터 처리 등 다양한 업무를 처리하기 위해 사용됩니다.
- 워크로드의 종류
    - Deployment, DaemonSet, StatefulSet, Job, CronJob
- 워크로드 API
    - 워크로드를 생성, 관리, 삭제하기 위해 Kubernetes가 제공하는 API 집합입니다.
    - 워크로드 API는 파드의 생명주기, 상태, 설정 등을 관리합니다.

- **Job**
    - **`Job`**은 일회성 작업을 실행하는데 사용된다
    - 일반적으로 배치 작업이나 짧은 수명의 컴퓨팅을 위해 사용된다
    - **특징**:
        - 작업이 완료되면 자동으로 종료
        - 실패한 작업을 재시도 할 수 있다
        - 병렬 작업 처리를 위한 설정이 가능하다
    

![[⎈ A Hands-On Guide to Kubernetes: Deployments, StatefulSets, and DaemonSets 🛠️ | by Anvesh Muppeda | Jun, 2024 | Medium](https://medium.com/@muppedaanvesh/a-hands-on-guide-to-kubernetes-deployments-statefulsets-and-daemonsets-%EF%B8%8F-20167634775d)](4-3%20Kubernetes%20Workload%20API%E1%84%85%E1%85%B3%E1%86%AF%20%E1%84%89%E1%85%A1%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%92%E1%85%A1%E1%84%8B%E1%85%A7%20%E1%84%8C%E1%85%A1%E1%86%BC%E1%84%80%E1%85%B5%20%E1%84%86%E1%85%B5%E1%86%BE%204eba676c09d5429c9ee7d442ca50672c/Untitled.png)

[⎈ A Hands-On Guide to Kubernetes: Deployments, StatefulSets, and DaemonSets 🛠️ | by Anvesh Muppeda | Jun, 2024 | Medium](https://medium.com/@muppedaanvesh/a-hands-on-guide-to-kubernetes-deployments-statefulsets-and-daemonsets-%EF%B8%8F-20167634775d)

- **Deployment(및 ReplicaSet)**
    - **`Deployments`**는 애플리케이션을 안정적으로 배포하고 업데이트하는 데 사용된다.
        - Stateless 한  애플리케이션에 이상적이다.
    - **특징**:
        - 애플리케이션의 선언적 업데이트를 지원합니다 (예: 롤링 업데이트).
        - 레플리카를 사용하여 애플리케이션의 가용성을 보장합니다.
        - 새로운 버전의 애플리케이션을 안전하게 롤아웃하고 롤백할 수 있습니다.
- **StatefulSets**
    - 상태를 유지하는 애플리케이션, 예를 들면 데이터베이스나, 메세지 큐 시스템과 같은 분산 시스템을 관리하기 위해 설계
    - **특징**:
        - 각 파드에 고유하고 예측 가능한 이름을 제공합니다. (예: my-app-0, my-app-1, my-app-2)
        - 파드의 스토리지 볼륨을 고유하게 유지합니다.
        - 순차적이고 안정적인 파드 배포 및 스케일링을 보장합니다.
- **DaemonSet**
    - 특정 노드에 로컬로 제공되는 기능을 제공하는 Pod를 정의한다.
    - **특징**:
        - 노드 수준의 서비스가 유용한 노드에서 실행되어야 할 때 DaemonSet을 사용한다.

### 참고

**Stateless 애플리케이션**

- **웹 서버**: 요청을 받아서 HTML 페이지를 반환하는 단순한 웹 서버.
- **API 서비스**: 요청을 받아서 특정 작업을 수행하고 결과를 반환하는 RESTful API 서비스.

**Stateful 애플리케이션**:

- **데이터베이스**: 데이터를 저장하고 관리하는 시스템.
- **세션 관리가 필요한 웹 애플리케이션**: 사용자 로그인 상태나 장바구니 정보를 유지하는 웹 애플리케이션.
- **메시지 큐**: 메시지를 저장하고 처리하는 시스템.

# **Jobs**

- `Job`은 클러스터에서 한 번만 수행되는 작업을 의미한다.
- 실패 시 지정된 횟수만큼 재시도합니다.
- `run vs job`
    - `kubectl run`과 `oc run`은 파드만 생성하는 반면, `Job`은 한 번만 수행되는 작업을 위한 파드를 생성한다.
- **일반적인 용도**:
    - 데이터베이스 초기화 또는 마이그레이션
    - 클러스터 정보에서의 일회성 지표 계산
    - 데이터 백업 생성 및 복원
- **예제**:
    
    ```
    [user@host ~]$ oc create job date-job --image registry.access.redhat.com/ubi8/ubi -- /bin/bash -c "date"
    
    ```
    

# **Cron Jobs**

- **개요**:
    - 정기적으로 반복해서 수행되어야 하는 작업을 위한 것입니다.
    - Linux의 crontab과 유사하게 동작하며, Cron 형식을 사용하여 작업의 스케줄을 지정합니다.
- **특징**:
    - 주기적 또는 특정 시간에 작업을 수행하도록 예약 가능
- **일반적인 용도**:
    - 주기적인 백업
    - 주기적인 보고서 생성
    - 저 사용량 시간대에 작업 예약
- **예제**:
    
    ```bash
    [user@host ~]$ oc create cronjob date-cronjob --image registry.access.redhat.com/ubi8/ubi --schedule="/1 * * * " -- date
    
    ```
    
    ```yaml
    apiVersion: batch/v1
    kind: CronJob
    metadata:
      name: group-sync
      namespace: idm-integrator
    spec:
      schedule: "* * * * *"
      jobTemplate:
        spec:
          template:
            spec:
              containers:
              - name: hello
                image: registry.ocp4.example.com/oac-cli:v4.10
                command:
                - /bin/sh
                - -c
                - oc adm groups sync --sync-config=cron-ldap-sync.yml
              restartPolicy: OnFailure
    
    ```
    

# **Deployments**

- 개요
    - `Deployment`는 Kubernetes에서 애플리케이션의 상태를 어떻게 관리할지 정의하는 리소스이다.
        - 선언적으로 애플리케이션의 상태를 관리하고 Pod 업데이트를 자동화해주는 기능
    - ReplicaSet을 사용하여 Pod의 desired state를 관리한다.
        - 선언적으로 애플리케이션의 상태를 관리하고 Pod 업데이트를 자동화해주는 기능
    - 애플리케이션을 스케일링하거나 업데이트할 때 사용할 수 있다.
    - Job과 달리, Deployment의 pod는 충돌 후 또는 삭제 후 다시 생성된다.
    - Rollback, Rolling updates, Canary releases와 같은 기능도 지원합니다.
- **일반적인 용도**
    - 애플리케이션의 복제본을 여러 개 관리하고 스케일링하려 할 때.
    - 애플리케이션의 새 버전을 무중단으로 배포하려 할 때.
    - Pod의 healthiness와 readiness를 확인하고, 문제가 발생하면 자동으로 재시작하려 할 때.
    - 애플리케이션 배포의 특정 버전으로 롤백하려 할 때.
- **예제**
    - Deployment 리소스를 생성
    - **`my-deployment`**를 Deployment 이름으로 지정
    - Pod의 컨테이너 이미지로 **`registry.access.redhat.com/ubi8/ubi`**를 설정
    - Pod의 인스턴스를 세 개로 유지하도록 Deployment를 설정
        
        ```bash
        [user@host ~]$ oc create deployment \
        my-deployment \
        --image registry.access.redhat.com/ubi8/ubi \
        --replicas 3
        ```
        

- **참고: Replicaset, pod, labels, selectors**
    - **ReplicaSet 및 Pod**
        - Replica set의 pod는 동일하며 replica set 정의의 pod 템플릿과 일치합니다.
        - 복제본 수가 충족되지 않으면 템플릿을 사용하여 새 pod가 생성됩니다.
    - **Labels**
        - Label은 문자열 키-값 쌍으로 표시되는 리소스 메타데이터의 한 유형입니다.
        - Label은 해당 레이블이 있는 리소스에 대한 공통 특성을 나타냅니다.
        - 많은 **`oc`** 및 **`kubectl`** 명령은 영향을 받는 리소스를 필터링하기 위한 레이블을 받아들입니다.
        - **예제 명령어**:
            
            ```bash
            [user@host ~]$ oc delete pod -l environment=testing
            ```
            
    - **Selectors**
        - Selector는 일치하는 리소스의 속성을 설명하는 쿼리 객체입니다.
        - 특정 리소스는 다른 리소스를 찾기 위해 selector를 사용합니다.
        - 예제로 제공된 YAML에서, replica set은 그 pod와 일치하기 위해 selector를 사용합니다.

# Stateful Sets

- **개요**
    - Stateful Sets은 Deployment와 유사하게 컨테이너 사양을 기반으로 pod의 세트를 관리합니다.
        - 그러나 Stateful Sets에서 생성되는 각 pod는 고유하다
    - Pod의 고유성은 예를 들어 pod가 고유한 네트워크 식별자나 지속적인 스토리지를 필요로 할 때 유용합니다.
    - Stateful Sets의 이름에서 알 수 있듯이, Stateful Sets은 클러스터 내에서 상태를 요구하는 pod를 위한 것입니다. 반면, Deployments는 상태가 없는(stateless) pod에 사용됩니다.
    - OpenShift에서도 Stateful Sets은 애플리케이션의 상태를 유지할 필요가 있는 서비스를 위해 제공됩니다.
- **일반적인 용도**
    - 데이터베이스와 같은 지속적인 스토리지를 필요로 하는 애플리케이션의 배포.
    - 각 pod에 대한 고유한 식별자가 필요한 경우.
    - 클러스터 내에서 데이터 또는 상태를 유지해야 하는 서비스를 운영할 때.
    
    ```yaml
    apiVersion: apps/v1
    kind: StatefulSet
    metadata:
      name: web
    spec:
      serviceName: "nginx"
      replicas: 3
      selector:
        matchLabels:
          app: nginx
      template:
        metadata:
          labels:
            app: nginx
        spec:
          containers:
          - name: nginx
            image: k8s.gcr.io/nginx-slim:0.8
            ports:
            - containerPort: 80
              name: web
    
    ```
    

https://github.com/acehko/kubernetes-examples/blob/main/kafka/kafka-statefulset.yaml (statefulset을 이용한 kafka 배포)

# **DaemonSet**

- **개요**:
    - DaemonSet은 모든 노드에  특정 작업을 수행하기 위해 모든 노드에 동일한 파드를 실행하도록 보장하는 리소스
    - 특징: 각 Kubernetes 노드에서 하나의 Pod 인스턴스만 실행하도록 보장한다. 노드가 클러스터에 추가되면, **`DaemonSet`**에 의해 Pod가 새 노드에 추가된다. 노드가 클러스터에서 제거되면, 해당 노드의 Pod는 가비지 컬렉션에 의해 제거된다.
- **일반적인 DaemonSet 용도**:
    - 노드 모니터링: 각 노드에 대한 특정 정보나 통계를 수집하는 도구들 (예: **`Prometheus Node Exporter`**, **`collectd`**, **`Datadog agent`**).
    - 노드 수준 로깅: 로그를 수집하고 중앙 로깅 솔루션으로 전송하는 에이전트들 (예: **`Fluentd`**, **`Logstash`**).
    - 시스템 관련 작업: 클러스터 내 모든 노드에 저장소 드라이버, 네트워크 플러그인 또는 다른 시스템 관련 기능을 제공하는데 사용한다.
- **`oc` 명령어를 사용한 DaemonSet 예제**:
    1. DaemonSet YAML 정의 파일 생성:
        
        [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)
        

- 새 노드가 클러스터에 추가되면 **`DaemonSet`**은 자동으로 해당 노드에서 로그 수집 에이전트의 파드를 시작
- Promtail은 로그 수집 에이전트로, Loki라는 로깅 백엔드와 함께 작동합니다.
    - Promtail을 모든 노드에 배포하며, 로컬 로그, Docker 컨테이너 로그를 수집하고, Promtail 설정을 제공

```yaml
# 모든 노드에 Promtail을 배포하는 DaemonSet 정의
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: promtail-daemonset
spec:
  selector:  # 파드선택자
    matchLabels:
      name: promtail
  template:
    metadata:
      labels:
        **name: promtail  # name: promtail 라벨을 가진 파드를 대상으로 합니다.**
    spec:
      serviceAccount: promtail-serviceaccount
      containers:
      - name: promtail-container
        image: grafana/promtail
        args:
        - -config.file=/etc/promtail/promtail.yaml
        env: 
        - name: 'HOSTNAME' # needed when using kubernetes_sd_configs
          valueFrom:
            fieldRef:
              fieldPath: 'spec.nodeName'
        volumeMounts:
        **# 로컬 로그 수집을 위한 호스트의 /var/log 디렉토리 마운트**
        - name: logs
          mountPath: /var/log
        **# Promtail 설정 파일을 포함하는 볼륨 마운트**
        - name: promtail-config
          mountPath: /etc/promtail
        **# Docker 컨테이너 로그 수집을 위한 호스트의 Docker 로그 디렉토리 마운트**
        - mountPath: /var/lib/docker/containers
          name: varlibdockercontainers
          readOnly: true
      volumes:
      **# 로컬 로그 수집을 위한 호스트의 /var/log 디렉토리 볼륨 정의**
      - name: logs
        hostPath:
          path: /var/log
      **# Docker 컨테이너 로그 수집을 위한 호스트의 Docker 로그 디렉토리 볼륨 정의**
      - name: varlibdockercontainers
        hostPath:
          path: /var/lib/docker/containers
      **# Promtail 설정을 포함하는 ConfigMap 볼륨 정의**
      - name: promtail-config
        configMap:
          name: promtail-config
```

[](https://github.com/grafana/loki/blob/9734c4b83220d2a9d481678c56e2dc08fee52bf9/docs/sources/send-data/promtail/installation.md?plain=1#L53)

# use case

- **Deployment**:
    - **시나리오**: 웹 애플리케이션을 배포하고자 합니다. 이 애플리케이션은 무상태(stateless)이기 때문에, 파드 중 하나가 실패하더라도 다른 파드가 그 기능을 바로 대체할 수 있어야 합니다.
        1. Deployment 워크로드를 사용하여 애플리케이션을 배포합니다.
        2. 사용자 트래픽 증가에 따라 파드의 수를 자동으로 늘릴 수 있습니다.
        3. 새로운 버전의 애플리케이션을 롤아웃하고, 문제가 발생하면 이전 버전으로 롤백할 수 있습니다.
- **StatefulSet**:
    - **시나리오**: 데이터베이스 클러스터를 구성하고자 합니다. 각 데이터베이스 노드는 고유한 식별자와 지속적인 스토리지를 가지고 있어야 합니다.
        1. StatefulSet 워크로드를 사용하여 데이터베이스 클러스터를 배포합니다.
        2. 각 파드는 지속적인 스토리지인 PersistentVolume과 연결됩니다.
        3. 데이터베이스 노드 중 하나가 실패하면, 동일한 식별자와 볼륨을 가진 새 파드가 생성됩니다.
- **DaemonSet**:
    - **시나리오**: 모든 노드에서 로그 수집 에이전트를 실행하려고 합니다. 각 노드에는 이 에이전트의 한 인스턴스만 실행되어야 합니다.
        1. DaemonSet 워크로드를 사용하여 로그 수집 에이전트를 배포합니다.
        2. 새 노드가 클러스터에 추가되면, 해당 노드에 자동으로 로그 수집 에이전트의 인스턴스가 배포됩니다.
        3. 노드가 클러스터에서 제거되면, 해당 노드의 에이전트 인스턴스도 자동으로 종료됩니다.
- **Job**:
    - **시나리오**: 대량의 데이터를 처리하는 일회성 작업을 실행하려고 합니다.
        1. Job 워크로드를 사용하여 데이터 처리 작업을 시작합니다.
        2. 작업이 완료되면, 작업을 실행한 파드는 자동으로 종료됩니다.
        3. 만약 작업이 실패하면, 지정된 재시도 횟수만큼 작업을 다시 시작할 수 있습니다.
- **CronJob**:
    - **시나리오**: 매일 밤 자동으로 데이터베이스 백업 작업을 실행하려고 합니다.
        1. CronJob 워크로드를 사용하여 백업 작업을 스케줄링합니다.
        2. 지정된 시간에 CronJob은 Job을 생성하여 백업 작업을 시작합니다.
        3. 백업 작업이 완료되면, 작업을 실행한 파드는 자동으로 종료됩니다.