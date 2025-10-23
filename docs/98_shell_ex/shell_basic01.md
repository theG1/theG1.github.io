---
layout: default
title: Shell 기본 명령어
nav_order: 2
parent: shell script basic
---

# Shell 기본 명령어
{: .no_toc }

<h1>shell 베이직</h1>
<h2>1. read로 사용자 입력 받기</h2>

다음과 같이 사용자로부터 입력을 받고, 변수 name에 저장할 수 있습니다. 입력을 안내하는 메시지가 출력되고, 그 다음 줄에서 사용자 입력을 받을 수 있습니다.<br/>
```shell
#!/bin/bash

echo "enter the user name: "
read name
echo "name:$name"
```
<br/>
<h2>2. 두개 이상의 사용자 입력 받기</h2>
위의 예제는 사용자로부터 1개의 입력을 받았습니다. 두개 이상의 입력을 받을 때는, read에 두개 이상의 변수들을 쓰시면 됩니다. 사용자가 입력하는 데이터가 순차적으로 변수에 저장됩니다.<br/>

```shell
#!/bin/bash

echo "enter the user name and email: "
read name email
echo "name:$name, email: $email"
```
<br/>

<h2>3. 메시지와 같은 라인에서 입력 받기</h2>
안내 메시지와 동일한 라인에서 사용자 입력으려면 read의 -p 옵션을 이용하시면 됩니다. read -p "MESSAGE" VARIABLE 형식으로 구현하면, 메시지를 보여주고 사용자로부터 입력을 받을 수 있습니다.<br/>

```shell
#!/bin/bash

read -p "Enter the name: " name
echo "name:$name"
```

<br/>

<h2>4. 터미널에서 사용자 입력 숨기기</h2>
사용자로부터 입력을 받을 때 패스워드처럼 화면에 띄우지 말아야하는 정보들이 있습니다. -s 옵션을 추가하면 사용자 입력이 화면에서 보이지 않습니다.<br/>

```shell
#!/bin/bash

read -p "id: " id
read -sp "password: " pw

echo
echo "name is $id"
echo "pw is $pw"
```

<br/>
<h2>5. 가변적으로 사용자 입력 받기</h2>
-a 옵션은 사용자 입력을 배열로 받습니다. 사용자가 3개를 입력하면, 배열의 크기는 3이되고 2개를 입력하면 배열의 크기는 2가 됩니다. ${#names[*]}는 배열의 길이를 의미합니다.<br/>

```shell
#!/bin/bash

echo "enter names"
read -a names

## ${names[*]} 배열의 길이
echo "Input size: ${#names[*]}"

echo "1st: ${names[0]}, 2nd: ${names[1]}, 3rd: ${names[2]}"
```

<br/>

<h2>5.1 반복문으로 가변 입력 출력</h2>
가변적으로 받은 사용자 입력을 for loop를 이용하여 처리할 수 있습니다. ${names[*]}는 배열의 모든 데이터를 의미하며, 반복문으로 모든 데이터를 순회할 수 있습니다.<br/>

```shell
#!/bin/bash

echo "enter names"
read -a names

echo "Input Size: ${#names[*]}"

for name in "${names[*]}"
do
        echo "name: $name"
        echo
done
````


<br/>

{: .fs-6 .fw-300 }
