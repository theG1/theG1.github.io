---
title: "py 앱 만들기"
sidebar:
  order: 5
---

기존에 Do it LLM에서 수행한 내용을 바탕으로 합니다.

폴더 만들기(프로젝트 만들기)

해당 작업은 윈도우에서 진행해도 되지만 폴더 찾기가 매우 힘드므로, vs code 의 터미널에서 진행하는 것을 권장.

```bash
# mkdir <폴더이름> 리눅스에서 폴더를 만드는 명령어 입니다.
mkdir test
cd test # 테스트 폴더로 이동합니다.
```

가상 환경 만들기 (사실 이런 작업도 claude code가 대신 수행해줄수 있음)

```bash
# python -m venv <가상환경명>
python -m venv venv
```

Do it 책 내용을 참고해주세요 34페이지

책의 내용인 openai 를 활용하여, dotenv를 통해 api 를 보호하고 세팅한 것을 준비합니다.

중간에 필요한 내용들을 인스톨도 합니다.

```bash
pip install python-dotenv
pip install openai
pip install streamlit

```

.env

```python
OPENAI_API_KEY=<API키값>
```

예제 코드

streamlit_openai.py

```python
import re
import streamlit as st
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

# 사이드바: API 키를 원래 입력해야하나 미리 넣어주는 방식
with st.sidebar:
    open_api_key = os.getenv("OPENAI_API_KEY")
    # openai_api_key = st.text_input("OpenAI API Key", key="chatbot_api_key", type="password")
    "[Get your API key](<https://platform.openai.com/account/api-keys>)"
    "[View the code](<https://github.com/streamlit/llm-examples/blob/main/Chatbot.py>)"
    "[](<https://codespaces.new/streamlit/llm-examples?quickstart=1>)"
    
# 메인 페이지
st.title("💬Chatbot")

# 세션 상태에 메시지 저장
if "messages" not in st.session_state:
    st.session_state["messages"] = [{"role": "assistant", "content": "How can I help you today?"}]

# 대화 기록을 웹브라우저에 출력하는 부분. st.chat_message는 스트림릿 채팅 인터페이스에 메시지를 출력
for msg in st.session_state.messages:
    st.chat_message(msg["role"]).markdown(msg["content"])

# 사용자 입력을 받아서 OpenAI API에 전달하고, 응답을 받아서 다시 웹브라우저에 출력
if prompt := st.chat_input("Type your message"):
    # OpenAI API 키가 없으면 중단
    if not open_api_key:
        st.info("Please add your OpenAI API key to continue.")
        st.stop()
    # OpenAI 클라이언트 생성 및 메시지 추가 st.session_state.messages에 사용자 메시지 딕셔너리로 추가
    client = OpenAI(api_key=open_api_key)
    st.session_state.messages.append({"role": "user", "content": prompt})
    st.chat_message("user").markdown(prompt)
    # OpenAI API에 메시지 전달 및 응답 받기
    response = client.chat.completions.create(model="gpt-4o", messages=st.session_state.messages)
    msg = response.choices[0].message.content
    st.session_state.messages.append({"role": "assistant", "content": msg})
    st.chat_message("assistant").markdown(msg)
    
    
    
    
    
```

예제 Dockerfile

```bash
# 1. Python 베이스 이미지 선택
FROM python:alpine

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. requirements 설치
COPY requirements.txt .
RUN pip install --upgrade pip && \\
    pip install --no-cache-dir -r requirements.txt

# 4. 앱 코드 복사
COPY . .

# 5. 기본 실행 명령
EXPOSE 8501
CMD ["streamlit", "run", "streamlit_basic.py", "--server.address=0.0.0.0", "--server.port=8501"]

```

구동 및 접속

```python
streamlit run streamlit_openai.py
```
