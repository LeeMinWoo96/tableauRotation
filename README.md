# tableauRotation
태블로 Embedded Views Auto Rotation

V. 24.08.05  
Tableau Ticket을 사용하여 구현되어 SameSite 이슈 떄문에 FireFox 기반 브라우저에만 작동   
[1. SameSite Issue 란?](https://www.codeit.kr/tutorials/94/%EC%BF%A0%ED%82%A4%EC%9D%98%20SameSite%20%EC%98%B5%EC%85%98%EC%9D%B4%EB%9E%80%3F)   
[2. Tableau SameSite Issue](https://help.salesforce.com/s/articleView?id=001472205&type=1)



* 토큰 발급 요청 (태블로 서버 URL) 과 Node 서버의 URL 이 일치하면 SameSite 무관   
* 즉  태블로 서버가 공인망이면, Node 서버도 동일한 서버의 공인망이여야함, 만약 노트북 개발환경애서 해야한다면, https 설정과 SameSite=None 가 필수   
* 태블로에서 SameSite=None 설정 가능 유무는 확인 필요
