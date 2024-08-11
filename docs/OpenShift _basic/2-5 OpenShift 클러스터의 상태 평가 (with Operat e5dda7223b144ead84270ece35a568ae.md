# 2-5 OpenShift 클러스터의 상태 평가 (with Operator)

![Untitled](2-5%20OpenShift%20%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A5%E1%84%89%E1%85%B3%E1%84%90%E1%85%A5%E1%84%8B%E1%85%B4%20%E1%84%89%E1%85%A1%E1%86%BC%E1%84%90%E1%85%A2%20%E1%84%91%E1%85%A7%E1%86%BC%E1%84%80%E1%85%A1%20(with%20Operat%20e5dda7223b144ead84270ece35a568ae/Untitled.png)

[https://www.cncf.io/blog/2022/06/15/kubernetes-operators-what-are-they-some-examples/](https://www.cncf.io/blog/2022/06/15/kubernetes-operators-what-are-they-some-examples/)

### **Operator란?**

- OpenShift와 Kubernetes 환경에서 커스텀 리소스의 관리와 운영을 간소화하는 프레임워크.
    - Control Plane 에서 서비스를 패키징, 배포, 관리 하는데 선호 되는 방법
- 사용자가 커스텀하게 리소스를 정의하고, 해당 리소스의 생명 주기를 자동화하여 관리.
- Operator SDK를 통해 개발자는 Operator를 쉽게 생성, 테스트 및 배포할 수 있음.

- **예시: metalLB-operator**
    - MetalLB는 Kubernetes 클러스터에 로드 밸런싱 기능을 제공하는 소프트웨어로, MetalLB Operator는 이 MetalLB를 더 쉽게 배포하고 관리하는 도구

[https://github.com/openshift/metallb-operator](https://github.com/openshift/metallb-operator)

### **Operator의 기능**

- **자동화된 관리:** OpenShift Operator는 애플리케이션의 배포 및 업그레이드를 자동화하며, 관련된 설정과 상태 정보를 관리합니다.
- **상태 모니터링:** 지속적으로 애플리케이션 및 서비스의 상태를 모니터링하며 필요한 경우 복구 작업을 수행합니다.
- **CRD 관리:** 사용자 정의 리소스 정의 (CRD)를 통해 커스텀 리소스를 정의하고, 해당 리소스의 관리와 연산을 자동화합니다.

### **Operator의 특징**

- **확장성:** OpenShift의 Operator Hub에서 다양한 애플리케이션 및 서비스에 대한 Operator를 찾을 수 있습니다. 이를 통해 플랫폼의 기능을 확장할 수 있습니다.
- **유연성:** CRD 를 기반으로 애플리케이션 및 서비스의 특정 요구 사항과 로직을 구현할 수 있습니다.
- **생태계:** Red Hat와 커뮤니티에서 지원하는 다양한 Operator가 있다.

### **Operator의 구조**

- **Custom Resource (CR)**
    - Operator가 관리하는 주 객체. 사용자는 CR을 생성하거나 수정함으로써 Operator에게 원하는 동작을 지시한다.
- **Custom Resource Definition (CRD)**
    - CR의 스키마를 정의하며, 어떤 종류의 CR이 Operator에 의해 관리될 수 있는지를 Kubernetes에 알려준다
    
    ```bash
    oc get crds
    ```
    
- **Controller**
    - CR의 상태를 지속적으로 관찰하고, 원하는 상태(Desired State)와 현재 상태(Current State)를 일치시키기 위한 로직을 포함한다.
- **Operator SDK**
    - Operator를 쉽게 생성, 테스트 및 배포하기 위한 도구.
    - **OpenShift Operator SDK의 주요 기능**
        1. **부트스트래핑 (Bootstrapping)**: 새로운 Operator 프로젝트의 초기 구조를 생성합니다.
        2. **로컬 테스트**: 로컬 환경에서 Operator의 테스트를 쉽게 진행할 수 있게 합니다.
        3. **SDK API**: Kubernetes 리소스와 상호 작용하는 코드를 쉽게 작성할 수 있게 도와줍니다.
        4. **생성과 배포**: Operator의 컨테이너 이미지를 빌드하고, 배포를 위한 매니페스트를 생성합니다.
        5. **메트릭과 모니터링**: Prometheus와 같은 도구와 연동하여 Operator의 메트릭 및 모니터링을 지원합니다.
    - **Operator SDK의 종류**
        1. **Go**: Go 언어로 작성된 Operator의 개발과 관리를 지원
            
            [[kubernetes] operator-sdk를 사용하여 쿠버네티스 오퍼레이터 구축하기 (operator sdk 예제)](https://frozenpond.tistory.com/146)
            
        2. **Ansible**: Ansible을 사용하여 Operator 로직을 작성할 수 있게 합니다. 기존의 Ansible Playbook과 Role을 재사용하여 Operator를 생성하는 데 유용하다.
            - Ansible Playbook을 사용하여 데이터베이스를 백업하고 복원하는 Operator.
        3. **Helm**: Helm 차트를 기반으로 Operator를 생성합니다. 기존 Helm 차트를 Operator로 변환하는 데 사용될 수 있다.
            - Helm 차트를 기반으로 Nginx 인스턴스를 배포하고 관리하는 Operator.

### **Operator의 동작 방식**

- 쿠버네티스의 제어 루프(Reconciliation Loop) 패턴에 기반하며, Operator는 이 패턴을 사용하여 **애플리케이션 및 서비스의 생명 주기를 관리**한다.
1. **Observe**: Operator 내의 컨트롤러는 Kubernetes API를 주기적으로 폴링하여 **CR의 상태를 관찰**합니다.
2. **Analyze**: 관찰한 상태와 CR에 정의된 원하는 상태를 비교합니다. 원하는 상태와 현재 상태가 다른 경우, 조정이 필요하다고 판단됩니다.
3. **Act**: Operator는 필요한 조치를 수행하여 현재 상태를 원하는 상태에 맞추려고 합니다. 이는 리소스의 생성, 수정, 삭제와 같은 Kubernetes API 호출을 통해 수행됩니다.

### **Operator의 사용법**

- **설치:** OpenShift의 Operator Hub를 통해 필요한 Operator를 검색하고 설치합니다.
- **CRD 정의:** 특정 애플리케이션 또는 서비스의 요구 사항에 맞게 CRD를 정의합니다.
- **생명 주기 관리:** Operator를 사용하여 애플리케이션 및 서비스의 설치, 업그레이드, 백업, 복구 등의 작업을 자동화합니다.

# Operator의 용도별 분류

- **클러스터 수준 Operator**: 전체 클러스터의 버전과 핵심 컴포넌트 관리를 담당 (예: CVO).
- **애플리케이션 수준 Operator**: 특정 애플리케이션이나 서비스의 배포 및 생명주기를 관리 (예: OLM).
- **도메인/애플리케이션 특정 Operator**: 특정 애플리케이션의 라이프사이클을 자동화 (예: [MetalLB Operator](https://github.com/openshift/metallb-operator), [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator)).
- **유틸리티 및 관리 도구 Operator**: 인증서 관리, 서비스 메쉬 설정 등 다양한 관리 기능 제공 (예: [Cert-Manager Operator](https://github.com/openshift/cert-manager-operator), [Istio Operator](https://istio.io/latest/docs/setup/install/operator/)).
- 

```yaml
oc get operators
```

## CVO (Cluster Version Operator)

- CVO는 OpenShift 클러스터의 버전 관리를 담당
- 클러스터의 업그레이드 및 관리를 총괄하는 역할을 담당하며, OpenShift 컴포넌트를 현재 버전에서 새로운 버전으로 안전하게 업그레이드하는 프로세스를 총괄한다.

### 특징

- CVO는 OpenShift 클러스터의 전체 컴포넌트와 자원의 버전 업그레이드를 책임집니다.
- 일관된 업그레이드 순서를 보장하여 업그레이드 프로세스의 안정성을 유지합니다.
- 버전 관련 문제가 발생할 경우 자동 복구 기능을 제공합니다.

### Cluster Operator example

```bash
oc get clusteroperators
```

- Available: ‘true’이면 오퍼레이터가 정상적으로 작동하고 있음을 의미
- Progressing: ‘false’이면 오퍼레이터가 현재 수정 중이 아니고, 업그레이드 중이지 않다는걸 의미
- Degraded: ‘false’이면 오퍼레이터가 사용 가능한 상태를 나타냄
- Last Transition Time: 상태가 마지막으로 변경된 시간을 나타냄

```bash
oc get clusterversion # 클러스터 버전조회 (openshift version)
oc describe clusterversion # 클러스터 버전 업데이트 상태 확인
```

```bash
oc get pods -n openshift-dns-operator
oc get pod -n openshift-dns-operator dns-operator-<number> -o json | jq .status
```

## OLM (Operator Lifecycle Manager)

- OLM은 쿠버네티스 및 OpenShift 클러스터에서 Operator의 설치, 업그레이드 및 관리를 담당
- Operator의 전체 라이프사이클을 관리하는 툴로 사용된다.
    
    ![Untitled](2-5%20OpenShift%20%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A5%E1%84%89%E1%85%B3%E1%84%90%E1%85%A5%E1%84%8B%E1%85%B4%20%E1%84%89%E1%85%A1%E1%86%BC%E1%84%90%E1%85%A2%20%E1%84%91%E1%85%A7%E1%86%BC%E1%84%80%E1%85%A1%20(with%20Operat%20e5dda7223b144ead84270ece35a568ae/Untitled%201.png)
    

### 특징

- OLM은 Operator의 안정적인 배포 및 업그레이드를 지원합니다.
    - OLM을 사용하여 클러스터에 Operator를 쉽게 설치
    - Operator의 새 버전이 출시될 때 자동으로 안정적인 업그레이드를 지원
- Operator의 의존성 관리를 자동으로 처리합니다.
- Operator의 라이센스 및 카탈로그 관리 기능을 제공합니다.
- OLM은 설치된 Operator의 관리와 모니터링을 제공하여 클러스터의 안정성을 유지합니다.

# 역할별 operator 작업 분류

## 개발자

- **Operator 생성:** Go, Ansible 또는 Helm을 기반으로 하는 Operator를 생성할 수 있습니다. 이를 통해 다양한 프레임워크와 툴체인을 사용하여 Operator를 구축할 수 있습니다.
- **Operator 빌드, 테스트 및 배포:** Operator SDK는 Operator의 빌드, 테스트, 그리고 배포 과정을 단순화 합니다.
- **Operator 설치 및 등록:** 생성된 Operator는 쿠버네티스 클러스터 내의 특정 네임스페이스에 설치 및 등록되어야 합니다.
- **웹 콘솔을 통한 애플리케이션 생성:** 설치된 Operator를 사용하여 웹 콘솔을 통해 새로운 애플리케이션 인스턴스를 생성할 수 있습니다.

### 관리자

- **사용자 정의 카탈로그 관리:** 관리자는 사용자 정의 카탈로그를 관리하여 Operator를 구성하고 관리할 수 있습니다.
- **OperatorHub에서의 Operator 설치:** OperatorHub는 다양한 Operator들을 포함하며, 관리자는 이를 통해 필요한 Operator를 클러스터에 설치할 수 있습니다.
- **Operator 상태 확인:** 설치된 Operator의 상태와 동작을 모니터링하고 확인할 수 있습니다.
- **Operator 조건 관리:** Operator의 상태나 조건을 관리하며 필요에 따라 수정할 수 있습니다.
- **설치된 Operator 업그레이드:** Operator의 새로운 버전이 출시될 경우, 기존에 설치된 Operator를 업그레이드할 수 있습니다.
- **설치된 Operator 삭제:** 필요 없어진 Operator는 클러스터에서 삭제할 수 있습니다.
- **프록시 지원 구성:** 클러스터의 네트워크 설정에 따라, Operator에 프록시를 구성하여 외부 리소스에 접근할 수 있게 합니다.
- **제한된 네트워크에서의 Operator Lifecycle Manager 사용:** 특정 네트워크 정책이나 제한된 네트워크 환경에서도 Operator Lifecycle Manager를 사용하여 Operator의 라이프사이클을 관리합니다.

# OpenShift 클러스터 관리

- 모든 프로젝트에 대한 pods 또는 deployments 보기:
    - `oc get deploy -A` : 모든 프로젝트를 대상으로 pods 또는 deployments를 볼 수 있다.
    
    ```yaml
    oc get pod -A
    oc get deploy -A
    ```
    
- 리소스 사용량 확인:
    - `oc adm top pods` : 모든 네임스페이스에 걸친 pods의 리소스 사용량을 확인할 수 있다. 여기서 m은 밀리코어를, Mi는 메비바이트를 의미한다.
    
    ```yaml
    oc adm top pods -A --sum
    oc adm top pods # 클러스터 노드 및 포드의 계산 리소스 사용량을 검사
    oc adm top pods --containers #컨테이너의 리소스 사용량을 나열
    ```
    
    - 예시 코드: `oc adm top pods -A --sort-by=.metadata.name`

## OpenShift 클러스터 로그 및 이벤트 확인

- 오퍼레이터는 클러스터의 특정 리소스를 자동으로 관리하고, 이벤트 로그는 이러한 리소스의 상태 변화와 문제를 기록 한다.

- 노드 로그 확인:
    - `oc adm node-logs`를 사용하여 노드의 로그를 볼 수 있다. 이는 시스템의 특정 unit에 대한 로그를 제공하며, API를 통해 직접 노드에 연결할 필요가 없다.
    
    ```bash
    oc adm node-logs master01 -u crio
    ```
    
- Pod 로그 확인:
    - `oc logs` 명령어를 사용하여 Pod의 로그를 볼 수 있다. 이는 컨테이너 시작 시 실행되는 엔트리 포인트의 출력을 보여준다.
    
    ```bash
    oc logs <pod_name> (실제 pod 이름으로 대체)
    ```
    
- 이벤트 확인:
    - `oc get events`를 사용하여 프로젝트 또는 네임스페이스의 이벤트를 확인할 수 있다. 그러나 이 명령어는 이벤트를 시간순으로 정렬하지 않는다.
    
    ```bash
    oc get events --sort-by=.lastTimestamp
    ```
    
- Must-Gather:
    - `oc adm must-gather`는 Red Hat에서 제공하는 OpenShift의 진단 데이터 수집 도구이다. 이 도구는 SOS report와 유사하게 작동하며, 필요한 진단 데이터를 수집하여 지정한 디렉토리에 저장한다.
    
    ```bash
    oc adm must-gather --dest-dir=<destination_directory>
    ```
    

# OpenShift CLI와 Web Console 이용하기

- 클러스터 데이터 수집
    - OpenShift CLI 명령어를 사용해 클러스터의 디버깅 정보를 수집할 수 있음
    
    ```bash
    oc adm inspect cluster --dest-dir ./debugging-data/
    ```
    
- 특정 리소스의 디버깅 데이터 수집
    - `oc adm inspect` 명령을 사용해 특정 리소스의 디버깅 데이터를 수집하ß고 파일에 쓸 수 있음
    
    ```bash
    oc adm inspect deployment/web1 --dest-dir ./deploy_web1/
    ```
    
- OpenShift Web Console 이용
    - 클러스터 연산자, OpenShift 버전, 사용자 정의 리소스 정의, 프로젝트 이벤트 등 다양한 정보를 효과적으로 이용할 수 있음
    - 웹 기반 인터페이스를 통해 YAML을 수정하는 데 실수를 줄일 수 있음

# OpenShift 모니터링 및 알림

- Grafana 대시보드 이용
    - OpenShift의 'Observe' 섹션을 통해 Grafana 대시보드에 접근 가능
    - 특정 네임스페이스의 리소스 사용량을 시각화할 수 있음
- AlertManager 이용
    - AlertManager를 통해 특정 조건에 따라 경고를 생성하고 알림을 보낼 수 있음
    - 예시: 룰을 만들어 조건에 따라 경고가 발생하면 이메일 알림을 받음
- Prometheus 이용
    - Prometheus는 모니터링 데이터를 저장하며, OpenShift에 기본으로 통합되어 있음
    - Prometheus Query Language (promQL)를 이용해 원하는 정보를 추출할 수 있음
    - 예시: 특정 노드에서 사용 가능한 메모리가 50% 미만인 경우를 검색하는 쿼리 생성
    

# 134p 퀴즈

1. **지원되는 API 리소스 중 oauth.openshift.io api-group의 멤버는 무엇입니까?**

```bash
# oauth.openshift.io api-group의 모든 리소스를 나열
oc api-resources --api-group=oauth.openshift.io
```

1. **다음 중 pod.spec.securityContext 오브젝트의 멤버인 필드 두 개는 무엇입니까? (두 개 선택)**

```bash
# pod.spec.securityContext 오브젝트의 모든 필드와 해당 설명을 나열
oc explain pod.spec.securityContext
```

1. **다음 중 master01 노드의 조건을 표시하는 명령 세 개는 무엇입니까? (세 개 선택)**

```bash
oc get node/master01 -o json | jq '.status.conditions'
oc get node/master01 -o yaml
oc get node/master01 -o json
```

1. **컨트롤 플레인 노드의 조건 유형으로 유효한 항목 두 개를 선택하십시오. (두 개 선택)**

```bash
# master01 노드의 상태 조건을 조회
oc get node master01 -o json | jq '.status.conditions'
```

1. **oc adm top pods 명령의 옵션으로 유효한 항목 세 개를 선택하십시오. (세 개 선택)**

```bash
oc adm top pods -A
oc adm top pods --sum
oc adm top --containers
```