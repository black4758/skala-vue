<!-- src/App.vue -->
<script setup>
// 💡 UnitToggler 컴포넌트를 불러옵니다!
import UnitToggler from './components/exercise/UnitToggler.vue'
import WeatherChatbot from './components/chatbot/WeatherChatbot.vue'
</script>

<template>
  <div class="app-container">
    <!-- 내비게이션 바 -->
    <nav class="main-nav">
      <h1>☁️ Weather App</h1>
      
      <!-- 💡 링크들과 토글 버튼을 나란히 두기 위해 nav-right라는 div로 묶어줍니다 -->
      <div class="nav-right">
        <div class="links">
          <RouterLink to="/">대시보드</RouterLink>
          <RouterLink to="/about">서비스 소개</RouterLink>
          <RouterLink to="/stats">기상 통계</RouterLink>
        </div>
        
        <!-- 💡 여기에 단위 변경 토글 버튼 배치! -->
        <UnitToggler />
      </div>
    </nav>

    <!-- 라우트된 컴포넌트가 렌더링되는 영역 -->
    <main class="content-area">
      <RouterView />
    </main>

    <!-- 날씨 챗봇 컴포넌트 (전역) -->
    <WeatherChatbot />
  </div>
</template>

<style scoped>
.app-container {
  font-family: 'Pretendard', sans-serif;
  background-color: #f1f5f9;
  min-height: 100vh;
}

.main-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.main-nav h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #0f172a;
}

/* 💡 새로 추가된 스타일: 링크들과 토글 버튼 사이의 간격을 조절합니다 */
.nav-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.links {
  display: flex;
  gap: 16px;
}

.links a {
  text-decoration: none;
  color: #64748b;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s;
}

.links a:hover, .links a.router-link-active {
  background-color: #eff6ff;
  color: #2563eb;
}

.content-area {
  --primary-color: #2563eb;
  --primary-hover: #1d4ed8;
  --bg-gradient: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  --card-bg: #ffffff;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --border-color: #e2e8f0;

  width: 100%;
  max-width: 768px;
  margin: 40px auto;
  padding: 32px;
  background: var(--bg-gradient);
  border-radius: 24px;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
  color: var(--text-main);
  box-sizing: border-box;
}
</style>