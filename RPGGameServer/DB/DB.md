# DB

- 구현에 걸리는 시간:  3
- 우선 순위: 1

---

- 모듈
    - UDP, HTTP 각자 시퀄라이즈로 구현
    - 로그인 부분(HTTP)
        
        ```jsx
        {
          "name": "1222sibal",
          "version": "1.0.0",
          "description": "",
          "main": "index.js",
          "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1",
            "start": "node app.js"
          },
          "author": "",
          "license": "ISC",
          "dependencies": {
            "express": "^4.17.2",
            "morgan": "^1.10.0",
            "mysql": "^2.18.1",
            "mysql2": "^2.3.3",
            "nunjucks": "^3.2.3",
            "require": "^2.4.20",
            "sequelize": "^6.12.1",
            "sequelize-cli": "^6.3.0"
          },
          "devDependencies": {
            "nodemon": "^2.0.15"
          }
        }
        
        ```
        
- 연결 구조 자세하게 정리
    - User DB 자세히 정리 필요
    - user 인게임, 로그인 DB 합치기
        
        ![rpg 로직2.jpg](DB%2091f1c2926d9840f5a3eba3bf406ab123/rpg_%EB%A1%9C%EC%A7%812.jpg)
        
- DB 구조
    - mysql DB 연결을 더 세세하게 정리(어떤 값, 어디로, 어떻게, 무엇을)
    
    ![rpg 로직1.jpg](DB%2091f1c2926d9840f5a3eba3bf406ab123/rpg_%EB%A1%9C%EC%A7%811.jpg)
    
- DB
    - 캐릭터 사망 시 DB에서 지우고 클라이언트에게 닉네임 값도 같이 보내주기(묘비)
        
        ![rpg 세부설계.jpg](DB%2091f1c2926d9840f5a3eba3bf406ab123/rpg_%EC%84%B8%EB%B6%80%EC%84%A4%EA%B3%84.jpg)
        
- 검증
    - 검증 조건
        - 로그인
        
        ```jsx
        http 서버 
        path: /login
        req: id , password
        처리 내용: 1.로그인 실패 시 실패 패킷 클라이언트로 전송
        						2.로그인 성공 시 DB에 닉네임(string),이메일(string),비밀번호(string),직업(string),HP(int),회전(float),위치(array[float,float,float]),숙련도(int),공격력(int)
        						3.클라이언트로 로그인 성공 패킷 클라이언트로 전송
        res: 로그인 bool
        db에서 아이디를 조회 
        ```
        
        ```jsx
        UDP 서버
        처리 내용: 1. 참여자 배열에 로그인 요청한 닉네임이 있는지 확인.
        						1-1.닉네임 있는 경우 로그인 실패
        						1-2.닉네임 없는 경우 클라이언트가 로그인 성공 패킷 서버로 전송.
        					2.DB에서 유저 정보를 조회해서 유저 객체를 생성한다.
        ```
        
        - 회원가입
            
            클라이언트 추가 요구 사항 - 회원가입 시 유니크 부분 res에 정확히 확인할 수 있도록  바람(ex. 사용할 수 없는 이메일 입니다. 이미 사용 중인 닉네임 입니다.)
            
        
        ```jsx
        http 서버
        path: /join
        req: id, 닉네임, password
        처리내용: 1. DB를 조회한다.
        					2. DB에서 같은 아이디와 닉네임이 있는지 비교한다.
        					3. 없을 경우 DB에 값을 저장한다. 그 후 클라이언트에 회원가입 성공 패킷 전송
        					4. 있을 경우 클라이언트에게 회원가입 실패 패킷 전송.
        res: 회원가입 성공 유무(bool)
        ```
        
        - 접속
        
        ```jsx
        UDP 서버
        처리 내용: 1. DB에서 닉네임 조회
        					2. DB에서 닉네임에 맞는 위치값 조회
        					3. 위치 값을 클라이언트로 전송
        					4. 위치 값에 다른 클라이언트가 있는 경우 랜덤 값을 위치 값으로 정함
        					5. 위치에 다른 클라이언트가 없는 경우 접속 성공
        ```
        
        - 캐릭터
        
        ```jsx
        http 서버
        path: /character
        req: 닉네임, 직업
        처리내용: 1. DB에서 닉네임을 조회한다.
        					2. 닉네임이 일치하는 유저 정보에 직업이 없을 경우
        						2-1.클라이언트에 캐릭터가 없다는 정보를 보낸다.
        						2-2. 닉네임 일치하는 유저 정보에 직업을 추가한다.
        					3. 닉네임이 일치하는 유저 정보에 직업이 있을 경우
        						3-1. 클라이언트로 캐릭터 있다는 정보를 보낸다.
        res: 캐릭터 유무(bool)
        ```
        
        ```jsx
        UDP 서버
        -조작: 1. 클라이언트가 보내는 값(닉네임, 위치, 회전, 액션 상태)을 받는다.
        -사망: 1. 클라이언트가 PD요청을 보낸다.
        			2. 플레이어 체력이 0보다 작은지 판단한다.
        				2-1. 0보다 작은 경우(플레이어 사망) 죽었다는 정보(true)를 클라이언트에 보낸다.
        				2-2. 0보다 큰 경우 클라이언트에 false를 보낸다.
        			3.죽은 경우 
        				3-1. DB에서 죽은 플레이어의 닉네임을 조회한다.
        				3-2. DB에서 죽은 플레이어 정보를 삭제한다.
        				3-3. 참여자 배열에서 삭제한다. 
        -몬스터를 공격
        	-숙련도: 1.클라이언트가 MD요청을 보낸다. 보내는 값(몬스터ID,경험치,플레이어 닉네임)
        					2. 유저의 공격력만큼 몬스터 HP에서 차감
        						2-1. 몬스터 HP - 유저 공격력 < 0 몬스터 사망
        							2-1-1. 몬스터 경험치를 플레이어 경험치에 더한다.
        							2-1-2. 몬스터를 삭제
        							2-1-3. 리스폰 시간 후 재생성
        						2-2. 몬스터 HP - 유저 공격력 > 0 (유저 공격을 맞고 몬스터가 살아있는 경우)
        -체력회복:
        ```
        
        - 몬스터
        
        ```jsx
        UDP서버
        몬스터 정보
        -몬스터id
        -몬스터 종류
        -위치
        -속도
        -HP
        -경험치
        -공격력
        -공격대상
        -공격종류
        -공격속도
        -리스폰 시간
        -마지막 공격 시간
        -초당 체력회복량
        
        플레이어를 공격: 1.클라이언트가 MA요청을 보낸다.
        								2.DB에서 닉네임 조회
        								3.몬스터 공격 범위 안에 플레이어가 있을 경우
        									3-1. 아무튼 따라감.
        									3-2. 공격 종류를 고른다.
        									3-3. 공격한다.
        									3-4. 마지막 공격 시간 기준으로 공격시간이 지나면
        										3-4-1. 어그로 풀린 경우 (플레이어가 공격범위 밖으로 나갔는지, 플레이어가 죽었는지 확인)
        											3-4-1-1. 리스폰 지점으로 돌아와 HP 회복.
        										3-4-2. 어그로 유지(플레이어가 공격범위 밖으로 안 나간 경우)
        											3-1 ~ 3-4의 과정을 반복한다.
        
        체력회복: 1. 어그로 풀린 경우 초당 체력회복량 만큼 HP 회복
        					2. 피가 최대일 경우는 체력회복 안함.
        ```
        
        - 프레임마다 처리
        
        ```jsx
        1. 프레임마다 유저배열 업데이트
         1-1. 유저 배열에는 유저 객체들이 저장되어 있음
        유저 객체
        -닉네임
        -직업
        -위치
        -회전
        -공격력
        -현재 HP
        -최대 HP
        -숙련도
        -액션상태
        2. 클라이언트가 CN요청을 보냈는지 확인
        
        ```
        
        - 로그아웃
        
        ```jsx
        1.정상적인 로그아웃
        	1-1. 클라이언트가 logout요청을 보낸다
        	1-2. DB에 유저정보 업데이트
        	1-3. 유저배열에서 로그아웃한 플레이어를 제거.
        2.비정상적 로그아웃
        	(강제종료,네트워크 끊김,재연결)
          2-1. 프레임마다 클라이언트가 CN요청을 보낸다.
        	2-2. CN요청이 안오면 1초마다 카운트 시작.
        		2-2-1. 카운트가 30이 되면 로그아웃.
        		2-2-2. CN요청이 안 왔다가 CN요청이 다시 오면 카운트를 30으로 변경
        ```
        
        ![명령.jpg](DB%2091f1c2926d9840f5a3eba3bf406ab123/%EB%AA%85%EB%A0%B9.jpg)