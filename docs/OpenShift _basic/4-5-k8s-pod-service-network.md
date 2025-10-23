---
layout: default
title: 4-5. Kubernetes 포드 및 서비스 네트워크
nav_order: 28
parent: Redhat OpenShift
---

# 4-5 Kubernetes 포드 및 서비스 네트워크

# Openshift Network

## **Kubernetes 네트워킹**

- Kubernetes 클러스터는 마스터와 워커 노드로 구성
- 각 노드에는 고유한 IP 주소가 존재함 (예: 192.168.0,100  , 101, 102, 103).

## 요구사항

- **컨테이너 간의 통신**: 강력하게 연결된 컨테이너 간의 통신을 제공
- **Pod 간의 통신**: Pod끼리 서로 통신
- **Pod와 서비스 간의 통신**: Pod와 서비스 간의 통신이 가능
- **외부에서 서비스로의 통신**: 외부에서 클러스터 내의 서비스에 접근

- **파드의 IP 주소**
    - 어플리케이션은 파드 내의 Cri-o 컨테이너로 배포되고 각 파드에는 IP 주소가 할당된다.
    - Pods는 클러스터의 노드들 사이에서 지속적으로 생성되고 파괴된다.(IP 변경)
- **파드 간의 통신**
    - 파드는 서로 다른 유형의 어플리케이션을 실행할 수 있다. (예: 웹 서버, 데이터베이스 서버).
    - 파드들이 서로 통신할 수 있도록 네트워크가 구성되어야 한다.
        - 통신 가능한 네트워크
        - IP 주소 할당

# Pod의 배포 및 네트워크 할당 과정

```bash
route
  |
  |
(reference)
  |
	v
 SVC
  |
  |
(reference)
  |
	v
Pods <---(reference)--- deploy ---(reference)--->ImageStream
```

1. **ImageStream 생성**:(DO188)
    - 이미지 스트림을 생성하면, OpenShift에서 컨테이너 이미지의 버전을 추적하고 관리할 수 있다.
    - ImageStream은 컨테이너 레지스트리에 저장된 실제 이미지와 연결된다.
    - 새로운 이미지가 푸시되면, ImageStream은 자동으로 업데이트된다.
2. **Deployment (deploy) 생성**:
    - DeploymentConfig 또는 Deployment 리소스를 통해 원하는 Pod의 상태와 스펙을 정의한다.
    - Deployment는 ImageStream을 참조하여 어떤 이미지 버전을 사용할지 결정한다.
    - Deployment에 의해 스펙에 따라 Pod가 생성되거나 업데이트된다.
3. **Pod 생성 및 배포**:
    - Deployment에 의해 정의된 스펙에 따라 Pod가 생성된다.
    - Pod는 ImageStream에서 지정된 이미지를 사용하여 컨테이너를 실행한다.
4. **Service (SVC) 생성**:
    - 서비스는 같은 라벨 선택자를 사용하는 Pod 그룹에 대한 접근을 추상화하고 제공한다.
    - Service는 로드 밸런싱 및 서비스 검색 기능을 제공한다.
5. **Route 생성**:
    - Route는 특정 호스트 이름 또는 URL을 사용하여 외부 트래픽을 Service로 라우팅한다.
    - 이렇게 하면, OpenShift 클러스터 외부에서 해당 서비스로의 접근이 가능해진다.

## 실습

### 1. 프로젝트 생성 및 애플리케이션 실행

- **유틸리티 프로젝트 생성 및 UBI 컨테이너 실행**
    
    ```bash
    oc new-project utility
    oc run ubi --image=registry.access.redhat.com/ubi9/ubi --command -- /bin/sh -c "while true; do sleep 1000; done"
    ```
    
- **PHP 웹 애플리케이션 프로젝트 생성 및 배포**
    
    ```bash
    oc new-project phpweb
    oc project phpweb
    oc new-app --name hello <https://github.com/RedHatTraining/DO180-apps.git> --context-dir=php-helloworld -i php:7.4-ubi8
    ```
    

### 2. 애플리케이션 상태 확인

- **빌드 및 배포 상태 확인**
    
    ```bash
    oc get bc # 소스 코드의 빌드 방법, 빌드가 완료된 후 생성될 이미지의 위치 등을 정의
    oc get builds # 실제 실행된 빌드를 조회
    oc get is # 이미지 스트림은 컨테이너 이미지를 관리하는 방식, 특정 이미지의 버전과 태그를 추적
    oc get deploy
    oc get pods
    oc get svc
    oc get route
    ```
    
- **엔드포인트 및 Pod IP 주소 확인**
    
    ```bash
    oc get endpoints hello
    oc get -o json pod/hello-<number> | jq .status.podIP
    ```
    

### 3. 애플리케이션 스케일링

- **애플리케이션 복제본 수 증가**
    
    ```bash
    oc scale deploy/hello --replicas=3
    oc get pods
    ```
    
- **각 복제본의 Pod IP 주소 확인**
    
    ```bash
    oc get endpoints hello
    oc get -o json pod/hello-<number1> | jq .status.podIP
    oc get -o json pod/hello-<number2> | jq .status.podIP
    oc get -o json pod/hello-<number3> | jq .status.podIP
    ```
    

### 4. 네트워크 연결 확인

- **phpweb 프로젝트의 Pod 상태 확인**
    
    ```bash
    oc get pods -n phpweb
    ```
    
- **직접 IP로 접근 시도**
    
    ```bash
    curl 10.8.1.26:8080  # 접속 불가
    ```
    
- FQDN으로 접근시도
    
    ```bash
    # <service-name>: 서비스의 이름 (예: hello)
    # <namespace>: 서비스가 속한 네임스페이스 (예: phpweb)
    # svc: 서비스(Service)를 나타내는 고정 문자열
    # cluster.local: 기본 도메인 이름 (일반적으로 cluster.local)
    curl http://hello.phpweb.svc.cluster.local:8080 # 접속 불가
    
    ```
    
- **Pod 내부에서 서비스 접근 확인**
    
    ```bash
    oc exec -n phpweb hello-<pod-id> -- curl 10.8.1.26:8080
    oc exec -n phpweb hello-<pod-id> -- curl 10.8.1.27:8080
    oc exec -n phpweb hello-<pod-id> -- curl http://hello.phpweb.svc.cluster.local:8080
    ```
    
- **유틸리티 프로젝트의 UBI 컨테이너에서 서비스 접근 확인**
    
    ```bash
    oc exec -n utility ubi -- curl http://hello.phpweb.svc.cluster.local:8080
    oc exec -n utility ubi -- curl http://hello.phpweb.svc:8080
    oc exec -n utility ubi -- curl http://hello.phpweb:8080
    ```
    

### 5. 서비스 설명 및 외부 노출

- **서비스 설명 확인**
    
    ```bash
    oc describe svc hello
    ```
    
- **서비스를 외부에 노출**
    
    ```bash
    oc expose svc hello
    ```
    
- **외부에서 서비스 접근 확인**
    
    ```bash
    curl hello-phpweb.apps.ocp4.example.com
    ```
    

# SDN

- **Openshift 소프트웨어 정의 네트워킹 (SDN)**
    - OpenShift SDN은 쿠버네티스 클러스터 내의 파드 간 통신을 제공하는 네트워킹 솔루션
    - Openshift는 여러 노드에 걸쳐 가상 네트워크(Overlay network)를 생성한다.
        - 기본 네트워크 모델은 모든 파드가 별도의 IP 주소를 갖는 것을 목표로 한다.
        - SDN은 Open vSwitch 표준을 사용하여 Overlay Network를 생성한다.
    - 파드 간의 통신은 물리적 네트워크 인프라에 의존하지 않으며, SDN을 통해 가상화된다.
- **Open vSwitch**
    - Open vSwitch는 오픈 소스의 멀티레이어 가상 스위치입니다.
        - 가상 머신을 하이퍼바이저에 연결하는 데 사용되는 분산 가상 스위치
    - 파드 간 통신을 위한 가상 브리지와 경로를 제공한다.
    - 주요 기능: VLAN 태깅, 트렁킹, LACP, 포트 미러링
- **Overlay 네트워크**
    - Overlay 네트워크는 물리 네트워크 위에 구축된 가상 네트워크입니다.
    - OpenShift에서는 VXLAN 같은 프로토콜을 사용하여 파드 간에 격리된 네트워크 세그먼트를 제공합니다.
    - 이것은 파드를 걸쳐 네트워크 트래픽을 라우팅하고 캡슐화하는데 사용됩니다.
    - Overlay 네트워크는 물리적 인프라에 독립적으로 스케일링 및 조정할 수 있는 장점이 있습니다
        
        ![[Start working with Red Hat OpenShift 4 networks - IBM Developer](https://developer.ibm.com/tutorials/understanding-network-definitions-for-openshift-4-on-ibm-z-and-linuxone/)](4-5%20Kubernetes%20%E1%84%91%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%86%E1%85%B5%E1%86%BE%20%E1%84%89%E1%85%A5%E1%84%87%E1%85%B5%E1%84%89%E1%85%B3%20%E1%84%82%E1%85%A6%E1%84%90%E1%85%B3%E1%84%8B%E1%85%AF%E1%84%8F%E1%85%B3%203db78d9b273d42e5aa2162f16170c531/Untitled.png)
        
        [Start working with Red Hat OpenShift 4 networks - IBM Developer](https://developer.ibm.com/tutorials/understanding-network-definitions-for-openshift-4-on-ibm-z-and-linuxone/)
        

- **Openshift 내장 DNS 서버**
    - 파드나 서비스에 IP 주소를 매핑하여 IP 주소 대신 이름을 사용할 수 있게 합니다.
- **서비스 사용 권장**
    - 파드 간의 직접적인 연결은 권장되지 않습니다.
    - 연결에는 서비스를 사용하는 것이 좋습니다.

### 예

- overlay network 의 기본 ID는 10.128.0.0/14
    - 각각의 노드에는 10.128.0.0/23, 10.128.2.0/23, 10.128.3.0/23 … 인 서브넷 제공
    - node1/project1/pod1 → 10.128.0.5
    - node2/project2/pod1 → 10.129.0.6
    
    ```yaml
    oc get pods -o wide # 각 파드에 할당된 IP 주소를 확인
    ```
    

![Figure 4.1: 쿠버네티스 SDN이 네트워크를 관리하는 방법](4-5%20Kubernetes%20%E1%84%91%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%86%E1%85%B5%E1%86%BE%20%E1%84%89%E1%85%A5%E1%84%87%E1%85%B5%E1%84%89%E1%85%B3%20%E1%84%82%E1%85%A6%E1%84%90%E1%85%B3%E1%84%8B%E1%85%AF%E1%84%8F%E1%85%B3%203db78d9b273d42e5aa2162f16170c531/Untitled%201.png)

Figure 4.1: 쿠버네티스 SDN이 네트워크를 관리하는 방법

# Service

![Figure 4.3: Problem with direct access to pods](4-5%20Kubernetes%20%E1%84%91%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%86%E1%85%B5%E1%86%BE%20%E1%84%89%E1%85%A5%E1%84%87%E1%85%B5%E1%84%89%E1%85%B3%20%E1%84%82%E1%85%A6%E1%84%90%E1%85%B3%E1%84%8B%E1%85%AF%E1%84%8F%E1%85%B3%203db78d9b273d42e5aa2162f16170c531/Untitled%202.png)

Figure 4.3: Problem with direct access to pods

- Openshift에서의 Service 개념은 Kubernetes와 동일하다
- **서비스 (Service)**
    - Kubernetes Cluster에서 같은 애플리케이션을 실행하는 컨트롤러의 파드 그룹에 단일 네트워크 진입점을 제공하는 오브젝트.
    - 서비스에 부여된 IP는 변경되지 않는다. (서비스가 종료될 때까지).
    - 클라이언트는 서비스의 IP 및 포트를 통해 파드에 접근.
    - kube-dns(coredns)가 적용된 경우, 서비스 이름을 기반으로 한 고유한 FQDN(Full Qualified Domain Name) 제공.
    
    ```yaml
    SVC-NAME.PROJECT-NAME.svc.CLUSTER-DOMAIN
    ```
    
    - 레이블 셀렉터를 사용하여 대상(백엔드) 파드를 설정. 이러한 선택된 파드의 목록은 엔드포인트(Endpoint) 리소스로 관리.
    - 여러 파드와 연결될 때, 라운드 로빈(Round Robin) 방식의 부하 분산 제공.
- **엔드포인트 (Endpoint)**
    - 서비스 오브젝트의 레이블 셀렉터에 의해 연결된 파드의 IP주소 목록을 관리하는 오브젝트.

![Figure 4.4: Services resolve pod failure issues](https://rol.redhat.com/rol/static/static_file_cache/do180-4.12/deploy/services/assets/multicontainer-fail-with-service.svg)

Figure 4.4: Services resolve pod failure issues

- `Before` 쪽은 IP 주소가 `10.8.0.1` 인 포드에서 실행 중인 `Front-end` 컨테이너를 나타낸다.
- 컨테이너는 IP 주소가 `10.8.0.2` 인 포드에서 실행 중인 `Back-end` 컨테이너도 참조합니다.
- `Back-end` 컨테이너가 실패하게 하는 이벤트가 발생
- 실패에 대한 응답으로 Kubernetes는 새 IP 주소인 `10.8.0.4`를 사용하는 `Back-end` 컨테이너에 대한 포드를 생성
- 다이어그램의 `After` 쪽에서 IP 주소 변경으로 인해 `Front-end` 컨테이너에 `Back-end` 컨테이너에 대한 잘못된 참조가 발생
- Kubernetes는 `service` 리소스를 사용하여 이 문제를 해결한다.

- 파드와 서비스의 연결 확인
    - 특정 파드가 어떤 서비스에 연결되어 있는지 확인할 수 있다.
    - 특정 프로젝트 내의 모든 파드의 이름을 반환합니다.
    
    ```bash
    oc get pods -o jsonpath='{.items[*].metadata.name}' -n <project_name>
    ```
    

## Service Selector

### **서비스의 Selector**

- 서비스의 **`selector`**는 key-value 쌍의 레이블이다.
- **`selector`**는 서비스가 어떤 파드에 트래픽을 전달할 것인지 결정하는 데 사용 된다.
    - **`selector`**는 서비스에 의해 관리되는 파드 집합을 결정하는 조건을 제공
- 예:  **`app=backend`**과 같은 **`selector`**가 있는 서비스는 **`app=backend`** 레이블이 붙은 모든 파드로 트래픽을 전달한다.
- 애플리케이션의 확장성, 가용성 및 유연성을 향상을 위해 사용된다.

![Untitled](4-5%20Kubernetes%20%E1%84%91%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%86%E1%85%B5%E1%86%BE%20%E1%84%89%E1%85%A5%E1%84%87%E1%85%B5%E1%84%89%E1%85%B3%20%E1%84%82%E1%85%A6%E1%84%90%E1%85%B3%E1%84%8B%E1%85%AF%E1%84%8F%E1%85%B3%203db78d9b273d42e5aa2162f16170c531/Untitled%203.png)

![Untitled](4-5%20Kubernetes%20%E1%84%91%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%86%E1%85%B5%E1%86%BE%20%E1%84%89%E1%85%A5%E1%84%87%E1%85%B5%E1%84%89%E1%85%B3%20%E1%84%82%E1%85%A6%E1%84%90%E1%85%B3%E1%84%8B%E1%85%AF%E1%84%8F%E1%85%B3%203db78d9b273d42e5aa2162f16170c531/Untitled%204.png)

### **서비스 Selector의 필요성**

- **파드 그룹화**: **`selector`**를 사용하면, 서비스는 여러 파드에 걸친 특정 애플리케이션의 특정 구성 요소나 기능을 그룹화할 수 있다.
    - 그룹화는 로드 밸런싱과 트래픽 라우팅에 중요한 역할을 한다.
- **로드 밸런싱**: 서비스는 **`selector`**에 의해 선택된 파드 집합 간에 들어오는 트래픽을 자동으로 로드 밸런싱 한다.
    - 안정성을 높이고, 특정 파드에 과부하가 걸리는 것을 방지한다.
- **자동 파드 검색**: 쿠버네티스 클러스터 내에서 파드가 생성되거나 종료될 때 마다 IP 주소가 변경될 수 있다.
    - 서비스의 **`selector`**는 이런 파드의 IP 주소 변화를 자동으로 감지하고 업데이트하여, 클라이언트가 항상 사용 가능한 파드에 연결될 수 있도록 한다.
- **statelessness 확보**: 서비스는 **`selector`**를 사용하여 상태를 저장하지 않는 파드 집합에 트래픽을 전달함으로써, stateless을 확보한다.
    - 이는 스케일링, 업데이트 및 유지 관리를 훨씬 쉽게 만듭니다.
- **애플리케이션 버전 관리**: 다른 버전의 애플리케이션 파드에 다른 레이블을 지정하고, 특정 서비스의 **`selector`**를 변경함으로써, 트래픽을 다른 애플리케이션 버전으로 라우팅할 수 있습니다.
    - 캔러리 배포나 블루-그린 배포 같은 전략을 적용할 수 있다.
    - 예: "버전 1" 레이블을 가진 파드와 "버전 2" 레이블을 가진 파드가 있을 때, **`selector`**를 변경하여 서비스가 어느 버전의 파드로 트래픽을 전달할지 결정할 수 있습니다

- **참고:** **Service Selector를 사용한 Statelessness 확보 예시**
    
    **무상태성(statelessness)란 무엇인가?**
    
    - 무상태성은 서비스나 애플리케이션의 각 요청이 서로 독립적이라는 의미
    - 즉, 이전 요청에서 어떤 상태나 데이터가 생성되었더라도 이후 요청은 그 상태나 데이터에 의존하지 않는다.
    - 이를 통해 각 파드는 독립적으로 동작하며, 하나의 파드가 실패하더라도 다른 파드가 그 요청을 처리할 수 있게 된다.
    
    **Service Selector를 사용한 Statelessness 확보 예시**
    
    - 사용자가 웹 페이지를 방문할 때마다 세션 정보를 저장해야 한다.
        - **상태 지향적 접근 방식:**
            - 사용자가 웹 페이지에 액세스하면, 파드는 세션 정보를 내부 메모리에 저장합니다.
            - 사용자가 동일한 웹 페이지를 다시 방문하면, 동일한 파드에 액세스해야 합니다. 그렇지 않으면 세션 정보를 잃게 된다.
        - **문제점:**
            - 이러한 방식은 파드의 수를 확장하거나 줄이는 경우 문제가 될 수 있다. 만약 한 파드가 다운되면 그 파드에 저장된 모든 세션 정보가 손실되기 때문!
            - 사용자가 계속해서 동일한 파드에 연결되도록 요청을 라우팅하는 것은 복잡하고 비효율적
        - **무상태적 접근 방식 (Service Selector 사용):**
            - 사용자가 웹 페이지에 액세스하면, 파드는 세션 정보를 외부 데이터베이스나 캐시에 저장한다.
            - 사용자가 웹 페이지를 다시 방문하면, 어떤 파드에 연결되더라도 외부 데이터베이스나 캐시에서 세션 정보를 검색할 수 있다.
            - 서비스 `selector`는 특정 레이블을 가진 모든 파드에 트래픽을 균등하게 분배한다.
        - **이점:**
            - 파드가 다운되더라도 세션 정보가 손실되지 않습니다.
            - 파드를 자유롭게 확장하거나 축소할 수 있습니다.
            - 모든 파드가 동일한 방식으로 처리할 수 있으므로 관리가 간단해집니다.
    

# POD SDN과 SERVICE SDN 을 이용한 네트워크 패킷 처리

- **Kubernetes Pod SDN (Software-Defined Network)**:
    - Kubernetes 클러스터 내의 각 Pod는 고유한 IP 주소를 가지며, SDN은 이러한 Pod 간의 통신을 가능하게 한다.
    - Pod A가 Pod B로 데이터를 전송하려고 할 때, SDN을 통해 직접 통신이 가능하다.
- **Kubernetes Service SDN**:
    - 서비스는 여러 Pod의 논리적인 집합을 대표하며, 이를 사용하여 Pod에 로드 밸런싱된 트래픽을 제공한다. Service는 SDN 위에 구축된 추상화 계층이다.
    - 클라이언트가 특정 서비스에 요청을 보내면, 서비스 SDN은 해당 요청을 백엔드의 적절한 Pod로 전달한다.

![Untitled](4-5%20Kubernetes%20%E1%84%91%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%86%E1%85%B5%E1%86%BE%20%E1%84%89%E1%85%A5%E1%84%87%E1%85%B5%E1%84%89%E1%85%B3%20%E1%84%82%E1%85%A6%E1%84%90%E1%85%B3%E1%84%8B%E1%85%AF%E1%84%8F%E1%85%B3%203db78d9b273d42e5aa2162f16170c531/Untitled%205.png)

- 웹어플리 케이션 요청 시나리오
    1. **외부 사용자의 요청**:
        - 사용자가 웹 페이지에 접속하기 위해 웹 주소를 입력하면, 해당 요청은 Kubernetes 클러스터로 전송된다.
        - **HostNetwork** 또는 외부 로드 밸런서를 사용
    2. **서비스로의 라우팅**:
        - 클러스터에 도착한 사용자의 요청은 Kubernetes의 서비스 객체에 의해 적절한 Pod로 라우팅된다.
        
        - **Service SDN**을 사용하여 적절한 Pod로 요청을 라우팅
        
    3. **프론트엔드 Pod 처리**:
        - 서비스로부터 요청을 받은 프론트엔드 Pod는 필요한 데이터를 가져오기 위해 백엔드 Pod로 요청을 전송한다.
        - **Pod SDN**을 사용하여 클러스터 내의 다른 Pod로 통신
    4. **백엔드 Pod와의 통신**:
        - 백엔드 Pod는 데이터를 처리한 후 프론트엔드 Pod에게 응답을 보낸다. 필요한 경우, 백엔드 Pod는 데이터베이스와 같은 다른 서비스로 추가적인 요청을 보낼 수 있다.
        - **Pod SDN** 을 사용하여 응답 전송
    5. **응답 반환**:
        - 모든 데이터 처리가 완료되면 프론트엔드 Pod는 원래의 사용자 요청에 대한 응답을 반환한다.
        - 응답은 **Service SDN**을 통해 외부 사용자에게 반환됩니다.

```bash
[user@host ~]$ oc get service db-pod -o wide
NAME    TYPE        CLUSTER-IP      EXTERNAL-IP PORT(S)     AGE     **SELECTOR**
db-pod  ClusterIP   172.30.108.92   <none>      3306/TCP    108s    **app=db-pod**
```

# **Red Hat OpenShift Container Platform (RHOCP)에서 지원하는 CNI(Container Network Interface) 플러그인**

1. **OVN-Kubernetes**
    - **기본 플러그인**: RHOCP 4.10부터 기본 네트워크 플러그인으로 사용됩니다.
    - **기능**: OVN(Open Virtual Network)을 사용하여 클러스터 네트워크를 관리합니다. 각 노드에서 OVS(Open vSwitch)를 실행하여 네트워크 구성을 구현합니다.
    - **기본 제공 버전**: RHOCP 4.14부터 OVN-Kubernetes는 기본 네트워크 프로바이더로 설정됩니다.
2. **OpenShift SDN**:
    - **이전 플러그인**: RHOCP 3.x에서 사용되었으며, RHOCP 4.x의 일부 최신 기능과 호환되지 않습니다.
3. **참고:** OVN-Kubernetes가 현재 기본 네트워크 플러그인으로 권장되며, OpenShift SDN은 점차적으로 사용이 중단될 예정
- 
- **참고:** OCP 4.14 가 Openshift SDN 을 사용하는 마지막 버전, OpenShift SDN CNI 대신 OVN Kubernetes CNI를 대신 사용할 수 있습니다. (변한건 거의 없다!)
    
    https://docs.redhat.com/ko-kr/documentation/openshift_container_platform/4.16/pdf/networking/OpenShift_Container_Platform-4.16-Networking-ko-KR.pdf(OCP 4.16 네트워킹 문서)