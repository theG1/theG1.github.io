---
title: "docker 빌드, 배포하기"
sidebar:
  order: 7
---

docker (container) 빌드와 배포 경험을 통해 장점을 이해한다.

vm과 container의 차이

컨테이너를 이루는 코드 구조

만들어진 py 앱을 먼저 준비합니다

이제 claude code 한테 물어봐서 진행합니다.

> _Claude Code에서_ 내 “[소스코드.py](http://xn--hy1bp4v9xah58a.py)” 파일을 가지고 도커로 올리고 싶어, 필요한 파일을 만들어주고 명령어를 알려줘

**Docker와 컨테이너는 소스코드(.py) 파일, requirements.txt, Dockerfile 세 가지만 있으면 한 줄의 명령어로 구동할 수 있습니다.**

```
디렉토리(프로젝트)/
├── abcd.py                      # 메인 Streamlit 애플리케이션
├── Dockerfile                   # Docker 이미지 빌드 설정
├── requirements.txt             # Python 패키지 의존성
└── .dockerignore                # 필수 아님. 정보 보호를 위한 조치
```

예제 1

requirements.txt

```
streamlit
requests
python-detenv
openai
```

심화 예제

```
# 기본 패키지
streamlit
requests

# PDF 텍스트 추출
PyPDF2

# 이미지 처리
Pillow

# 이미지 OCR (Tesseract - 기존 방식)
pytesseract

# Base64 인코딩 (표준 라이브러리)
# base64

# 날짜/시간 처리 (표준 라이브러리이므로 설치 불필요하지만 명시)
# datetime

# 타이핑 (표준 라이브러리)
# typing

# 참고: Gemma3 멀티모달 OCR은 외부 API를 사용하므로 추가 패키지 불필요

```

#처리 되어있는 것은 주석입니다. 참고로 작성되었습니다.

예제2 Dockerfile

```docker
# 1. Python 베이스 이미지 선택
FROM python:3.11-slim

# 2. 메타데이터 추가
LABEL maintainer="Gemma AI Chatbot"
LABEL description="Streamlit chatbot using Gemma API"

# 3. 작업 디렉토리 설정
WORKDIR /app

# 4. 시스템 패키지 업데이트 및 정리
RUN apt-get update && apt-get install -y --no-install-recommends \\
    curl \\
    && rm -rf /var/lib/apt/lists/*

# 5. requirements 설치 (캐시 최적화)
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \\
    pip install --no-cache-dir -r requirements.txt

# 6. 앱 코드 복사 (필요한 파일만)
COPY [abcd.py](<http://abcd.py>) .

# 7. 비root 사용자 생성 (보안 강화)
RUN useradd --create-home --shell /bin/bash appuser && \\
    chown -R appuser:appuser /app
USER appuser

# 8. 헬스체크 추가
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\
  CMD curl -f <http://localhost:8501> || exit 1

# 9. 포트 노출
EXPOSE 8501

# 10. 실행 명령
CMD ["streamlit", "run", "[abcd.py](<http://abcd.py>)", \\
     "--server.address=0.0.0.0", \\
     "--server.port=8501", \\
     "--server.headless=true", \\
     "--server.enableCORS=false", \\
     "--server.enableXsrfProtection=false"]
```

### .dockerignore 추가 (권장)

```
.venv/
__pycache__/
*.pyc
*.log
.env
.git
.gitignore
.DS_Store
```

계정 정보나, 가상환경, 키값들이 애플리케이션에 저장되는 것을 막기위해 제외하는 파일을 지정하는 용도로 사용됩니다.

### 컨테이너의 배포과정

### 1) 이미지 빌드

프로젝트 루트(.py파일이 있는 폴더)에서 실행합니다.

```bash
docker build -t 이미지이름:태그 .   # "." 점까지 찍어야 폴더내의 모든 파일을 활용합니다.
docker build -t my-streamlit:latest .
```

- -t 는 이미지 이름:태그 형식입니다. 필요하면 바꾸세요.
    
- 빌드되어 올라온 이미지 확인
    

```bash
docker images  #컨테이너 이미지 확인 명령어

# 출력 예제
REPOSITORY                      TAG         IMAGE ID       CREATED        SIZE
chatbot                         latest      9e2dd74fc284   2 weeks ago    560MB
my-st-app                       latest      6639df039e20   3 weeks ago    540MB
<none>                          <none>      11217ace2275   3 weeks ago    540MB
<none>                          <none>      cccc7c00906f   3 weeks ago    540MB
my-streamlit-app                latest      cc4d692b905f   3 weeks ago    540MB
<none>                          <none>      f422101ff8ba   3 weeks ago    540MB
<none>                          <none>      fa9643e1d2ed   3 weeks ago    540MB
python                          3.11-slim   c4640ec0986f   2 months ago   125MB
ghcr.io/open-webui/open-webui   main        21bb7e0892cf   2 months ago   4.78GB
nginx                           latest      2cd1d97f893f   3 months ago   192MB
ollama/ollama                   latest      029391db139c   3 months ago   2.27GB
gcr.io/k8s-minikube/kicbase     v0.0.46     e72c4cbe9b29   9 months ago   1.31GB
```

### 2) 컨테이너 실행

```bash
# Docker 컨테이너 실행 명령어
docker run --rm -it \\                # 컨테이너를 실행하고, 종료 시 자동 삭제(--rm), 인터랙티브 터미널 모드(-it)
  -p 8501:8501 \\                     # 호스트의 8501 포트를 컨테이너의 8501 포트에 매핑 (Streamlit 기본 포트)
  --name my-streamlit \\              # 컨테이너 이름을 'my-streamlit'으로 지정
  my-streamlit:latest                # 실행할 이미지 이름과 태그 지정 (로컬에 있는 my-streamlit:latest 이미지 사용)

#활용 명령어
docker run --rm -it \\
  -p 8501:8501 \\
  --name my-streamlit \\
  my-streamlit:latest
```

- 브라우저에서 [http://localhost:8501](http://localhost:8501) 접속하면 동작을 확인할 수 있습니다.
    
- 컨테이너 배포 현황 확인
    

```bash
docker ps   #배포되어 동작중인 컨테이너 확인 명령어

#출력 예제
CONTAINER ID   IMAGE                                COMMAND           CREATED       STATUS                  PORTS                                           NAMES
86ccb74d94c0   ghcr.io/open-webui/open-webui:main   "bash start.sh"   4 weeks ago   Up 18 hours (healthy)   0.0.0.0:18080->8080/tcp, [::]:18080->8080/tcp   open-webui
```

### 3) 변경사항 반영 흐름

1. 코드 수정
2. 다시 빌드: `docker build -t my-streamlit:latest .`
3. 컨테이너 재실행

### 4) 환경변수 사용 예시

```bash
docker run --rm -it -p 8501:8501 \\
  -e GEMMA_API_KEY=your_api_key \\
  my-streamlit:latest
```

- 코드에서 `os.getenv("GEMMA_API_KEY")` 로 참조

### 정리

### docker 빌드에 필요한 파일 정리

아래 3가지만 있으면 기본 빌드가 가능합니다.

1. requirements.txt

```
streamlit
requests
# 필요시 추가
PyPDF2
Pillow
pytesseract
```

2. Dockerfile

```docker
FROM python:3.11-slim
LABEL maintainer="Gemma AI Chatbot"
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \\
    curl \\
  && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \\
    pip install --no-cache-dir -r requirements.txt
COPY [abcd.py](<http://abcd.py>) .
RUN useradd --create-home --shell /bin/bash appuser && \\
    chown -R appuser:appuser /app
USER appuser
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\
  CMD curl -f <http://localhost:8501> || exit 1
EXPOSE 8501
CMD ["streamlit", "run", "[abcd.py](<http://abcd.py>)", \\
     "--server.address=0.0.0.0", \\
     "--server.port=8501", \\
     "--server.headless=true", \\
     "--server.enableCORS=false", \\
     "--server.enableXsrfProtection=false"]
```

3. 애플리케이션 파일

```python
# [abcd.py](<http://abcd.py>) (Streamlit 예시)
import os
import streamlit as st

st.set_page_config(page_title="Demo", page_icon="🤖", layout="wide")
st.title("Streamlit Demo")
api_key = os.getenv("GEMMA_API_KEY", "<unset>")
st.write(f"GEMMA_API_KEY: {api_key}")

user_input = st.text_input("Say something")
if st.button("Run"):
    st.success(f"You said: {user_input}")
```

권장) .dockerignore

```
.venv/
__pycache__/
*.pyc
*.log
.env
.git
.gitignore
.DS_Store
```

이제 아래 명령으로 빌드와 실행을 진행하면 됩니다.

```bash
docker build -t my-streamlit:latest .
docker run --rm -it -p 8501:8501 my-streamlit:latest
```

컨테이너 이미지 종료

ㄱ. 현재 구동중인 컨테이너 확인

```bash
docker ps   #배포되어 동작중인 컨테이너 확인 명령어

#출력 예제
CONTAINER ID   IMAGE                                COMMAND           CREATED       STATUS                  PORTS                                           NAMES
86ccb74d94c0   ghcr.io/open-webui/open-webui:main   "bash start.sh"   4 weeks ago   Up 18 hours (healthy)   0.0.0.0:18080->8080/tcp, [::]:18080->8080/tcp   open-webui
```

ㄴ. 컨테이너 중지

```bash
docker stop [컨테이너 ID 또는 이름]

# 실제 사용 예제(id가 a1b2c3d4e5, name이 mysql인 경우 둘 다 가능)
docker stop a1b2c3d4e5
docker stop mysql
```

컨테이너 이미지 삭제

ㄱ. 컨테이너 이미지 조회

```bash
docker images  #컨테이너 이미지 확인 명령어

# 출력 예제
REPOSITORY                      TAG         IMAGE ID       CREATED        SIZE
chatbot                         latest      9e2dd74fc284   2 weeks ago    560MB
my-st-app                       latest      6639df039e20   3 weeks ago    540MB
<none>                          <none>      11217ace2275   3 weeks ago    540MB
<none>                          <none>      cccc7c00906f   3 weeks ago    540MB
my-streamlit-app                latest      cc4d692b905f   3 weeks ago    540MB
<none>                          <none>      f422101ff8ba   3 weeks ago    540MB
<none>                          <none>      fa9643e1d2ed   3 weeks ago    540MB
python                          3.11-slim   c4640ec0986f   2 months ago   125MB
ghcr.io/open-webui/open-webui   main        21bb7e0892cf   2 months ago   4.78GB
nginx                           latest      2cd1d97f893f   3 months ago   192MB
ollama/ollama                   latest      029391db139c   3 months ago   2.27GB
gcr.io/k8s-minikube/kicbase     v0.0.46     e72c4cbe9b29   9 months ago   1.31GB
```

ㄴ. 컨테이너 이미지 삭제

```bash
docker rmi [이미지 ID 또는 이름]

# 실제 사용 예제(id가 a1b2c3d4e5, name이 mysql인 경우 둘 다 가능)
docker rmi a1b2c3d4e5
docker rmi mysql
```

[컨테이너 기타](https://www.notion.so/28d9de7ee07180569b21e5d3701aa6a5?pvs=21)
