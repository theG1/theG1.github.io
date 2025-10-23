---
layout: default
title: 3장. 컨테이너 및 포드 실행
nav_order: 18
parent: Redhat OpenShift
---

# 3장. 애플리케이션을 컨테이너 및 포드로 실행

| 목적 | 컨테이너화된 애플리케이션을 관리되지 않는 Kubernetes 포드로 실행하고 트러블슈팅합니다. |
| --- | --- |
| 목표 | • 포드 내에서 컨테이너를 실행하고 해당 컨테이너에서 사용하는 호스트 OS 프로세스 및 네임스페이스를 식별합니다.
• 컨테이너 레지스트리에서 컨테이너화된 애플리케이션을 찾고 지원되는 컨테이너 이미지와 커뮤니티 컨테이너 이미지의 런타임 매개 변수에 대한 정보를 가져옵니다.
• 컨테이너에서 추가 프로세스를 시작하고, 임시 파일 시스템을 변경하며, 단기 네트워크 터널을 열어 포드를 문제 해결합니다. |

# 가상화

- 가상화는 하나의 물리적인 컴퓨터를 여러 대의 가상 컴퓨터로 나누어 사용하는 기술
- 기존에 물리적으로 존재하는 컴퓨터 하드웨어 자원을 효율적으로 사용할 수 있으며, 여러 사용자가 하나의 물리적인 자원을 공유할 수 있다.

## 가상화 종류

- `서버 가상화`
    - 서버 가상화는 하나의 물리적인 서버에 여러 대의 가상 서버를 생성하여 사용하는 기술입니다. 이를 통해 물리적 자원을 효율적 분배 가능
- `데스크톱 가상화`
    - 데스크톱 가상화는 하나의 물리적인 데스크톱 컴퓨터에서 여러 대의 가상 데스크톱을 생성하여 사용하는 기술입니다.
- `컨테이너 가상화`
    - 컨테이너 가상화는 운영체제 수준에서 가상화를 수행하는 기술
    - 컨테이너는 격리된 환경을 제공하여, 각각의 컨테이너는 독립적인 공간에서 실행됩니다. 이를 통해 서로 다른 애플리케이션을 실행하는 환경을 분리할 수 있으며, 환경에 따른 의존성 문제를 해결할 수 있습니다.
- `네트워크 가상화`

# **컨테이너**

![그림 3.1: 컨테이너의 애플리케이션과 호스트 운영 체제의 애플리케이션 비교](3%E1%84%8C%E1%85%A1%E1%86%BC%20%E1%84%8B%E1%85%A2%E1%84%91%E1%85%B3%E1%86%AF%E1%84%85%E1%85%B5%E1%84%8F%E1%85%A6%E1%84%8B%E1%85%B5%E1%84%89%E1%85%A7%E1%86%AB%E1%84%8B%E1%85%B3%E1%86%AF%20%E1%84%8F%E1%85%A5%E1%86%AB%E1%84%90%E1%85%A6%E1%84%8B%E1%85%B5%E1%84%82%E1%85%A5%20%E1%84%86%E1%85%B5%E1%86%BE%20%E1%84%91%E1%85%A9%E1%84%83%E1%85%B3%E1%84%85%E1%85%A9%20%E1%84%89%E1%85%B5%E1%86%AF%E1%84%92%E1%85%A2%E1%86%BC%20601cdaafcc1e467b8e42f65f49404623/Untitled.png)

그림 3.1: 컨테이너의 애플리케이션과 호스트 운영 체제의 애플리케이션 비교

## 개요

- Container : 컨테이너는 컨테이너 이미지의 실행 인스턴스이다.
- 캡슐화된 프로세스: 컨테이너는 필요한 런타임 종속성을 포함합니다.
- 독립성: 컨테이너 내의 애플리케이션 라이브러리는 호스트 OS와 독립적입니다.
- 호스트 커널과의 상호 작용: 호스트 커널은 다양한 라이브러리와 기능을 제공합니다.

## **컨테이너 사용의 필요성**

- 환경 일관성: 동일한 환경에서 개발부터 배포까지 관리 가능.
- 빠른 배포: 신속한 실행 및 중지가 가능.
- 리소스 효율성: 가상화보다 더 적은 리소스 오버헤드로 실행.

## **Container구성요소**

- **컨테이너 이미지**:
    - 정적 스냅샷: 애플리케이션의 코드, 라이브러리, 종속성 및 실행에 필요한 설정을 포함합니다.
    - 불변성: 이미지는 변경되지 않으며, 컨테이너 실행 시 이미지를 기반으로 생성됩니다.
- **컨테이너 런타임**:
    - 실행 엔진: 컨테이너 이미지를 기반으로 컨테이너 인스턴스를 시작, 정지 및 관리합니다.
    - 예: Docker, containerd, runc, **CRI-O** 등

```bash
Kubernetes
   │
   └─── CRI (Container Runtime Interface)
         │
         └─┬─ CRI-O (Container Runtime)
           │    └─── crictl (Command Line Interface Tool)
           │
           ├── Podman (Container Runtime)
           │    └─── podman CLI (Command Line Interface Tool)
           │
           ├── Docker (Container Runtime)
           │    └─── Docker CLI (Command Line Interface Tool)
           │
           └── containerd (Container Runtime)
                └─── ctr (Command Line Interface Tool for containerd)
```

- **컨테이너 오케스트레이션 도구**
    - 관리 및 스케줄링: 여러 컨테이너를 관리하고, 배포하고, 스케일링하는 데 사용됩니다.
    - 예: Openshift, Kubernetes, Docker Swarm, Apache Mesos 등
- 리눅스 커널
    - **네임스페이스 (Namespaces)**:
        - 프로세스 격리: 컨테이너의 프로세스와 파일 시스템을 호스트 및 다른 컨테이너로부터 분리합니다.
        - PID, NET, MNT, IPC, UTS, USER 등을 분리
    - **제어 그룹 (Control Groups; cgroups)**:
        - 리소스 할당 및 제한: CPU, 메모리, 네트워크 대역폭, 디스크 입출력 등의 리소스 사용을 제한하고 관리
- 그 외 : Union File System, Container Network, Storage
- 컨테이너 오케스트레이션은 여러 대의 컨테이너 호스트에서 컨테이너를 관리하고 조정하는 프로세스이다
- 컨테이너화된 애플리케이션의 배포, 확장, 로드 밸런싱, 자원 관리 등을 효율적으로 수행할 수 있다.
- k8s 는 Pod를 사용하여 Application Conatiner의 라이프사이클을 관리한다.

![[https://matthewpalmer.net/kubernetes-app-developer/articles/kubernetes-networking-guide-beginners.html](https://matthewpalmer.net/kubernetes-app-developer/articles/kubernetes-networking-guide-beginners.html)](3%E1%84%8C%E1%85%A1%E1%86%BC%20%E1%84%8B%E1%85%A2%E1%84%91%E1%85%B3%E1%86%AF%E1%84%85%E1%85%B5%E1%84%8F%E1%85%A6%E1%84%8B%E1%85%B5%E1%84%89%E1%85%A7%E1%86%AB%E1%84%8B%E1%85%B3%E1%86%AF%20%E1%84%8F%E1%85%A5%E1%86%AB%E1%84%90%E1%85%A6%E1%84%8B%E1%85%B5%E1%84%82%E1%85%A5%20%E1%84%86%E1%85%B5%E1%86%BE%20%E1%84%91%E1%85%A9%E1%84%83%E1%85%B3%E1%84%85%E1%85%A9%20%E1%84%89%E1%85%B5%E1%86%AF%E1%84%92%E1%85%A2%E1%86%BC%20601cdaafcc1e467b8e42f65f49404623/Untitled%201.png)

[https://matthewpalmer.net/kubernetes-app-developer/articles/kubernetes-networking-guide-beginners.html](https://matthewpalmer.net/kubernetes-app-developer/articles/kubernetes-networking-guide-beginners.html)

- 애플리케이션 컨테이너의 라이프사이클
    - 포드와 포드를 구성하며 애플리케이션을 포함하는 컨테이너에 대한 정의로 시작합니다.
    - 포드는 정상 노드에 할당됩니다.
    - 포드는 해당 컨테이너가 종료될 때까지 실행됩니다.
    - 포드와 해당 컨테이너가 노드에서 제거됩니다.

![그림 3.2: Kubernetes의 애플리케이션 라이프사이클](3%E1%84%8C%E1%85%A1%E1%86%BC%20%E1%84%8B%E1%85%A2%E1%84%91%E1%85%B3%E1%86%AF%E1%84%85%E1%85%B5%E1%84%8F%E1%85%A6%E1%84%8B%E1%85%B5%E1%84%89%E1%85%A7%E1%86%AB%E1%84%8B%E1%85%B3%E1%86%AF%20%E1%84%8F%E1%85%A5%E1%86%AB%E1%84%90%E1%85%A6%E1%84%8B%E1%85%B5%E1%84%82%E1%85%A5%20%E1%84%86%E1%85%B5%E1%86%BE%20%E1%84%91%E1%85%A9%E1%84%83%E1%85%B3%E1%84%85%E1%85%A9%20%E1%84%89%E1%85%B5%E1%86%AF%E1%84%92%E1%85%A2%E1%86%BC%20601cdaafcc1e467b8e42f65f49404623/Untitled%202.png)

그림 3.2: Kubernetes의 애플리케이션 라이프사이클

- 스케일 아웃 시나리오
    - Image registry 에서 이미지를 다운로드후 pod 생성
    - 2개의 어플리케이션의 CPU 사용률이 70%를 초과 하면 5개의 pod 로 스케일링 해야 한다고 선언
    - CPU 사용률이 70%를 초과하면, 추가 팟을 생성하여 부하를 분산시킨다. pod 수를 1씩 증가시켜 최대 팟 수인 5개까지 **스케일 아웃**
    - CPU 사용률이 70% 미만으로 감소하면, 불필요한 팟을 축소하여 리소스를 최적화합니다.  pod 수를 1씩 감소시키는 **스케일 인**을 수행한다. 최소 팟 수인 2개보다 적어지지 않도록 유지

- **컨테이너 및 포드 생성**: Kubernetes와 OpenShift는 컨테이너 이미지를 사용하여 포드에서 애플리케이션을 생성하고 배포하는 방법을 제공합니다.
    - **기본 run 명령**:
        
        ```bash
        oc run RESOURCE/NAME --image IMAGE [options]
        ```
        
        ```bash
        oc run web-server --image registry.access.redhat.com/ubi8/httpd-24
        ```
        
    - **-command 옵션**: 컨테이너 이미지의 기본 명령 대신 사용자 지정 명령을 실행합니다.
        
        ```bash
        oc run RESOURCE/NAME --image IMAGE --command -- cmd arg1 ... argN
        ```
        
    - **이중 대시 옵션**: 컨테이너 이미지의 기본 명령에 사용자 지정 인수를 제공합니다.
        
        ```bash
        oc run RESOURCE/NAME --image IMAGE -- arg1 arg2 ... argN
        ```
        
    - **대화형 세션 시작**: -it 옵션을 사용하면 대화형 세션이 시작된다.
        
        ```bash
        oc run -it my-app --image registry.access.redhat.com/ubi9/ubi --command -- /bin/bash
        ```
        
    - **restart 정책:**
        - **Always**: 포드가 성공적으로 종료될 경우, 클러스터는 컨테이너를 최대 5분 동안 계속 다시 시작하려고 시도합니다.
        - **OnFailure**: 클러스터는 포드에서 실패한 컨테이너만 최대 5분 동안 다시 시작합니다.
        - **Never**: 포드에서 컨테이너가 종료되거나 실패할 경우 클러스터는 다시 시작하지 않습니다.
        
        ```bash
        [user@host ~]$ oc run -it my-app-naver --image registry.access.redhat.com/ubi9/ubi --restart **Never** --command -- date
        ```
        
    - **포드 자동 삭제 (--rm 옵션)**: 포드가 종료된 후 자동으로 삭제
        
        ```bash
        [user@host ~]$ oc run -it my-app-rm **--rm** --image registry.access.redhat.com/ubi9/ubi --restart Never --command -- date
        ```
        
    - **환경 변수 설정 (--env= 옵션):** 환경 변수와 해당 값을 지정
        
        ```bash
        [user@host ~]$ oc run mysql --image registry.redhat.io/rhel9/mysql-80 --env MYSQL_ROOT_PASSWORD=myP@$$123
        ```
        

# **사용자 및 그룹 ID 할당**

- **사용자 및 그룹 ID 할당**
    - 프로젝트 생성 후 사용자 ID(UID) 및 보조 그룹 ID(GID) 범위가 결정됩니다.
        - 예) UID 는 1,000,740,000에서 시작하여 10,000개의 사용자 ID가 가능
        
        ```bash
        # oc describe project <project-name>
        [user@host ~]$ oc describe project my-app
        
        		annotations:   openshift.io/description=
        					   openshift.io/display-name=
        					   openshift.io/requester=developer
        					   openshift.io/sa.scc.mcs=s0:c27,c4
        					   openshift.io/sa.scc.supplemental-groups=1000710000/10000
        					   openshift.io/sa.scc.uid-range=1000710000/10000
        ```
        
    - OpenShift 기본 보안 정책:
        - 일반 사용자가 Pod 생성시, 컨테이너의 `USER` 또는 `UID` 선택 불가능.
        - 일반 사용자가 Pod 생성시, 컨테이너 이미지내의 정의된 `USER` 명령 무시.
        
        ```bash
        # Dockerfile
        USER nobody (무시되고 보안정책에 따른 사용자가 지정된다)
        ```
        
        - 컨테이너의 사용자는 root 그룹에 속하지만 권한이 없는 계정.
    - 클러스터 관리자가 포드 생성시:
        - 컨테이너 이미지의 `USER` 명령 처리.
        - 컨테이너가 root 권한으로 실행될 수 있음.
    - 권장 사항:
        - 컨테이너를 rootless로 실행.(sudo 사용 금지)
        - 권한이 없는 사용자로 컨테이너 실행.
        - 다양한 애플리케이션에서 컨테이너 실행시 고유한 사용자 ID 사용 권장.

# 실행중인 컨테이너에 명령 전달

```bash
oc exec 
oc exec mypod whoami
```

**단일 컨테이너 포드에서 명령 실행**

- 포드 내의 단일 컨테이너에서 명령을 실행하려면 `oc exec` 또는 `kubectl exec`를 사용하면 된다
    
    ```bash
    oc exec <POD_NAME> -- <COMMAND>
    ```
    

**다중 컨테이너 포드에서 특정 컨테이너에 명령 실행**

- 포드가 여러 개의 컨테이너를 포함하고 있을 때는 `c` 또는 `-container=` 옵션을 사용하여 원하는 컨테이너를 지정
    
    ```bash
    # POD내의 container name 확인
    oc get pod <POD_NAME> -o jsonpath='{.spec.containers[*].name}'
    
    oc exec <POD_NAME> -c <CONTAINER_NAME> -- <COMMAND>
    ```
    

**대화형 세션으로 명령 실행**

- 대화형 세션을 사용하여 컨테이너 내의 쉘에 접근하려면 `i` (표준 입력을 통한 입력을 허용)와 `t` (터미널 할당) 옵션을 함께 사용한다
    
    ```bash
    oc exec <POD_NAME> -c <CONTAINER_NAME> -it -- bash
    
    oc attach <POD_NAME> -c <CONTAINER_NAME> -it
    ```
    
    ```bash
    [user@host ~]$ oc attach my-app -it
    If you don't see a command prompt, try pressing enter.
    ```
    

### 컨테이너 로그 옵션

- **로그의 기본**
    - 컨테이너의 표준 출력(stdout) 및 표준 오류(stderr) 출력을 포함한다
    - `kubectl` 및 `oc CLI`를 사용하여 `logs pod pod-name` 명령으로 검색 가능.
- **옵션들**
    - `l` or `-selector=''`
        - 지정된 `key:value` 레이블 제약 조건을 기반으로 오브젝트를 필터링합니다.
    - `-tail=`
        - 표시할 최근 로그 파일의 행 수를 지정합니다.
        - 기본값은 선택기가 없는 `1`로, 이는 모든 로그 행을 표시합니다.
    - `c` or `-container=`
        - 다중 컨테이너 포드에서 특정 컨테이너의 로그를 출력합니다.
    - `f` or `-follow`
        - 컨테이너의 로그를 실시간으로 추적하거나 스트리밍합니다.
    - `p` or `-previous=true`
        - 포드의 이전 컨테이너 인스턴스(있는 경우)의 로그를 출력합니다.
        - 시작하지 못한 포드의 트러블슈팅에 유용하게 사용됩니다.

```bash
# 단일 컨테이너
oc logs <PODNAME>
# 다중 컨테이너
oc logs <PODNAME> -c <CONTAINERNAME>

[user@host ~]$ oc logs postgresql-1-jw89j --tail=10
```

---

# 리소스 삭제

- **기본 명령**: `delete`
    - Kubernetes 리소스(예: pod)를 삭제하기 위한 명령입니다.
- **리소스 유형 & 이름 사용**
    
    ```bash
    [user@host ~]$ oc delete pod php-app
    ```
    
- **레이블 기반 삭제**
    - `l` 옵션과 함께 `key:value` 레이블을 사용합니다.
    
    ```bash
    [user@host ~]$ oc delete pod -l app=my-app
    ```
    
- **파일 기반 삭제**
    - `f` 옵션과 함께 JSON 또는 YAML 형식의 파일 경로를 제공합니다.
    
    ```bash
    [user@host ~]$ oc delete pod -f ~/php-app.json
    ```
    
- **stdin 사용**
    - 리소스 유형 및 이름 정보가 포함된 JSON 또는 YAML 형식의 데이터를 `delete` 명령과 함께 사용합니다.
    
    ```bash
    [user@host ~]$ cat ~/php-app.json | oc delete -f -
    ```
    
- **유예 기간 설정**
    - 포드의 단계적 종료 지원
    - `-grace-period` 플래그와 함께 시간(초)을 설정합니다.
    
    ```bash
    [user@host ~]$ oc delete pod php-app --grace-period=10
    [user@host ~]$ oc delete pod php-app --now # 유예
    ```
    
- **즉시 종료**
    - 유예 기간을 1초로 설정하거나 `-now` 플래그를 사용합
- **강제 삭제**
    - `-force` 옵션 사용
    - 예: `[user@host ~]$ kubectl delete pod php-app --force`
- **프로젝트 내 모든 포드 삭제**
    - `-all` 옵션 사용
    - 예: `[user@host ~]$ kubectl delete pods --all`
- **프로젝트 및 관련 리소스 삭제**
    - 예: `[user@host ~]$ oc delete project my-app`

# crictl

- CRI (Container Runtime Interface)와 상호 작용하기 위한 CLI  도구
- container 를 호스팅 하는 node 에서 직접적으로 container 를 관리할수 있다.

```bash
oc get pods -o wide # pod 실행 node 확인
oc debug node/master01 # pod 실행 node 로 접근

sh-4.4# chroot /host
sh-5.1# crictl ps # container 확인
```

- **`crictl`** 도구를 사용하면 CRI를 지원하는 컨테이너 런타임에 대한 다양한 작업을 수행가능
    - **Pods 관리**: Pod의 생성, 시작, 정지, 삭제 등의 작업을 수행
    
    ```bash
    sh-5.1# crictl pods
    ```
    
    - **컨테이너 관리**: 컨테이너의 생성, 시작, 정지, 삭제, 로그 조회 등의 작업을 수행
    
    ```bash
    sh-5.1# crictl ps
    ```
    
    - **이미지 관리**: 이미지의 풀 (pull), 삭제, 리스트 조회 등의 작업을 수행
    
    ```bash
    sh-5.1# crictl images
    ```
    

[](https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md)

- Container의 Namespace와 Process ID 확인
    - Container engine과 인터페이스하기 위해 crictl을 사용하면 Container의 ID와 Pod의 ID를 확인할 수 있습니다.
    - `crictl inspect -o json` 명령을 사용하여 Container의 Process ID를 확인할 수 있습니다.
    - `lsns` 명령을 사용하여 해당 Process ID를 가진 Namespace의 내용을 확인할 수 있습니다.
    - 예제 코드:
    
    ```
    crictl ps | grep web1
    crictl inspect -o json <container_id> | jq .info.pid
    lsns -p <process_id>
    
    ```