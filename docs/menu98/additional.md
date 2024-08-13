---
layout: default
title: k8s 활용팁 Shell 추가 추천 명령어
nav_order: 99
parent: shell script basic
---

# k8s 활용팁 Shell 추가 추천 명령어
{: .no_toc }

쿠버네티스 명령어 단순화
```bash
alias k=kubectl
```

zsh + 하이라이트 + 자동추천 
```bash
udo yum install zsh
chsh -s /bin/zsh
# pw : student/student

# ohmyzsh 설치
sh -c "$(wget https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)" 

# highlighting 
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

# auto suggestions
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# vim ~/.zshrc
plugins=(git zsh-syntax-highlighting zsh-autosuggestions)
```

OpenShift 로그인 자동화
로그인 작업을 al, dl로 단순화 가능
운영자
```bssh
# admin login 설정
echo "alias al='oc login -u admin -p redhatocp https://api.ocp4.example.com:6443'" >> ~/.zshrc
```
개발자
```bash
# developer login 설정
echo "alias dl='oc login -u developer -p developer https://api.ocp4.example.com:6443'" >> ~/.zshrc
```
