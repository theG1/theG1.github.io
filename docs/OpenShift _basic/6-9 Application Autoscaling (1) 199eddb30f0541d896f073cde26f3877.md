# 6-9 Application Autoscaling (1)

## 목표

- 어플리케이션에 대한 수평 포드 오토스케일러(Horizontal Pod Autoscaler, HPA)를 구성합니다.
- HPA 리소스 유형을 사용하여 어플리케이션 포드의 현재 부하에 따라 배포를 오토스케일링합니다.

- **수평 오토스케일링 (HPA)**: 포드의 수를 동적으로 조정하여 부하를 분산시키고 고가용성을 보장합니다.
- **수직 오토스케일링 (VPA)**: 개별 포드의 리소스(CPU, Memory)를 동적으로 조정하여 성능을 향상시키고 리소스 효율성을 극대화합니다.

## 오토스케일러 기능

- 오토스케일러는 기본적으로 15초마다 다음 단계를 수행합니다:
    - HPA 리소스에서 스케일링을 위한 메트릭 세부 정보를 가져옵니다.
    - 타겟팅된 각 포드에 대해 메트릭 서브시스템에서 메트릭을 수집합니다.
    - 수집된 메트릭과 포드 리소스 요청에서 사용률을 계산합니다.
    - 타겟팅된 모든 포드에 대해 평균 사용량과 리소스 요청을 계산합니다.
    - 사용률 비율을 설정하고 이를 기반으로 스케일링 결정을 내립니다.

## 수평 포드 오토스케일러 생성

- **`oc autoscale` 명령어 사용:**
    
    ```bash
    oc autoscale deployment/hello --min 1 --max 10 --cpu-percent 80
    
    ```
    
    - 이 명령어는 포드의 CPU 사용률이 80% 이하로 유지되도록 hello 배포의 레플리카 수를 조정하는 HPA 리소스를 생성합니다.
- **YAML 파일 사용:**
    
    ```yaml
    apiVersion: autoscaling/v2
    kind: HorizontalPodAutoscaler
    metadata:
      name: hello
    spec:
      minReplicas: 1
      maxReplicas: 10
      metrics:
      - resource:
          name: cpu
          target:
            averageUtilization: 80
            type: Utilization
        type: Resource
      scaleTargetRef:
        apiVersion: apps/v1
        kind: Deployment
        name: hello
    
    ```
    
    - YAML 파일을 적용합니다:
    
    ```bash
    oc apply -f hello-hpa.yaml
    
    ```
    

## HPA 모니터링

- HPA 리소스에 대한 정보를 얻으려면 `oc get hpa` 명령어를 사용합니다:
    
    ```bash
    oc get hpa
    ```
    
    - `TARGETS` 열에 `<unknown>`이 표시되면 업데이트하는 데 최대 5분이 걸릴 수 있습니다.
    - `<unknown>` 값이 지속되면 메트릭에 대한 리소스 요청이 누락되었음을 나타냅니다.

## 웹 콘솔에서 생성

- Workloads → HorizontalPodAutoscalers 메뉴로 이동합니다.
- "Create HorizontalPodAutoscaler"을 클릭하고 YAML 매니페스트를 사용자 정의합니다.

## 중요한 참고 사항

- `oc create deployment` 명령어로 생성된 포드는 기본적으로 리소스 요청을 정의하지 않습니다.
- HPA 리소스는 올바르게 작동하기 위해 정의된 리소스 요청이 필요합니다.
- 오토스케일러는 CPU 또는 메모리 사용량을 기준으로 스케일링할 수 있습니다.
- 레플리카 수가 증가함에 따라 전체 메모리 사용량이 증가하는 애플리케이션은 메모리 기반 오토스케일링에 적합하지 않을 수 있습니다.

# 예시

## 시나리오

OpenShift에서 웹 애플리케이션을 배포하고 수동 개입 없이 다양한 부하를 처리할 수 있도록 설정합니다.

## 단계

- 웹 애플리케이션 배포를 생성합니다:
    
    ```bash
    oc create deployment webapp --image=mywebapp:latest
    ```
    
- 배포에 대한 리소스 요청을 정의합니다:
    
    ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: webapp
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: webapp
      template:
        metadata:
          labels:
            app: webapp
        spec:
          containers:
          - name: webapp
            image: mywebapp:latest
            resources:
              requests:
                cpu: "100m"
                memory: "200Mi"
              limits:
                cpu: "500m"
                memory: "500Mi"
    
    ```
    
- 배포 설정을 적용합니다:
    
    ```bash
    oc apply -f webapp-deployment.yaml
    
    ```
    
- 배포에 대한 HPA를 생성합니다:
    
    ```bash
    oc autoscale deployment/webapp --min 1 --max 5 --cpu-percent 70
    
    ```
    
- HPA 생성 및 상태를 확인합니다:
    
    ```bash
    oc get hpa
    
    ```