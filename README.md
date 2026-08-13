# skala-vue

# 0811 Vue.js 과제

- **제출일**: 2026년 8월 11일

## 과제 1: WeatherMockup

두 가지 버전으로 작업했습니다. 아래 링크에서 확인하실 수 있습니다.

1. **CSS 적용 버전**: [src/components/mockup/WeatherMockup.vue](src/components/mockup/WeatherMockup.vue)
   <br>
   ![CSS 적용 버전 결과](docs/weatherMockUp_css.png)
2. **CSS 미적용 버전**: [src/components/mockup/WeatherMockupNoCSS.vue](src/components/mockup/WeatherMockupNoCSS.vue)

---

## 과제 2: WeatherComposition

두 가지 버전으로 작업했습니다. 아래 링크에서 확인하실 수 있습니다.

1. **CSS 적용 버전**: [src/components/weathercomposition/WeatherComposition.vue](src/components/weathercomposition/WeatherComposition.vue)
   <br>
   ![CSS 적용 버전 결과](docs/weatherComposition_css.png)
2. **CSS 미적용 버전**: [src/components/weathercomposition/WeatherCompositionNoCSS.vue](src/components/weathercomposition/WeatherCompositionNoCSS.vue)

---

## 과제 3: Weather Component (컴포넌트 분리)

컴포넌트를 여러 개로 분리하여 작업했습니다. 메인 진입점은 `WeatherParent.vue`입니다. 아래 링크에서 확인하실 수 있습니다.

- **메인 컴포넌트**: [src/components/ weathercomponent/WeatherParent.vue](src/components/%20weathercomponent/WeatherParent.vue)
- **하위 컴포넌트**:
  - [src/components/ weathercomponent/WeatherCard.vue](src/components/%20weathercomponent/WeatherCard.vue)
  - [src/components/ weathercomponent/SearchBar.vue](src/components/%20weathercomponent/SearchBar.vue)
  - [src/components/ weathercomponent/BaseDashboardCard.vue](src/components/%20weathercomponent/BaseDashboardCard.vue)
  - [src/components/ weathercomponent/SelectionFeedback.vue](src/components/%20weathercomponent/SelectionFeedback.vue)

![결과 이미지](docs/weatherComposition_css.png)

---

## 과제 4: Weather Router (Vue Router 적용)

Vue Router를 도입하여 SPA(Single Page Application)로 구현했습니다. 주요 라우팅 및 뷰(View) 파일은 아래와 같습니다.

- **라우터 설정**: [src/router/index.js](src/router/index.js)
- **메인 레이아웃**: [src/App.vue](src/App.vue)
- **Views (페이지)**:
  - 대시보드 (Home): [src/views/WeatherHomeView.vue](src/views/WeatherHomeView.vue)
  - 서비스 소개 (About): [src/views/WeatherAboutView.vue](src/views/WeatherAboutView.vue)
  - 상세 날씨 (Detail): [src/views/WeatherDetailView.vue](src/views/WeatherDetailView.vue)
  - 기상 통계 (Stats): [src/views/WeatherStatsView.vue](src/views/WeatherStatsView.vue)
  - 404 에러 (NotFound): [src/views/NotFoundView.vue](src/views/NotFoundView.vue)

![Router 적용 결과](docs/router.png)

---

## 과제 5: Weather Store (Pinia 적용)

Pinia를 도입하여 전역 상태 관리를 구현했습니다. 온도 단위(섭씨/화씨)와 관련된 상태와 변환 로직을 스토어에 캡슐화하여 코드 중복을 제거했습니다.

- **스토어 파일**: [src/stores/configStore.js](src/stores/configStore.js)
- **주요 기능**:
  - `unit` (State): 현재 설정된 온도 단위 (celsius/fahrenheit)
  - `unitSymbol` (Getter): 화면에 표시할 기호 반환 (°C / °F)
  - `toggleUnit` (Action): 단위를 상호 전환하는 함수
  - `convertTemp` (Action): 섭씨 원본 데이터를 현재 단위에 맞춰 변환하는 함수
- **적용 화면**: 상단 네비게이션 바의 단위 변경 버튼(`UnitToggler.vue`) 클릭 시 메인 대시보드, 상세 날씨, 기상 통계 등 앱 전체에 단위가 일괄 적용됩니다.
  ![store 적용 결과](docs/store.png)

---

## 과제 6: OpenWeatherMap API 연동 및 데이터 상태 관리

기존에 사용하던 가짜(Mock) 데이터를 실제 OpenWeatherMap API 데이터로 대체하고, Pinia를 활용해 중앙 집중식으로 데이터를 관리하도록 개선했습니다.

- **API 호출 (Axios)**: [src/api/weatherApi.js](src/api/weatherApi.js)
  - `fetchWeatherByCity`: 전국 주요 8개 도시의 현재 날씨(온도, 습도, 풍속 등) 조회
  - `fetchAirPollution`: 반환받은 위경도를 이용해 실시간 대기질(미세먼지) 지수 추가 조회
- **날씨 전역 스토어**: [src/stores/weatherStore.js](src/stores/weatherStore.js)
  - 앱 구동 시 API를 최초 1회만 호출하여 데이터를 캐싱(`fetchAllWeather`).
  - 온도와 습도를 이용한 **불쾌지수 자동 계산**, 일출/일몰 시간 변환 등 데이터 가공을 스토어에서 일괄 처리.
- **적용 화면 (완벽 동기화)**:
  - `WeatherHomeView.vue`: 스토어와 연결하여 실제 지역별 날씨 카드 렌더링.
  - `WeatherDetailView.vue`: 선택 도시의 일출/일몰, 실시간 미세먼지, 풍속 상세 정보 표시.
  - `WeatherStatsView.vue`: 실제 데이터를 바탕으로 전국 평균 기온, 가장 더운 곳, 습도 경고 지역 통계에 더하여 **가장 바람이 강한 지역**과 **미세먼지 청정 구역** 통계를 추가 산출.

---

## 과제 7: UI Library (PrimeVue 3) 연동

오픈소스 UI 라이브러리인 **PrimeVue(버전 3)**를 전역에 연동하고, 프로젝트 기존의 고유한 디자인 톤을 해치지 않도록 `Lara Light Blue` 테마를 적용했습니다.

- **연동 설정 파일**: [src/main.js](src/main.js)
  - PrimeVue 코어 및 전용 CSS 테마 적용
- **적용 컴포넌트**:
  - `UnitToggler.vue`: 온도 단위 변경 버튼에 PrimeVue `<Button>` 적용 (Outlined + 아이콘)
  - `WeatherAboutView.vue`, `WeatherDetailView.vue`: 하단 '대시보드로 돌아가기' 이동 버튼을 깔끔한 PrimeVue `<Button>`으로 교체
- **결과**: 개발자가 직접 작성한 CSS와 외부 라이브러리 컴포넌트가 위화감 없이 어우러지는 하이브리드 UI 구현 완성!

---

## 추가 개선 사항 (UI/UX 및 버그 수정)

앱의 사용성을 높이기 위해 다음과 같은 디테일한 개선을 진행했습니다.

1. **전체 레이아웃 통일**: 상세 페이지와 통계 페이지의 배경 및 컨테이너 위치를 메인 대시보드와 동일한 모던 카드형 레이아웃으로 완벽하게 통일했습니다.
2. **불쾌지수 경고창 중복 버그 수정**: 홈 화면 진입 시 불쾌지수가 높은 지역이 여러 개일 경우 경고창(Alert)이 여러 번 연속해서 뜨는 불편한 UX를 수정하여, 사용자 피로도를 낮추었습니다.
3. **통계 데이터 빈 상태(Empty State) 처리**: 기상 통계 페이지에서 '습도 70% 이상인 지역'이나 '미세먼지 좋음 지역'이 하나도 없을 경우, 빈 화면이 아닌 "해당하는 지역이 없습니다"라는 친절한 안내 메시지가 나오도록 처리했습니다.

---

## 🚀 주요 페이지 및 파일 구조 안내

이 프로젝트는 Vue Router를 통해 크게 3가지 주요 페이지로 구성되어 있습니다.

### 1. 메인 대시보드 (`/src/views/WeatherHomeView.vue`)
![메인 대시보드](./docs/lastmain.png)
- **역할**: 전국 주요 도시의 현재 날씨(온도, 체감 온도, 습도, 미세먼지 등)를 카드 형태로 한눈에 보여주는 메인 화면입니다.
- **주요 기능**: 
  - 검색창(`src/components/exercise/SearchBar.vue`)을 통한 실시간 도시 검색 필터링
  - 도시별 날씨 상세 페이지로 이동
  - 🚨 **불쾌지수 경고**: 불쾌지수(Discomfort Index)가 높은 도시 카드를 클릭하면 브라우저 경고창(Alert)으로 알림 발생
    <br>![불쾌지수 경고](./docs/lastalert.png)

### 2. 도시별 상세 예보 (`/src/views/WeatherDetailView.vue`)
![상세 예보](./docs/lastdetail.png)
- **역할**: 대시보드에서 특정 도시를 클릭했을 때 나타나는 상세 정보 페이지입니다.
- **주요 기능**: 현재 날씨 외에도 **향후 24시간 시간별 일기 예보** 리스트를 스크롤 형태로 제공합니다.

### 3. 기상 통계 분석 (`/src/views/WeatherStatsView.vue`)
![기상 통계 분석](./docs/laststats.png)
- **역할**: 받아온 날씨 데이터를 바탕으로 다양한 기상 통계를 계산하여 보여줍니다.
- **주요 기능**: 
  - 전국 평균 기온 계산
  - 가장 덥거나 추운 지역, 바람이 강한 지역 도출
  - ✈️ **여행가기 좋은 지역 추천 (온도 18~26도, 습도 60% 이하, 미세먼지 좋음/보통)**

### 4. 기타 페이지 및 공통 컴포넌트
- **기타 뷰(View)**: 
  - `src/views/WeatherAboutView.vue` (서비스 소개 페이지)
    <br>![서비스 소개](./docs/lastabout.png)
  - `src/views/NotFoundView.vue` (잘못된 경로 진입 시 보여주는 404 에러 페이지)
    <br>![404 에러](./docs/last404.png)
  - `src/App.vue` (최상위 라우팅 및 전역 컴포넌트 관리)
- **UI 컴포넌트**: 
  - `src/components/exercise/WeatherCard.vue` (날씨 정보 표시 카드)
  - `src/components/exercise/SearchBar.vue` (상단 검색창)
  - `src/components/exercise/UnitToggler.vue` (단위 변환 토글 버튼)
  - `src/components/exercise/SelectionFeedback.vue` (도시 선택 시 하단에 표시되는 알림바)
- **상태 관리**: `src/stores/weatherStore.js` (API 호출 및 날씨 전역 상태 관리), `src/stores/configStore.js` (온도 단위 전역 상태 관리)

---

## 🤖 구글 Gemini 기반 '날씨 요정 챗봇' (보안 비활성화 상태)

![날씨 요정 챗봇](./docs/lastchatbot.png)

프로젝트 내부에 구글의 **Gemini AI API**와 **Function Calling(도구 호출)** 기능을 활용한 인공지능 날씨 챗봇 기능이 완벽하게 구현되어 있습니다.

- **구현 내용**: `src/components/chatbot/WeatherChatbot.vue`를 통해 우측 하단 플로팅 버튼으로 챗봇을 열 수 있으며, 실시간 스트리밍(Streaming) 타이핑 효과로 날씨를 묻고 답할 수 있도록 개발되었습니다.
- **보안 처리 (주석 처리)**: 현재 Vercel과 같은 클라이언트 환경(프론트엔드)에서 직접 API를 호출할 경우 `VITE_GEMINI_API_KEY`가 브라우저 네트워크를 통해 유출될 위험이 존재합니다. 
- **조치 결과**: 실무 보안 원칙을 준수하기 위해 코드는 모두 완성하여 `src/components/chatbot/WeatherChatbot.vue` 파일로 남겨두었지만, 메인 앱(`src/App.vue`)에서의 렌더링은 **임시 주석 처리(비활성화)**하여 배포 시 API 키 유출을 원천 차단해 두었습니다.

---

### 실행 방법

```sh
npm install
npm run dev
```
