---
layout: default
title: 1-3. Kubernetes 및 OpenShift 아키텍처
nav_order: 5
parent: 1. Introduction to Kubernetes and OpenShift
---
# 1-3 Kubernetes 및 OpenShift 아키텍처

# **목표**

- Kubernetes 및 OpenShift의 주요 아키텍처 특성을 설명한다.

# **Red Hat OpenShift Container Platform(RHOCP) 및 Kubernetes 아키텍처 개요**

- **Red Hat OpenShift Container Platform(RHOCP) 및 Kubernetes 아키텍처 개요**
    - Kubernetes: 컨테이너화된 애플리케이션의 배포, 관리, 스케일링을 위한 오케스트레이션 플랫폼.
    - POD: Kubernetes에서 관리하는 가장 작은 단위
        - Application을 구성하는 하나 이상의 컨테이너, 스토리지 리소스, IP주소 등으로 구성된다.
    
- **컨테이너 관리의 역사**
    1. **컨테이너의 등장**
        - 애플리케이션 개발 및 릴리스 라이프사이클에서 문제점들을 해결하기 위해 컨테이너화 기술이 도입됨.
        - 한 서버에서 여러 애플리케이션을 분리하여 운영하려면 각 애플리케이션의 실행 환경 충돌 문제가 발생. 컨테이너를 사용하면 각 애플리케이션은 자신만의 실행 환경을 갖게 되어 충돌 문제가 해결됨.
    2. **컨테이너의 관리 복잡성**
        - 환경에서 컨테이너 수가 증가함에 따라 관리 문제가 발생.
        - 100개 이상의 컨테이너가 실행 중일 때, 네트워크 연결성, 보안, 업데이트, 롤백 등을 수동으로 관리하는 것은 매우 복잡.
    3. **Kubernetes의 등장**
        - 대규모 컨테이너 관리 문제를 해결하기 위해 Kubernetes가 개발되었고, 플랫폼의 선두 주자로 자리잡음.
        - 기존에 수동으로 관리해야 했던 컨테이너의 스케일링, 롤링 업데이트, 롤백 등이 Kubernetes를 통해 자동화됨.
        - **Kubernetes 기능**
            - **서비스 검색 및 부하 분산**: DNS를 사용해 서비스 간 통신을 간소화하며, 서비스의 위치 변경에 따른 문제를 해결한다.
            - **수평 스케일링**: 애플리케이션의 트래픽에 따라 자동/수동 으로 스케일링할 수 있습니다.
            - **자체 복구**: Pod를 모니터링 하여 애플리케이션 오류 시, 자동으로 복구를 시도
            - **자동 출시**: 새 버전의 애플리케이션을 안전하게 배포하고 문제 발생 시 이전 버전으로 롤백한다.
            - **Secret** **및 Config 관리**: 비공개로 유지해야 하는 Secret, Config 에 대해 컨테이너를 다시 빌드하지 않고도 애플리케이션의 Config와 secret을 관리할 수 있다.
        
    4. **Kubernetes 커뮤니티와 에코시스템**
        ![Alt text](1-7%20Kubernetes%20%EB%B0%8F%20OpenShift%20%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98%20546dd75cb9fb4d0a8a601acb655c2dbd/Untitled.png)
        ![Kubernetes 커뮤니티 에코시스템]

        Kubernetes 커뮤니티 에코시스템
        
        - Kubernetes는 단순히 하나의 툴이 아닌, 다양한 툴과 기여자로 구성된 커뮤니티로 발전.
        - Helm으로 패키징 및 배포를 관리하거나, Istio로 서비스 메쉬를 구축하는 등의 다양한 확장 기능과 툴이 커뮤니티에서 제공됨.
    5. **Red Hat OpenShift Container Platform (RHOCP)**
        - Kubernetes가 기본적인 컨테이너 오케스트레이션 기능을 제공하는 반면, RHOCP는 비즈니스 환경에서 필요한 통합 및 확장 기능을 추가로 제공.
        - 예제: Prometheus를 통한 모니터링, Grafana를 통한 대시보드 제공, 기본 제공 이미지 레지스트리 등이 RHOCP의 특징.
    6. **RHOCP의 추가 기능**
        - Prometheus 기반의 통합 모니터링
        - Grafana 대시보드를 통한 성능 및 시스템 문제 시각화
        - 기본 제공 이미지 레지스트리 포함
        - Openshift 공식 가이드에 따르면, 보안 강화, CI/CD 파이프라인 통합, 서비스 메쉬 지원 등의 추가 기능이 있음.
        - 예제: 개발자가 코드를 변경하면 OpenShift의 CI/CD 파이프라인이 자동으로 애플리케이션을 빌드, 테스트, 배포하는 프로세스를 자동화.

# **Kubernetes Features**

- **서비스 발견 및 로드 밸런싱(Service discovery and load balancing)**
    - 컨테이너 집합마다 단일 DNS 항목을 할당하여 서비스 간 통신을 활성화합니다.
    - 예제: 서비스 A가 서비스 B에 요청을 보낼 때, 서비스 B의 정확한 IP 주소를 몰라도 DNS 이름만 알면 통신이 가능하게 됩니다.
- **수평 스케일링(Horizontal scaling)**
    - Kubernetes CLI나 웹 UI를 통해 수동 또는 자동으로 애플리케이션을 확장 및 축소할 수 있습니다.
    - 예제: 웹 애플리케이션에 사용자가 급증하면, 자동으로 더 많은 인스턴스를 추가하여 부하를 분산시킬 수 있습니다.
- **자동 복구**
    - 사용자 정의 건강 검사를 사용하여 파드를 모니터링하며, 실패 시 파드를 재시작하고 재스케줄링할 수 있습니다.
    - 예제: 애플리케이션에서 오류가 발생하면 Kubernetes가 자동으로 해당 파드를 재시작하여 서비스 중단을 최소화합니다.
- **자동 롤아웃**
    - Kubernetes는 애플리케이션 컨테이너에 대한 업데이트를 점진적으로 롤아웃하며, 그 과정에서 애플리케이션 상태를 모니터링합니다.
    - 예제: 새로운 버전의 애플리케이션을 배포할 때 문제가 발생하면 이전 버전으로 자동 롤백합니다.
- **시크릿 및 구성 관리**
    - 컨테이너를 다시 빌드하지 않고 애플리케이션의 구성 설정 및 시크릿을 관리할 수 있습니다.
    - 예제: 데이터베이스 암호와 같은 중요한 정보를 안전하게 저장하고 관리할 수 있습니다.
    - 참고: Kubernetes는 시크릿을 암호화하지 않고 Base64 인코딩으로 저장합니다. OpenShift는 추가적인 보안 기능을 제공하여 이를 보완할 수 있습니다.
- **오퍼레이터(Operators)**
    - 오퍼레이터는 Kubernetes 애플리케이션 패키지로, 애플리케이션의 라이프사이클을 관리하는 로직을 Kubernetes 클러스터에 가져온다.
    - 예 : 데이터베이스 오퍼레이터는 데이터베이스의 복제본 관리, 백업, 복구, 업그레이드 등을 자동으로 처리 한다.

# **Red Hat OpenShift Container Platform 기능**

![Alt text](1-7%20Kubernetes%20%EB%B0%8F%20OpenShift%20%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98%20546dd75cb9fb4d0a8a601acb655c2dbd/Untitled%202.png)
Figure 1.40: RHOCP cluster components

- Kubernetes 컨테이너 인프라 기반 으로 빌드된 모듈식 구성 요소 및 서비스 집합
- 프로덕션 PaaS 기능 제공:
    - **원격 관리**:
        - 클러스터의 상태와 리소스를 원격 위치에서 모니터링하고 관리할 수 있도록 해준다.
        - 사용자는 어디서든 클러스터의 작동 상태를 확인하고 필요한 조치를 취할 수 있습니다.
    - **멀티 테넌시**:
        - 여러 사용자나 팀이 **동일한 클러스터 리소스를 공유**하면서 각자의 환경이 서로 격리되도록 지원합니다. 이를 통해 리소스를 효율적으로 활용하면서도 각 테넌트의 보안과 **환경 설정을 독립적**으로 관리할 수 있습니다.
    - **보안 향상**:
        - RHOCP는 다양한 보안 기능과 통합된 보안 정책을 제공하여 애플리케이션과 데이터의 보안을 강화합니다.
        - 네트워크 정책, 역할 기반 접근 제어(RBAC) 및 보안 컨텍스트를 포함한 다양한 보안 메커니즘이 포함한다.
    - **모니터링 및 감사**:
        - 클러스터의 작동 상태와 성능 지표를 실시간으로 모니터링할 수 있습니다. 또한 사용자의 모든 활동을 기록하여 추후 감사 또는 **디버깅을 위한 정보를 제공**합니다.
    - **애플리케이션 라이프사이클 관리**:
        - 애플리케이션의 전체 라이프사이클 (개발, 테스트, 배포, 운영)을 통합적으로 관리할 수 있습니다.
        - 애플리케이션의 변경 사항이나 버전 관리를 더 효율적으로 수행할 수 있습니다.
    - **셀프 서비스 인터페이스**:
        - 사용자나 개발자가 필요한 리소스나 서비스를 직접 요청하고 프로비저닝 할 수 있게 하는 인터페이스를 제공한다.
        - 이를 통해 IT 팀의 작업 부하를 줄이고 개발 및 배포 프로세스를 가속화할 수 있습니다.
- **RHEL CoreOS**:
    - RHOCP는 RHEL CoreOS 기반의 Host를 사용한다.
    - 컨테이너화된 애플리케이션 실행에 최적화된 운영 체제.
    - 단일 이미지로 전체 운영 체제 업데이트.
        
      ![Alt text](1-7%20Kubernetes%20%EB%B0%8F%20OpenShift%20%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98%20546dd75cb9fb4d0a8a601acb655c2dbd/Untitled%203.png)
        Figure 1.41: Additional features available in RHOCP
        

# **Kubernetes Architectural Concepts**

![Alt text](1-7%20Kubernetes%20%EB%B0%8F%20OpenShift%20%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98%20546dd75cb9fb4d0a8a601acb655c2dbd/Untitled%204.png)
- Cluster: 애플리케이션 컨테이너를 실행하기 위한 일련의 노드 머신이다.
    - 쿠버네티스를 실행 중이라면 클러스터를 실행하고 있는 것입니다.
    - 최소 수준에서 클러스터는 컨트롤 플레인 및 하나 이상의 컴퓨팅 머신 또는 노드를 포함하고 있다.
        
       ![Alt text](1-7%20Kubernetes%20%EB%B0%8F%20OpenShift%20%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98%20546dd75cb9fb4d0a8a601acb655c2dbd/Untitled%205.png)
        

- nodes(서버): 애플리케이션의 복원력과 확장성을 제공하는 클러스터에 인프라 리소스를 제공하는 물리적 또는 가상 시스템.
    - **컨트롤 플레인 노드**: 전역 클러스터 조정 및 클러스터 구성의 상태 관리.
    - **컴퓨팅 플레인 노드**: 서비스 실행 및 애플리케이션 실행 요청 수신.

```bash
oc login -u admin -p redhatocp https://api.ocp4.example.com:6443 # developer 는 확인 불가
oc get nodes # 노드 상태 확인
```

- 클러스터 노드에 대한 컨트롤 플레인 통신은 각 노드에서 실행되는 `kubelet` 서비스를 통해 이루어진다.
    - **kubelet 서비스**: 클러스터 노드에 대한 컨트롤 플레인 통신을 관리.
    - 서버는 컨트롤 플레인 노드와 Compute 노드의 역할을 모두 수행할 수 있지만, 일반적으로 안정성, 보안, 관리 효율성 향상을 위하여 두 역할을 분리합니다.
        
       ![Alt text](1-7%20Kubernetes%20%EB%B0%8F%20OpenShift%20%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98%20546dd75cb9fb4d0a8a601acb655c2dbd/Untitled%206.png)
        
        Figure 1.42: Kubernetes communication components
        

## Nodes

- **워커 노드 구성요소**
    - **Kubelet 서비스**:
        - Kubelet은 Kubernetes 노드의 핵심 구성 요소로서 노드에 배포된 각 Pod의 상태를 모니터링하고 보고한다.
        - **기능:** Kubelet은 주기적으로 할당된 Pod의 구성 정보와 상태를 Kubernetes API 서버와 동기화한다. **`만약 Pod의 현재 상태와 원하는 상태가 다르면, Kubelet은 필요한 조치를 취하여 이를 일치시킵니다**.`
    - **~~Kube-proxy 서비스**:~~**→ OpenShiftSDN**
        - ~~Kube-proxy는 워커 노드에 배포되는 네트워크 프록시로, Kubernetes 서비스의 Service Discovery 및 로드 밸런싱 기능을 제공한다.~~
        - **~~기능:** Kube-proxy는 Kubernetes API 서버에서 서비스와 엔드포인트 정보를 검색하여 각 서비스에 대한 iptables 규칙 또는 IPVS 규칙을 설정하고 관리한다.~~
    - **OpenShift SDN:**
        - RHOCP의 네트워킹 솔루션이다. 이것은 클러스터 내의 파드와 서비스 간의 통신을 가능하게 하고 관리합니다.
        - 기능
            - **Overlay Network**: 오버레이 네트워크를 통해 각 파드에 고유한 IP 주소를 할당하며, 이 네트워크 위에서 파드 간 통신이 가능합니다.
            - **Network Isolation**: 프로젝트(또는 네임스페이스) 간 네트워크 격리를 제공하여 파드 간의 통신 범위를 제한합니다.
            - **Service Load Balancing**: 클라이언트의 요청을 서비스 뒤의 여러 파드 중 하나로 자동 분배하는 로드 밸런싱 기능을 제공합니다.
            - **Network Policies**: 세밀한 네트워크 규칙을 정의하여 파드 간의 통신을 조절할 수 있습니다.
    
    ```bash
    oc login -u admin -p redhatocp https://api.ocp4.example.com:6443 # developer 는 확인 불가
    oc debug node/master01 # master01 은 노드 이름
    chroot /host # chroot 를 통해 호스트의 파일 시스템을 마운트
    systemctl status kubelet # kubelet 의 상태 확인
    exit
    ```
    
    ```bash
    oc get network -o json | jq
    ```
    
- **컨트롤 플레인 노드 구성요소**
    
    ![Alt text](1-7%20Kubernetes%20%EB%B0%8F%20OpenShift%20%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98%20546dd75cb9fb4d0a8a601acb655c2dbd/Untitled%207.png)
    
    - **etcd 서비스**:
        - etcd는 분산 데이터 저장 시스템으로, Kubernetes의 모든 클러스터 데이터를 저장합니다.
        - **기능:** 클러스터 내 모든 노드와 서비스의 상태, 설정, 메타데이터 등의 정보를 안전하게 저장하고, 필요한 경우 이 정보를 조회하거나 업데이트합니다.
        
        ```bash
        #admin login
        oc get pods -n openshift-etcd
        ```
        
    - **Kube API-server**:
        - Kubernetes API 서버는 Kubernetes API의 진입점이자 클러스터와의 통신 중심입니다.
        - **기능**: 사용자, 관리 도구 및 다른 클러스터 구성 요소와의 상호 작용을 처리하며, 요청을 검증하고 처리한 다음 etcd와 같은 데이터 저장소에 상태를 저장하거나 조회합니다.
        
        ```bash
        # admin login
        oc get pods -n openshift-kube-apiserver
        ```
        
    - **Kube Scheduler**:
        - 새로 생성된 Pod에 대해 가장 적합한 노드를 결정하고 해당 노드에 Pod를 할당하는 역할을 합니다.
        - **기능:** 스케줄러는 여러 가지 메트릭과 규칙(리소스 요구 사항, 하드웨어/소프트웨어/정책 제한 등)을 고려하여 Pod를 실행할 가장 적합한 노드를 선택합니다.
        
        ```bash
        #admin login
        oc get pods -n openshift-kube-scheduler
        ```
        

- **컴퓨팅 플레인 노드 구성 요소**
    
   ![Alt text](1-7%20Kubernetes%20%EB%B0%8F%20OpenShift%20%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98%20546dd75cb9fb4d0a8a601acb655c2dbd/Untitled%208.png)
    
    - **kubelet**: 각 노드에서 실행되는 에이전트. 컨트롤 플레인에서 전송된 지시 사항에 따라 컨테이너를 시작, 중지 또는 재시작하는 등의 작업을 수행합니다.
        - 기능: 이는 주로 Pod의 생명주기를 관리하며, 컨테이너 런타임과 통신하여 컨테이너의 생성, 삭제 및 검사 작업을 수행합니다.
        
        ```bash
        oc get nodes
        oc describe node <노드 이름> | grep -A 5 "System Info:"
        ```
        
    - **kube-proxy**: Kubernetes의 네트워크 서비스를 구현하는 데 필요한 네트워크 규칙을 관리하는 구성 요소입니다.
        - 기능: 클러스터 내에서의 서비스 발견과 로드 밸런싱을 지원합니다. 트래픽을 적절한 백엔드 파드로 전달하기 위해 IP, 포트 및 기타 네트워크 트래픽을 처리합니다.
        
        ```bash
        oc get pods -n openshift-network
        ```
        
    - **CRI (Container Runtime Interface)**: CRI는 kubelet과 특정 컨테이너 런타임 간의 플러그 가능한 인터페이스를 제공한다. 이로 인해 Kubernetes는 Docker 외에도 다른 컨테이너 런타임과 함께 작동할 수 있다.
        - 기능: 컨테이너의 생명주기와 관련된 연산들을 추상화하여 제공, 그래서 다양한 컨테이너 런타임을 지원할 수 있게 한다.
        
        ```bash
        crictl ps
        ```
        
    - **cri-o**: Open Container Initiative (OCI) 표준에 준수하는 컨테이너 런타임이다. Docker와 비슷하지만, 컨테이너만을 실행하는 데에 중점을 두어 좀더 가볍다.
        - 기능: cri-o는 Kubernetes의 kubelet과 CRI 인터페이스를 통해 통신하며, 컨테이너의 시작, 중지 및 관리를 담당합니다.
        
        ```bash
        oc describe node master01 | grep -A 5 "System Info:"
        ```
        
       ![Alt text](1-7%20Kubernetes%20%EB%B0%8F%20OpenShift%20%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98%20546dd75cb9fb4d0a8a601acb655c2dbd/Untitled%208.png)
        
    - 참고: **Namespaces, API Resources, Controllers, Reconciliation Loop**
        - **Namespaces:**  Kubernetes 클러스터 내에서 리소스들을 분리하고 구성하는 데 사용되는 가상의 공간입니다. 다수의 사용자나 팀이 동일한 클러스터를 공유할 때, 서로 겹치지 않게 리소스를 관리할 수 있게 해줍니다.
            - **기능**: 리소스 분리, 사용자나 팀별로 클러스터 리소스 할당, 리소스의 접근 권한 관리
            - **예제**: 팀 A와 팀 B가 동일한 클러스터를 사용할 때, 각각 'team-a'와 'team-b'라는 네임스페이스를 생성해 각 팀의 리소스를 분리합니다.
        - **API Resources**
            - Kubernetes에서 API 리소스는 Kubernetes API를 통해 접근하고 관리할 수 있는 엔드포인트입니다. 이것은 파드, 서비스, 레플리카셋 등과 같은 객체들을 포함합니다.
            - **기능**: Kubernetes의 핵심 및 커스텀 리소스 관리, 리소스의 상태 및 구성 정보 조회 및 변경
            - **예제**: `kubectl get pods` 명령어는 'pods' API 리소스를 조회하여 파드의 목록을 반환합니다.
        - **Controllers:** 컨트롤러는 Kubernetes에서 특정 리소스의 상태를 지속적으로 모니터링하고 원하는 상태(desired state)와 현재 상태(current state)를 일치시키기 위한 논리를 담고 있습니다
            - 기능: 리소스 상태의 자동 관리 및 유지, 오류 발생 시 자동 복구 로직 제공
            - **예제**: ReplicaSet 컨트롤러는 지정된 수의 파드 복제본이 항상 실행되도록 보장합니다.
        - **Reconciliation Loop:** 재조정 루프는 컨트롤러의 핵심 패턴으로, 원하는 상태와 현재 상태를 지속적으로 비교하고 필요한 경우 조치를 취해 두 상태를 일치시키는 작업을 반복적으로 수행합니다.
            - **기능**: 시스템의 안정성 및 복원력 제공, 자동 오류 복구 및 리소스 상태 조절
            - **예제**: 사용자가 ReplicaSet의 복제본 수를 3으로 설정했는데, 현재 2개만 실행 중일 경우, 재조정 루프는 추가로 1개의 파드를 생성하여 원하는 상태를 유지합니다.
    
    ```bash
    oc api-resources
    oc get pods -n openshift-controller-manager
    oc describe pods -n openshift-controller-manager
    ```
    

# OpenShift에서의 애플리케이션 배포

```bash
[Project]
    ├── [Application]
    │       ├── [Pod 1]
    │       │       ├── [Container A]
    │       │       └── [Container B]
    │       ├── [Pod 2]
    │       │       └── [Container C]
    │       └── [Pod N]
    │               └── [Container D]
    ├── [Service]
    │       └── 여러 Pod에 대한 로드 밸런싱 및 네트워크 접근 제공
    ├── [Route]
    │       └── 외부 트래픽이 서비스에 접근할 수 있는 URL 제공
    ├── [BuildConfig]
    │       └── 소스 코드로부터 컨테이너 이미지 빌드 자동화
    ├── [DeploymentConfig]
    │       └── 애플리케이션 배포 및 업데이트 관리
    └── [PersistentVolumeClaim (PVC)]
            └── Pod가 사용할 영구 스토리지 제공
```

- 프로젝트 생성
    - 애플리케이션을 배포하기 위해 필요한 첫 단계입니다. 프로젝트는 etcd에 저장됩니다.
- 리소스 배치
    - 프로젝트 내에서 이루어지며, 이는 이미지 스트림 등을 포함합니다.
- 배포
    - 팟을 인스턴스화하는 역할을 합니다. 배포는 팟이 어떻게 인스턴스화될지에 대한 모든 속성을 명시하며, 이는 팟을 위해 어떤 이미지를 사용해야 하는지를 알아야 합니다.
- 예제 코드는 OpenShift CLI 'oc' 명령어를 사용하여 다음과 같습니다:
    
    ```bash
    oc new-project myproject # 프로젝트 생성
    oc new-app nginx # 애플리케이션 배포
    oc get pods -n myproject # 프로젝트 내의 팟 확인
    ```
    

# **RHOCP 클러스터 설정 개요**

## Cluster

![Alt text](1-7%20Kubernetes%20%EB%B0%8F%20OpenShift%20%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98%20546dd75cb9fb4d0a8a601acb655c2dbd/Untitled%209.png)

**{rh-virtualization}에 빠르게 클러스터 설치.** [1장. RHV에 설치 OpenShift Container Platform 4.6 | Red Hat Customer Portal](https://access.redhat.com/documentation/ko-kr/openshift_container_platform/4.6/html/installing_on_rhv/_installing-on-rhv)

- 여러 대의 컴퓨터나 서버가 서로 연결되어 하나의 시스템처럼 작동하는 구조
- 클러스터는 일반적으로 고 가용성, 로드 밸런싱, 높은 성능, 또는 데이터 복구 등의 목적으로 구성된다.
    - **높은 가용성 (High Availability)**: 하나의 서버나 컴퓨터가 장애로 인해 작동을 멈추더라도 다른 서버나 컴퓨터가 그 작업을 대신 수행할 수 있습니다. 이로 인해 전체 시스템의 다운타임을 최소화할 수 있습니다.
    - **로드 밸런싱 (Load Balancing)**: 클러스터 내의 여러 서버나 컴퓨터가 작업을 분산받아 처리하기 때문에 부하를 균등하게 나누고 효율적으로 처리할 수 있습니다.
    - **확장성 (Scalability)**: 필요에 따라 클러스터에 서버나 컴퓨터를 추가하거나 제거할 수 있습니다. 이를 통해 시스템의 용량이나 성능을 쉽게 조정할 수 있습니다.
    - **데이터 무결성 및 복구 (Data Integrity & Recovery)**: 일부 클러스터는 데이터 복제 기능을 제공하여 데이터 손실 위험을 최소화하고, 장애 발생 시 데이터를 복구할 수 있습니다.

## **Full Stack Automation (Installer Provisioned Infrastructure, IPI)**

- Full Stack Automation은 OpenShift 설치 프로그램이 클러스터에 필요한 모든 리소스와 구성 요소를 자동으로 프로비저닝한다.
- 이 방식은 사용자의 입력이 최소화되어 클러스터를 빠르게 시작할 수 있습니다.
- **특징**:
    - 클라우드 제공자의 API를 활용하여 인스턴스, 네트워크, 스토리지 등을 자동 생성합니다.
    - 설치자가 LB (Load Balancer), VM (Virtual Machine) 및 스토리지를 자동으로 설정합니다.
    - 클러스터의 확장 및 축소가 자동화되며, 리소스 부족 시 자동으로 노드 확장이 가능합니다.
    - 설치 과정이 단순화되어 있어 사용자가 별도의 상세 설정 없이도 클러스터를 빠르게 배포할 수 있습니다.
- **예시**: AWS, Azure, Google Cloud Platform 등의 클라우드 환경에서 자동으로 VM 인스턴스와 네트워크 구성 요소를 생성하여 OpenShift 클러스터를 배포하는 과정.

### **사용자 지정 인프라 (User Provisioned Infrastructure, UPI)**

- UPI 전략에서는 사용자가 클러스터를 실행하기 위한 인프라를 직접 설정하고 관리해야 합니다.
- 이 방식은 사용자에게 인프라 구성에 대한 완전한 제어를 제공한다.
- **특징**:
    - 사용자가 물리적, 가상 머신 또는 클라우드 인스턴스를 수동으로 프로비저닝해야 합니다.
    - 네트워크 구성, 스토리지 및 기타 구성 요소도 수동으로 설정해야 합니다.
    - 클러스터의 확장이나 축소는 사용자가 수동으로 관리해야 합니다.
    - 더 복잡한 요구 사항과 보안 규칙을 갖는 환경에서 유용하게 사용됩니다.
- **예시**: 사용자가 직접 VMware 환경 또는 물리적 서버에서 필요한 가상 머신 및 네트워크 구성 요소를 생성하고, 그 위에 OpenShift를 설치하는 과정.